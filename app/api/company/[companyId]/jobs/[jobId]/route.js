import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Job from "@/models/Job";

const unwrapParams = async (ctx) => {
  const p = ctx?.params;
  return p && typeof p.then === "function" ? await p : p;
};

/* ============================================
   GET — Single job
=============================================*/
export async function GET(req, ctx) {
  try {
    await connectDB();
    const p = await unwrapParams(ctx);
    const { companyId, jobId } = p;

    const job = await Job.findOne({ _id: jobId, companyId });

    if (!job) {
      return NextResponse.json(
        { ok: false, message: "Job not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ ok: true, job });
  } catch (err) {
    console.error("Get Job Error:", err);
    return NextResponse.json(
      { ok: false, message: "Server error" },
      { status: 500 }
    );
  }
}

/* ============================================
   PUT — Update entire job
=============================================*/
export async function PUT(req, ctx) {
  try {
    await connectDB();
    const p = await unwrapParams(ctx);
    const { companyId, jobId } = p;

    const body = await req.json();

    const updated = await Job.findOneAndUpdate(
      { _id: jobId, companyId },
      body,
      { new: true }
    );

    if (!updated) {
      return NextResponse.json(
        { ok: false, message: "Job not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ ok: true, job: updated });
  } catch (err) {
    console.error("Update Job Error:", err);
    return NextResponse.json(
      { ok: false, message: "Server error" },
      { status: 500 }
    );
  }
}

/* ============================================
   PATCH — Close job
=============================================*/
export async function PATCH(req, ctx) {
  try {
    await connectDB();
    const p = await unwrapParams(ctx);
    const { companyId, jobId } = p;

    const job = await Job.findOneAndUpdate(
      { _id: jobId, companyId },
      { status: "closed" },
      { new: true }
    );

    if (!job) {
      return NextResponse.json(
        { ok: false, message: "Job not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ok: true,
      message: "Job closed successfully",
      job,
    });
  } catch (err) {
    console.error("Close Job Error:", err);
    return NextResponse.json(
      { ok: false, message: "Server error" },
      { status: 500 }
    );
  }
}

/* ============================================
   DELETE — Remove job completely
=============================================*/
export async function DELETE(req, ctx) {
  try {
    await connectDB();
    const p = await unwrapParams(ctx);
    const { companyId, jobId } = p;

    const deleted = await Job.findOneAndDelete({
      _id: jobId,
      companyId,
    });

    if (!deleted) {
      return NextResponse.json(
        { ok: false, message: "Job not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ok: true,
      message: "Job deleted successfully",
    });
  } catch (err) {
    console.error("Delete Job Error:", err);
    return NextResponse.json(
      { ok: false, message: "Server error" },
      { status: 500 }
    );
  }
}
