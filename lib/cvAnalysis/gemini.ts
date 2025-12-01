import { GoogleGenAI, Type } from "@google/genai";
import { buildCvPrompt } from "./prompt";
import type { CvAnalysis, RoleSpec } from "./schema";


const getAi = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("❌ Missing GEMINI_API_KEY environment variable");
  }
  return new GoogleGenAI({ apiKey });
};


export async function analyzeWithGemini(
  affindaJson: any,
  role?: RoleSpec
): Promise<CvAnalysis> {
  const ai = getAi();
  const prompt = buildCvPrompt(affindaJson, role);

  console.log("🚀 Sending CV analysis request to Gemini 2.5 Pro...");

  let lastError: any = null;

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-pro",
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              score: { type: Type.NUMBER },
              atsScore: { type: Type.NUMBER },
              strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
              weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
              improvements: { type: Type.ARRAY, items: { type: Type.STRING } },
              redFlags: { type: Type.ARRAY, items: { type: Type.STRING } },
              recommendedJobTitles: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              keywordCoverage: {
                type: Type.OBJECT,
                properties: {
                  matched: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  missing: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                },
                required: ["matched", "missing"],
              },
              categories: {
                type: Type.OBJECT,
                properties: {
                  formatting: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING },
                      score: { type: Type.NUMBER },
                      insights: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                      },
                    },
                    required: ["title", "score", "insights"],
                  },
                  content: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING },
                      score: { type: Type.NUMBER },
                      insights: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                      },
                    },
                    required: ["title", "score", "insights"],
                  },
                  keywords: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING },
                      score: { type: Type.NUMBER },
                      insights: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                      },
                    },
                    required: ["title", "score", "insights"],
                  },
                  experience: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING },
                      score: { type: Type.NUMBER },
                      insights: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                      },
                    },
                    required: ["title", "score", "insights"],
                  },
                },
                required: ["formatting", "content", "keywords", "experience"],
              },
            },
            required: [
              "score",
              "atsScore",
              "strengths",
              "weaknesses",
              "improvements",
              "redFlags",
              "recommendedJobTitles",
              "keywordCoverage",
              "categories",
            ],
          },
        },
      });

      const text = response.text?.trim() || "";
      console.log("🤖 Gemini raw text:", text.slice(0, 400));

      const parsed = JSON.parse(text);
      console.log("✅ Gemini structured result:", parsed);

      return parsed as CvAnalysis;
    } catch (err: any) {
      lastError = err;

      const errMsg =
        err?.error?.message || err?.message || "Unknown Gemini API error";

      if (
        (err?.error?.code === 503 ||
          errMsg.includes("overloaded") ||
          errMsg.includes("UNAVAILABLE")) &&
        attempt < 3
      ) {
        console.warn(
          `⚠️ Gemini overloaded (attempt ${attempt}) — retrying in 5s...`
        );
        await new Promise((r) => setTimeout(r, 5000));
        continue;
      }

      console.error(`❌ Gemini API error (attempt ${attempt}):`, errMsg);
      break;
    }
  }

  console.error("💥 Gemini failed after multiple attempts:", lastError);
  throw new Error(
    "Gemini AI is currently overloaded or unavailable. Please try again later."
  );
}

