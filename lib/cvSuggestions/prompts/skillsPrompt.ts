export function buildSkillsPrompt({
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
You are an AI assistant helping a user improve the **Skills** section in their CV.

The user is creating a CV using this mode:
- CV Type: ${cvType || "general"}

If role-based:
- Target Role: ${targetRole || "N/A"}

If job-based:
- Job Description: ${jobDescription || "N/A"}

--- USER CV DATA ---
Personal:
${JSON.stringify(cvData.personal, null, 2)}

Experience:
${JSON.stringify(cvData.experience, null, 2)}

Education:
${JSON.stringify(cvData.education, null, 2)}

Projects:
${JSON.stringify(cvData.projects, null, 2)}
---------------------

🎯 **Your task:** Generate **high-quality, realistic skill suggestions** based on:
- Their background
- Their projects
- Their experience level
- The CV type (general / role-based / job-based)
- The target role or job description (if provided)

📌 **Return JSON ONLY** in this structure:

{
  "technicalSkills": [ "skill1", "skill2", ... ],
  "softSkills": [ "skill1", "skill2", ... ],
  "languages": [ "Arabic", "English", ... ]
}

⭕ Rules:
- DO NOT write explanations.
- DO NOT add extra fields.
- Skills must be relevant and realistic.
- Remove duplicates.
- Keep the lists concise (5–12 items each).
- If job-based → match keywords from job description.
- If role-based → prioritize industry-specific skills.

Now generate the JSON response:
`;
}
