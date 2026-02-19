import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { analyzeTranscript } from "@/lib/ai/analyzer";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const session = await prisma.session.findUnique({
      where: { id },
    });

    if (!session || !session.transcript) {
      return NextResponse.json(
        { error: "Session or transcript not found" },
        { status: 404 }
      );
    }

    const analysis = await analyzeTranscript(session.transcript);

    const mapped = {
      summary: analysis.summary,

      contentScore: analysis.contentCoverage.score,
      contentJustification: JSON.stringify({
        strengths: analysis.contentCoverage.strengths,
        gaps: analysis.contentCoverage.gaps,
      }),

      facilitationScore: analysis.facilitationQuality.score,
      facilitationJustification: JSON.stringify({
        strengths: analysis.facilitationQuality.strengths,
        improvements: analysis.facilitationQuality.improvements,
      }),
      
      safetyScore: analysis.protocolSafety.score,
      safetyJustification: JSON.stringify({
        issues: analysis.protocolSafety.issues,
        recommendations: analysis.protocolSafety.recommendations,
      }),
      riskFlag: analysis.protocolSafety.score < 60,
      riskQuote: analysis.protocolSafety.issues?.[0] ?? null,
    };

    await prisma.sessionAnalysis.upsert({
      where: { sessionId: id },
      update: mapped,
      create: {
        sessionId: id,
        ...mapped,
      },
    });

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error("AI analysis failed:", error);

    return NextResponse.json(
      { error: error?.message || "Analysis failed" },
      { status: 500 }
    );
  }
}
