import { GoogleGenAI } from "@google/genai";
import { buildSkillsPrompt } from "../prompts/skillsPrompt";

const getAi = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("❌ Missing GEMINI_API_KEY");
  return new GoogleGenAI({ apiKey });
};

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
  const ai = getAi();
  const prompt = buildSkillsPrompt({ cvType, cvData, targetRole, jobDescription });

  console.log("🚀 Sending SKILLS request to Gemini…");

  let lastError: any = null;

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const resp = await ai.models.generateContent({
        model: "gemini-2.5-pro",
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        config: {
          responseMimeType: "application/json",
        },
      });

      const text = resp.text?.trim() || "{}";
      console.log("🤖 Raw Skills Response:", text.slice(0, 400));

      const json = JSON.parse(text);

      return {
        technicalSkills: json.technicalSkills || [],
        softSkills: json.softSkills || [],
        languages: json.languages || [],
      };
    } catch (err: any) {
      lastError = err;
      const msg = err?.error?.message || err?.message || "Unknown error";

      if (
        (msg.includes("overloaded") || msg.includes("UNAVAILABLE") || err?.error?.code === 503) &&
        attempt < 3
      ) {
        console.warn(`⚠️ Gemini overloaded (skills attempt ${attempt}) → retrying in 5s…`);
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
