import { openRouter } from "@/lib/openrouter";
import { buildSummaryPrompt } from "../prompts/summaryPrompt";

export async function generateSummarySuggestions({
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
  const prompt = buildSummaryPrompt({ cvType, cvData, targetRole, jobDescription });

  console.log("🚀 Sending SUMMARY request to OpenRouter (Gemini)...");

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
      console.log("🤖 Raw Summary Response:", text.slice(0, 400));

      const json = JSON.parse(text);

      return {
        summaryTemplates: json.summaryTemplates || [],
        phrases: json.phrases || [],
      };
    } catch (err: any) {
      lastError = err;
      const msg = err?.message || "Unknown error";

      if (
        (msg.includes("overloaded") || msg.includes("timeout") || err?.status === 503) &&
        attempt < 3
      ) {
        console.warn(`⚠️ OpenRouter overloaded (summary attempt ${attempt}) → retrying in 5s…`);
        await new Promise((r) => setTimeout(r, 5000));
        continue;
      }

      console.error("❌ Summary Gemini error:", msg);
      break;
    }
  }

  console.error("💥 Gemini failed after retries (summary):", lastError);

  return {
    summaryTemplates: [],
    phrases: [],
  };
}
