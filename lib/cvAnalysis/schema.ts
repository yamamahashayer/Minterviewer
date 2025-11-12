// lib/cvAnalysis/schema.ts
import { z } from "zod";

export const CvCategorySchema = z.object({
  title: z.string(),
  score: z.number(),
  insights: z.array(z.string()),
});

export const CvSchema = z.object({
  score: z.number(),
  atsScore: z.number(),
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  improvements: z.array(z.string()),
  redFlags: z.array(z.string()).optional(),
  recommendedJobTitles: z.array(z.string()),
  keywordCoverage: z.object({
    matched: z.array(z.string()),
    missing: z.array(z.string()),
  }),
  categories: z.object({
    formatting: CvCategorySchema.optional(),
    content: CvCategorySchema.optional(),
    keywords: CvCategorySchema.optional(),
    experience: CvCategorySchema.optional(),
  }).optional(),
});

export type CvAnalysis = z.infer<typeof CvSchema>;
export type CvCategory = z.infer<typeof CvCategorySchema>;

export interface RoleSpec {
  title: string;
  mustHaveKeywords: string[];
  niceToHaveKeywords?: string[];
}
