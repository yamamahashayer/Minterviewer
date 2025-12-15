import { openRouter } from "@/lib/openrouter";
import { buildCvPrompt } from "./prompt";
import type { CvAnalysis, RoleSpec } from "./schema";

export async function analyzeWithGemini(
  affindaJson: any,
  options?: {
    role?: RoleSpec;
    userNotes?: string;
  }
): Promise<CvAnalysis> {
  const prompt = buildCvPrompt(
    affindaJson,
    options?.role,
    options?.userNotes
  );

  console.log("🚀 Sending CV analysis request to OpenRouter (Gemini)...");

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
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
      });

      const text = completion.choices[0]?.message?.content?.trim() || "{}";
      console.log("🤖 Gemini raw text:", text.slice(0, 400));

      const parsed = JSON.parse(text);
      console.log("✅ Gemini structured result:", parsed);

      return parsed as CvAnalysis;
    } catch (err: any) {
      lastError = err;

      const errMsg = err?.message || "Unknown OpenRouter API error";

      if (
        (err?.status === 503 ||
          errMsg.includes("overloaded") ||
          errMsg.includes("timeout")) &&
        attempt < 3
      ) {
        console.warn(
          `⚠️ OpenRouter/Gemini overloaded (attempt ${attempt}) — retrying in 5s...`
        );
        await new Promise((r) => setTimeout(r, 5000));
        continue;
      }

      console.error(`❌ OpenRouter API error (attempt ${attempt}):`, errMsg);
      break;
    }
  }

  console.error("💥 Gemini failed after multiple attempts:", lastError);
  throw new Error(
    "AI service is currently overloaded or unavailable. Please try again later."
  );
}
