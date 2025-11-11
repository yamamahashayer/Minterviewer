// src/lib/cvAnalysis/schema.ts
import { z } from "zod";

// ✅ تعريف Zod Schema للتحقق من شكل تحليل الـ CV
export const CvSchema = z.object({
  score: z.number().min(0).max(100),
  atsScore: z.number().min(0).max(100),
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  improvements: z.array(z.string()),
  redFlags: z.array(z.string()),
  recommendedJobTitles: z.array(z.string()),
  keywordCoverage: z.object({
    matched: z.array(z.string()),
    missing: z.array(z.string()),
  }),
});

// ✅ النوع المستنتج من Zod
export type CvAnalysis = z.infer<typeof CvSchema>;

// ✅ (اختياري) مواصفات الدور الوظيفي
export type RoleSpec = {
  title: string;
  mustHaveKeywords: string[];
  niceToHaveKeywords?: string[];
};
