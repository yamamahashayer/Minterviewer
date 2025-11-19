export function buildSummaryPrompt({
  cvType,
  cvData,
  targetRole,
  jobDescription,
}: {
  cvType: string;
  cvData: any;
  targetRole?: string;
  jobDescription?: string;
}) {
  return `
You are an expert CV writing assistant.
Your task is to generate **professional summaries** for the user's CV based on their information.

=============================
 USER CV INFORMATION  
=============================

CV Type: ${cvType}

Target Role (if role-based): ${targetRole || "N/A"}

Job Description (if job-based): ${jobDescription || "N/A"}

Personal Info:
${JSON.stringify(cvData.personal, null, 2)}

Experience:
${JSON.stringify(cvData.experience, null, 2)}

Education:
${JSON.stringify(cvData.education, null, 2)}

Skills:
${JSON.stringify(cvData.skills, null, 2)}

Projects:
${JSON.stringify(cvData.projects, null, 2)}

=============================

🎯 **Your Goal**
Generate:
1. **3 strong professional summary templates** (2–3 sentences each)
2. **Up to 10 summary phrases** that the user can insert individually

📌 **Output Format (JSON ONLY):**

{
  "summaryTemplates": [
    "template 1...",
    "template 2...",
    "template 3..."
  ],
  "summaryPhrases": [
    "phrase 1",
    "phrase 2",
    ...
  ]
}

⚠️ Rules:
- ABSOLUTELY NO explanations outside JSON.
- Keep summaries concise (2–3 sentences max).
- Match style based on CV Type:
  - "general": balanced, friendly for job portals
  - "role": focused on achievements + required skills
  - "job": keyword-aligned to job description
- Use only realistic claims based on the user's experience.
- If experience is limited, keep suggestions beginner-friendly.
- Avoid buzzwords unless supported by skills/experience.
- No placeholders (no “Company X”, “Role Y”, etc.).

Generate the JSON now:
`;
}
