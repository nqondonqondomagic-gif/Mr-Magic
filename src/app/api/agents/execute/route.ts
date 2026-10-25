import { NextRequest, NextResponse } from "next/server";
import { agentOrchestrator } from "@/lib/ai/orchestrator";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { agentId, organisationId = "org-apex-001", triggerSource = "manual", promptOverride } = body;

    if (!agentId) {
      return NextResponse.json({ success: false, error: "Missing agentId" }, { status: 400 });
    }

    const result = await agentOrchestrator.runAgent({
      agentId,
      organisationId,
      triggerSource,
      promptOverride,
    });

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
