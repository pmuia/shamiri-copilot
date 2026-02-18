import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { sessionId, finalStatus, notes } = body;

    await prisma.supervisorReview.upsert({
      where: { sessionId },
      update: { finalStatus, notes },
      create: { sessionId, finalStatus, notes },
    });

    await prisma.session.update({
      where: { id: sessionId },
      data: { status: finalStatus },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
