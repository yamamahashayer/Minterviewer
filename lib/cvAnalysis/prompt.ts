// lib/cvAnalysis/prompt.ts

export function buildCvPrompt(affindaJson: any, role?: any) {
  const rolePart = role
    ? `Target Role: ${role.title}\nRequired Keywords: ${role.mustHaveKeywords.join(", ")}\nNice to Have: ${role.niceToHaveKeywords?.join(", ") || "None"}`
    : "No specific target role provided.";

  return `
You are a professional resume analyzer and ATS optimization system.
Your job is to analyze the resume JSON provided below and return a complete structured JSON analysis.

🎯 STRICT RULES:
- Always return ALL fields listed below.
- If you have no data for a field, return an empty value (0, "", [], or {}).
- Do not skip any field.
- Respond ONLY with valid JSON (no text outside JSON).

Return JSON in this exact schema:

{
  "score": number,                    // Overall CV quality (0–100)
  "atsScore": number,                 // ATS compatibility score (0–100)
  "strengths": [string],              // Key strong points
  "weaknesses": [string],             // Weak points or missing items
  "improvements": [string],           // Actionable recommendations
  "redFlags": [string],               // Potential issues or inconsistencies
  "recommendedJobTitles": [string],   // Job titles that fit this resume
  "keywordCoverage": {                // ATS keyword match details
    "matched": [string],
    "missing": [string]
  },
  "categories": {                     // Category-wise detailed feedback
    "formatting": {
      "title": "Formatting & Structure",
      "score": number (0–10),
      "insights": [string]
    },
    "content": {
      "title": "Content Quality",
      "score": number (0–10),
      "insights": [string]
    },
    "keywords": {
      "title": "Keywords & ATS",
      "score": number (0–10),
      "insights": [string]
    },
    "experience": {
      "title": "Experience & Impact",
      "score": number (0–10),
      "insights": [string]
    }
  }
}

💡 Evaluation guidelines:
- "score" represents the overall strength of the resume.
- "atsScore" should reflect formatting, keyword coverage, and readability by ATS systems.
- "keywordCoverage" should list found/missing important role keywords.
- Category "scores" should reflect how strong each area is (0–10).
- Use clear and specific language in all insight items.

${rolePart}

Resume JSON:
${JSON.stringify(affindaJson, null, 2)}
`;
}
