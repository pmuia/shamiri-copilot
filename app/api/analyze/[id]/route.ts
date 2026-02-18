import { NextResponse } from "next/server";
import { analyzeTranscript } from "@/lib/ai/analyzer";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    console.log("Analyze called for:", id);

    const body = await request.json();
    const transcript = body?.transcript;

    if (!transcript) {
      return NextResponse.json(
        { error: "Transcript missing" },
        { status: 400 }
      );
    }

    console.log("Transcript length:", transcript.length);

    const analysis = await analyzeTranscript(transcript);

    return NextResponse.json(analysis);

  } catch (error: any) {
    console.error("AI analysis failed:", error.message);

    return NextResponse.json(
      { error: error.message || "Analysis failed" },
      { status: 500 }
    );
  }
}
