import { openRouter } from "@/lib/openrouter"; // Fixed import path
import { buildSkillsPrompt } from "../prompts/skillsPrompt";

export async function generateSkillsSuggestions({
  menteeId,
  cvType,
  cvData,
  targetRole,
  jobDescription,
}: {
  menteeId: string;
  cvType: string;
  cvData: any;
  targetRole?: string;
  jobDescription?: string;
}) {
  const prompt = buildSkillsPrompt({ cvType, cvData, targetRole, jobDescription });

  console.log("🚀 Sending SKILLS request to OpenRouter (Gemini)...");

  let lastError: any = null;

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const completion = await openRouter.chat.completions.create({
        model: "google/gemini-2.0-flash-001",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that outputs JSON."
          },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" },
      });

      const text = completion.choices[0]?.message?.content?.trim() || "{}";
      console.log("🤖 Raw Skills Response:", text.slice(0, 400));

      const json = JSON.parse(text);

      return {
        technicalSkills: json.technicalSkills || [],
        softSkills: json.softSkills || [],
        languages: json.languages || [],
      };
    } catch (err: any) {
      lastError = err;
      const msg = err?.message || "Unknown error";

      if (
        (msg.includes("overloaded") || msg.includes("timeout") || err?.status === 503) &&
        attempt < 3
      ) {
        console.warn(`⚠️ OpenRouter overloaded (skills attempt ${attempt}) → retrying in 5s…`);
        await new Promise((r) => setTimeout(r, 5000));
        continue;
      }

      console.error("❌ Skills Gemini error:", msg);
      break;
    }
  }

  console.error("💥 Gemini failed after retries (skills):", lastError);

  return {
    technicalSkills: [],
    softSkills: [],
    languages: [],
  };
}
