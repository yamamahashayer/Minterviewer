// src/lib/cvAnalysis/prompt.ts
import type { RoleSpec } from "./schema";

export function buildCvPrompt(affindaJson: any, role?: RoleSpec) {
  const roleBlock = role
    ? `Target Role:
- Title: ${role.title}
- Must-have keywords: ${role.mustHaveKeywords.join(", ") || "None"}
- Nice-to-have keywords: ${role.niceToHaveKeywords?.join(", ") || "None"}`
    : `Target Role: Not specified`;

  return `
You are a senior career advisor and ATS evaluator.
You will analyze a resume represented in structured JSON (from Affinda).
Return your response as **JSON only**, without explanations.

Evaluation Rubric (100 total):
- Structure & Clarity (20)
- Relevance to Target Role (20)
- Skills Depth & Specificity (20)
- Achievements & Impact (20)
- ATS Readiness & Keyword Fit (20)

Return JSON in exactly this shape:
{
  "score": number,
  "atsScore": number,
  "strengths": string[],
  "weaknesses": string[],
  "improvements": string[],
  "redFlags": string[],
  "recommendedJobTitles": string[],
  "keywordCoverage": {
    "matched": string[],
    "missing": string[]
  }
}

${roleBlock}

Resume Data:
${JSON.stringify(affindaJson)}
`;
}
