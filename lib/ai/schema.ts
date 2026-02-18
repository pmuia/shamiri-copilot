import { z } from "zod";

export const AnalysisSchema = z.object({
  summary: z.string(),

  contentCoverage: z.object({
    score: z.number().min(0).max(100),
    strengths: z.array(z.string()),
    gaps: z.array(z.string()),
  }),

  facilitationQuality: z.object({
    score: z.number().min(0).max(100),
    strengths: z.array(z.string()),
    improvements: z.array(z.string()),
  }),

  protocolSafety: z.object({
    score: z.number().min(0).max(100),
    issues: z.array(z.string()),
    recommendations: z.array(z.string()),
  }),
});

export type AnalysisResult = z.infer<typeof AnalysisSchema>;
