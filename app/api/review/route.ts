import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { SessionStatus } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { sessionId, finalStatus, notes } = body;

    if (!sessionId || !finalStatus) {
      return NextResponse.json(
        { error: "Missing sessionId or finalStatus" },
        { status: 400 }
      );
    }

    if (!Object.values(SessionStatus).includes(finalStatus)) {
      return NextResponse.json(
        { error: "Invalid session status value" },
        { status: 400 }
      );
    }

    const sessionExists = await prisma.session.findUnique({
      where: { id: sessionId },
      select: { id: true },
    });

    if (!sessionExists) {
      return NextResponse.json(
        { error: "Session not found" },
        { status: 404 }
      );
    }

    await prisma.supervisorReview.upsert({
      where: { sessionId },
      update: {
        finalStatus,
        notes,
        reviewedAt: new Date(),
      },
      create: {
        sessionId,
        finalStatus,
        notes,
      },
    });

    await prisma.session.update({
      where: { id: sessionId },
      data: { status: finalStatus },
    });

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error("Review submission failed:", error);

    return NextResponse.json(
      { error: error?.message || "Failed to submit review" },
      { status: 500 }
    );
  }
}
