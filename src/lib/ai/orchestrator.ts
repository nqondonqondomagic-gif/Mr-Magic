// ==============================================================================
// BUSINESS MANAGER — AI AGENT ORCHESTRATION ENGINE
// MAGIC QUANT TRADING Corp | AI Business Operating System
// ==============================================================================

import { db } from "@/lib/db/store";
import { BUSINESS_TOOLS } from "@/lib/ai/tools";
import { llmProvider } from "@/lib/ai/llm-provider";
import { AgentExecution, AgentExecutionStep, AgentApproval } from "@/types";

export interface ExecuteAgentOptions {
  agentId: string;
  organisationId: string;
  triggerSource: "manual" | "schedule" | "webhook" | "user_prompt";
  promptOverride?: string;
}

export interface ExecuteAgentResult {
  execution: AgentExecution;
  approvalsCreated: AgentApproval[];
  stepsExecuted: AgentExecutionStep[];
  success: boolean;
  message: string;
}

export class AgentOrchestrator {
  /**
   * Executes an AI agent with server-side tool validation and human approval gating.
   */
  public async runAgent(options: ExecuteAgentOptions): Promise<ExecuteAgentResult> {
    const startTime = Date.now();

    // 1. Load Organisation & Agent Context
    const org = db.getOrganisation(options.organisationId);
    if (!org) throw new Error(`Organisation ${options.organisationId} not found.`);

    const agent = db.getAgentById(options.agentId, options.organisationId);
    if (!agent) throw new Error(`Agent ${options.agentId} not found or belongs to another tenant.`);

    if (!agent.is_active) {
      throw new Error(`Agent ${agent.name} is currently paused or inactive.`);
    }

    // 2. Initialize Execution Record
    const executionId = `exec-${Date.now()}`;
    const execution: AgentExecution = {
      id: executionId,
      organisation_id: org.id,
      agent_id: agent.id,
      agent_name: agent.name,
      trigger_source: options.triggerSource,
      status: "running",
      started_at: new Date().toISOString(),
      total_tokens: 0,
      execution_duration_ms: 0,
      steps: [],
      created_at: new Date().toISOString(),
    };
    db.createAgentExecution(execution);

    const stepsExecuted: AgentExecutionStep[] = [];
    const approvalsCreated: AgentApproval[] = [];

    try {
      // 3. Plan Operations with LLM Provider
      const userPrompt = options.promptOverride || `Execute standard scheduled operations for ${agent.name}.`;
      const plan = await llmProvider.planExecution({
        systemInstructions: agent.system_instructions,
        agentName: agent.name,
        category: agent.category,
        prompt: userPrompt,
        availableTools: agent.permitted_tools,
      });

      let requiresHumanApproval = false;
      let stepNumber = 1;

      // 4. Step-by-Step Validation & Execution
      for (const planStep of plan.steps) {
        const toolDef = BUSINESS_TOOLS[planStep.tool];

        // Server-Side Tool Permission Check
        if (!toolDef) {
          const stepRecord: AgentExecutionStep = {
            id: `step-${Date.now()}-${stepNumber}`,
            execution_id: executionId,
            step_number: stepNumber++,
            tool_name: planStep.tool,
            tool_input: planStep.arguments,
            status: "failed",
            tool_output: { error: `Tool ${planStep.tool} does not exist in server registry.` },
            created_at: new Date().toISOString(),
          };
          stepsExecuted.push(stepRecord);
          continue;
        }

        // Check if agent is permitted to use this tool
        if (!agent.permitted_tools.includes(planStep.tool)) {
          const stepRecord: AgentExecutionStep = {
            id: `step-${Date.now()}-${stepNumber}`,
            execution_id: executionId,
            step_number: stepNumber++,
            tool_name: planStep.tool,
            tool_input: planStep.arguments,
            status: "failed",
            tool_output: { error: `Permission Denied: Agent ${agent.name} is not permitted to use ${planStep.tool}.` },
            created_at: new Date().toISOString(),
          };
          stepsExecuted.push(stepRecord);
          continue;
        }

        // Check if tool is Sensitive or requires Human Approval
        const isRestrictedByAgent = agent.requires_approval_for.includes(planStep.tool);
        if (toolDef.isSensitive || isRestrictedByAgent) {
          requiresHumanApproval = true;

          // Stage an AgentApproval in the database
          const approval: AgentApproval = {
            id: `appr-${Date.now()}-${stepNumber}`,
            organisation_id: org.id,
            execution_id: executionId,
            agent_id: agent.id,
            agent_name: agent.name,
            action_type: planStep.tool,
            description: `Proposed action by ${agent.name}: ${planStep.rationale}`,
            proposed_payload: planStep.arguments,
            status: "pending",
            expires_at: new Date(Date.now() + 24 * 3600000).toISOString(),
            created_at: new Date().toISOString(),
          };
          db.createAgentApproval(approval);
          approvalsCreated.push(approval);

          const stepRecord: AgentExecutionStep = {
            id: `step-${Date.now()}-${stepNumber}`,
            execution_id: executionId,
            step_number: stepNumber++,
            tool_name: planStep.tool,
            tool_input: planStep.arguments,
            status: "blocked_approval",
            tool_output: {
              requires_human_approval: true,
              approval_id: approval.id,
              status: "Queued in /app/approvals for Business Owner sign-off.",
            },
            created_at: new Date().toISOString(),
          };
          stepsExecuted.push(stepRecord);

          // Create notification for Business Owner
          db.state.notifications.unshift({
            id: `notif-${Date.now()}`,
            organisation_id: org.id,
            title: `Action Approval Needed from ${agent.name}`,
            message: approval.description,
            type: "approval_required",
            action_url: "/app/approvals",
            is_read: false,
            created_at: new Date().toISOString(),
          });
          continue;
        }

        // Execute safe tool
        try {
          const output = await toolDef.handler(planStep.arguments, {
            orgId: org.id,
            agentId: agent.id,
            executionId,
          });

          const stepRecord: AgentExecutionStep = {
            id: `step-${Date.now()}-${stepNumber}`,
            execution_id: executionId,
            step_number: stepNumber++,
            tool_name: planStep.tool,
            tool_input: planStep.arguments,
            status: "success",
            tool_output: output,
            created_at: new Date().toISOString(),
          };
          stepsExecuted.push(stepRecord);
        } catch (err: any) {
          const stepRecord: AgentExecutionStep = {
            id: `step-${Date.now()}-${stepNumber}`,
            execution_id: executionId,
            step_number: stepNumber++,
            tool_name: planStep.tool,
            tool_input: planStep.arguments,
            status: "failed",
            tool_output: { error: err.message || "Tool execution failed." },
            created_at: new Date().toISOString(),
          };
          stepsExecuted.push(stepRecord);
        }
      }

      // Finalize Execution Record
      const durationMs = Date.now() - startTime;
      const finalStatus = requiresHumanApproval ? "waiting_approval" : "completed";

      execution.status = finalStatus;
      execution.completed_at = new Date().toISOString();
      execution.execution_duration_ms = durationMs;
      execution.total_tokens = 1500 + stepsExecuted.length * 450;
      execution.steps = stepsExecuted;

      db.updateAgentExecution(executionId, org.id, execution);

      // Record Audit Log
      db.addAuditLog({
        id: `audit-${Date.now()}`,
        organisation_id: org.id,
        user_name: agent.name,
        action: "agent_executed",
        entity_type: "agent_execution",
        entity_id: executionId,
        details: `${agent.name} executed ${stepsExecuted.length} steps. Status: ${finalStatus}. Approvals generated: ${approvalsCreated.length}.`,
        created_at: new Date().toISOString(),
      });

      return {
        execution,
        approvalsCreated,
        stepsExecuted,
        success: true,
        message: requiresHumanApproval
          ? `${agent.name} executed read operations and staged ${approvalsCreated.length} action(s) for your approval.`
          : `${agent.name} completed all operations successfully.`,
      };
    } catch (error: any) {
      execution.status = "failed";
      execution.error_message = error.message;
      execution.execution_duration_ms = Date.now() - startTime;
      db.updateAgentExecution(executionId, org.id, execution);

      return {
        execution,
        approvalsCreated: [],
        stepsExecuted: [],
        success: false,
        message: error.message,
      };
    }
  }
}

export const agentOrchestrator = new AgentOrchestrator();
