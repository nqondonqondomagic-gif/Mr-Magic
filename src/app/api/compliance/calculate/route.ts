import { NextRequest, NextResponse } from "next/server";
import { sarsEngine } from "@/lib/compliance/sars";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const orgId = searchParams.get("orgId") || "org-apex-001";
    const type = searchParams.get("type") || "vat201";
    const period = searchParams.get("period") || "2026/09";

    if (type === "vat201") {
      const workpaper = sarsEngine.generateVAT201Workpaper(orgId, period);
      return NextResponse.json({ success: true, workpaper });
    }

    if (type === "emp201") {
      const workpaper = sarsEngine.generateEMP201Workpaper(orgId, period);
      return NextResponse.json({ success: true, workpaper });
    }

    if (type === "irp6") {
      const workpaper = sarsEngine.generateProvisionalIRP6Workpaper(orgId, 2);
      return NextResponse.json({ success: true, workpaper });
    }

    return NextResponse.json({ success: false, error: "Unsupported tax type" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
