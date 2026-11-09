import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/store";
import { agentOrchestrator } from "@/lib/ai/orchestrator";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { action, comments, organisationId = "org-apex-001", reviewerId = "user-sipho-001" } = body;

    if (!action || (action !== "approved" && action !== "rejected")) {
      return NextResponse.json({ success: false, error: "Action must be 'approved' or 'rejected'" }, { status: 400 });
    }

    const result = await agentOrchestrator.resolveApproval({
      approvalId: id,
      organisationId,
      action,
      reviewerId,
      comments,
    });

    if (!result) {
      return NextResponse.json(
        { success: false, error: "Approval record not found or does not belong to this organisation." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      approval: result.approval,
      executionResult: result.executionResult,
      approvals: db.getAgentApprovals(organisationId),
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
