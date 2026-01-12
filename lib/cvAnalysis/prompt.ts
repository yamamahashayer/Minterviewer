// lib/cvAnalysis/prompt.ts

type RoleLike = {
  title: string;
  mustHaveKeywords: string[];
  niceToHaveKeywords?: string[];
};

export function buildCvPrompt(
  affindaJson: any,
  role?: RoleLike,
  userNotes?: string
) {
  /* ================= ROLE CONTEXT ================= */
  const rolePart = role
    ? `
🎯 TARGET ROLE CONTEXT:
- Job Title: ${role.title}
- Required Keywords: ${role.mustHaveKeywords.join(", ")}
- Nice to Have Keywords: ${role.niceToHaveKeywords?.join(", ") || "None"}
`
    : `
🎯 TARGET ROLE CONTEXT:
No specific target role was provided.
If the user mentions a role in notes, you MUST prioritize it.
`;

  /* ================= USER NOTES ================= */
  const notesPart = userNotes
    ? `
📝 USER NOTES (IMPORTANT CONTEXT):
The user may include:
- A target job title or position
- Industry or career field
- Specific focus (ATS optimization, missing skills, junior role, etc.)
- Personal concerns or priorities

You MUST:
- Detect if a job title or position is mentioned.
- Treat it as the primary target role if no role object is provided.
- Adjust ATS analysis, keyword coverage, and recommendations accordingly.
- Use the notes ONLY as guidance.
- Do NOT invent experience or skills not present in the CV.
- Do NOT change the output JSON structure.

User Notes:
"${userNotes}"
`
    : `
📝 USER NOTES:
No additional user notes were provided.
`;

  /* ================= FINAL PROMPT ================= */
  return `
You are a professional resume analyzer and ATS optimization system.
Your task is to analyze the resume JSON below and return a COMPLETE structured JSON analysis.

🚨 STRICT RULES:
- Always return ALL fields listed below.
- If a field has no data, return an empty value (0, "", [], or {}).
- Do NOT skip any field.
- Do NOT add extra fields.
- Respond ONLY with valid JSON (no markdown, no explanations).

Return JSON in this EXACT schema:

{
  "score": number,
  "atsScore": number,
  "strengths": [string],
  "weaknesses": [string],
  "improvements": [string],
  "redFlags": [string],
  "recommendedJobTitles": [string],
  "keywordCoverage": {
    "matched": [string],
    "missing": [string]
  },
  "categories": {
    "formatting": {
      "title": "Formatting & Structure",
      "score": number,
      "insights": [string]
    },
    "content": {
      "title": "Content Quality",
      "score": number,
      "insights": [string]
    },
    "keywords": {
      "title": "Keywords & ATS",
      "score": number,
      "insights": [string]
    },
    "experience": {
      "title": "Experience & Impact",
      "score": number,
      "insights": [string]
    }
  }
}

💡 EVALUATION GUIDELINES (IMPORTANT – READ CAREFULLY):
- "score": overall CV quality (0–100).

SCORING CALIBRATION:
- A CV that meets basic professional standards SHOULD score between 68–75.
- A well-structured CV with relevant skills and clear content SHOULD score between 75–85.
- Strong CVs may score above 85.
- Only very weak or problematic CVs should score below 60.
- Do NOT be overly strict or conservative with scoring.
- Lightly penalize missing experience for junior or early-career candidates.
- Reward clarity, structure, and relevance even if experience is limited.

CONSISTENCY RULE:
- The overall "score" MUST be CONSISTENT with the category scores.
- As a guideline, the overall score should approximately reflect the average
  of the four category scores multiplied by 10, with small adjustments allowed.
- Keyword relevance should influence the score but MUST NOT dominate it.

- "atsScore": ATS compatibility (0–100).
- "recommendedJobTitles": MUST align with detected role or user notes.
- "keywordCoverage": reflect ATS relevance but should NOT dominate the overall score.
- Category scores range from 0–10.
- Insights must be specific, practical, and actionable.

${rolePart}

${notesPart}

📄 RESUME JSON:
${JSON.stringify(affindaJson, null, 2)}
`;
}
