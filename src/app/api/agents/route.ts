import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/store";
import { Agent } from "@/types";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const organisationId = searchParams.get("organisationId") || "org-apex-001";

  return NextResponse.json({
    success: true,
    agents: db.getAgents(organisationId),
    executions: db.getAgentExecutions(organisationId),
    approvals: db.getAgentApprovals(organisationId),
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { agent, organisationId = "org-apex-001" } = body;

    if (!agent || !agent.name) {
      return NextResponse.json({ success: false, error: "Missing agent payload" }, { status: 400 });
    }

    const now = new Date().toISOString();
    const newAgent: Agent = {
      id: agent.id || `agent-${Date.now()}`,
      organisation_id: organisationId,
      name: agent.name,
      category: agent.category || "sales_agent",
      description: agent.description || "",
      system_instructions: agent.system_instructions || "",
      model: agent.model || "gpt-4o",
      permitted_tools: Array.isArray(agent.permitted_tools) ? agent.permitted_tools : [],
      permitted_modules: Array.isArray(agent.permitted_modules)
        ? agent.permitted_modules
        : ["crm", "sales", "tasks"],
      schedule: agent.schedule,
      requires_approval_for: Array.isArray(agent.requires_approval_for) ? agent.requires_approval_for : [],
      budget_tokens: Number(agent.budget_tokens) || 10000,
      is_active: agent.is_active !== undefined ? Boolean(agent.is_active) : true,
      created_at: agent.created_at || now,
      updated_at: now,
    };

    const existing = db.getAgentById(newAgent.id, organisationId);
    if (!existing) {
      db.createAgent(newAgent);
      db.addAuditLog({
        id: `audit-${Date.now()}`,
        organisation_id: organisationId,
        user_name: "Sipho Ndlovu",
        action: "agent_created",
        entity_type: "agent",
        entity_id: newAgent.id,
        details: `Created custom agent "${newAgent.name}" with ${newAgent.permitted_tools.length} permitted tools.`,
        created_at: now,
      });
    }

    return NextResponse.json({
      success: true,
      agent: newAgent,
      agents: db.getAgents(organisationId),
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { agentId, organisationId = "org-apex-001", updates } = body;

    if (!agentId || !updates) {
      return NextResponse.json({ success: false, error: "Missing agentId or updates" }, { status: 400 });
    }

    const updated = db.updateAgent(agentId, organisationId, updates);
    if (!updated) {
      return NextResponse.json({ success: false, error: "Agent not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      agent: updated,
      agents: db.getAgents(organisationId),
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

