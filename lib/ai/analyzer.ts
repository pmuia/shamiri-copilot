import OpenAI from "openai";
import { AnalysisSchema, AnalysisResult } from "./schema";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function analyzeTranscript(
  transcript: string
): Promise<AnalysisResult> {
  if (!transcript || transcript.length < 50) {
    throw new Error("Transcript too short for analysis");
  }

  const prompt = `
You are an expert session evaluator.

Analyze the transcript and return STRICT JSON with this structure:

{
  "summary": string,
  "contentCoverage": {
    "score": number (0-100),
    "strengths": string[],
    "gaps": string[]
  },
  "facilitationQuality": {
    "score": number (0-100),
    "strengths": string[],
    "improvements": string[]
  },
  "protocolSafety": {
    "score": number (0-100),
    "issues": string[],
    "recommendations": string[]
  }
}

Return ONLY valid JSON.
No markdown.
No explanation.
No extra text.
`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.2,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: prompt },
      { role: "user", content: transcript },
    ],
  });

  const content = completion.choices[0]?.message?.content;

  if (!content) {
    throw new Error("AI returned empty response");
  }

  console.log("RAW AI RESPONSE:", content);

  let parsed: unknown;

  try {  
    const cleaned = content.replace(/```json|```/g, "").trim();
    parsed = JSON.parse(cleaned);
  } catch (err) {
    console.error("JSON Parse Error:", err);
    throw new Error("AI returned invalid JSON");
  }

  const validated = AnalysisSchema.safeParse(parsed);

  if (!validated.success) {
    console.error(
      "Schema Validation Failed:",
      validated.error.flatten()
    );
    throw new Error("AI response structure mismatch");
  }

  return validated.data;
}
