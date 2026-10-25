import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/store";

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

    const resolved = db.resolveAgentApproval(id, organisationId, action, reviewerId, comments);
    if (!resolved) {
      return NextResponse.json({ success: false, error: "Approval record not found or does not belong to this organisation." }, { status: 404 });
    }

    // Add audit log
    db.addAuditLog({
      id: `audit-${Date.now()}`,
      organisation_id: organisationId,
      user_id: reviewerId,
      user_name: "Business Owner",
      action: `agent_action_${action}`,
      entity_type: "agent_approval",
      entity_id: id,
      details: `Action "${resolved.description}" was ${action.toUpperCase()} by reviewer. Comments: ${comments || "None"}`,
      created_at: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, approval: resolved });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
