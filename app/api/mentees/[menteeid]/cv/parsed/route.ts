import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Resume from "@/models/Resume";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ menteeid: string }> } // ⚠️ مهم جداً يكون Promise
) {
  try {
    await connectDB();

    const { menteeid } = await ctx.params;
    const { searchParams } = new URL(req.url);
    const resumeId = searchParams.get("resumeId");

    console.log("📦 menteeid:", menteeid);
    console.log("📦 resumeId:", resumeId);

    if (!menteeid || !resumeId) {
      return NextResponse.json(
        { ok: false, error: "Missing menteeId or resumeId" },
        { status: 400 }
      );
    }

    // 🧠 جلب السجل من قاعدة البيانات
    const resume = await Resume.findById(resumeId);
    if (!resume) {
      return NextResponse.json(
        { ok: false, error: "Resume not found" },
        { status: 404 }
      );
    }

    // 🔹 JSON المحلّل
    const affindaJson = resume.parsed || resume.affinda_json;
    if (!affindaJson) {
      return NextResponse.json(
        { ok: false, error: "No parsed data available" },
        { status: 404 }
      );
    }

    console.log("✅ Parsed data fetched for:", resumeId);
    return NextResponse.json({
      ok: true,
      menteeId: menteeid,
      resumeId,
      affindaJson,
    });
  } catch (error: any) {
    console.error("❌ /parsed route error:", error);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}
