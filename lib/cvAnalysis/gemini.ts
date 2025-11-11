// lib/cvAnalysis/gemini.ts
import { GoogleGenAI, Type } from "@google/genai";
import { buildCvPrompt } from "./prompt";
import type { CvAnalysis, RoleSpec } from "./schema";

/**
 * 🔑 إنشاء عميل Gemini AI باستخدام المفتاح من ملف البيئة
 */
const getAi = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("❌ NEXT_PUBLIC_API_KEY environment variable is not set");
  }
  return new GoogleGenAI({ apiKey });
};

/**
 * 🤖 تحليل السيرة الذاتية باستخدام Gemini 2.5 Pro
 */
export async function analyzeWithGemini(
  affindaJson: any,
  role?: RoleSpec
): Promise<CvAnalysis> {
  const ai = getAi();

  const prompt = buildCvPrompt(affindaJson, role);

  console.log("🚀 Sending CV analysis request to Gemini 2.5 Pro...");

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
            recommendedJobTitles: { type: Type.ARRAY, items: { type: Type.STRING } },
            keywordCoverage: {
              type: Type.OBJECT,
              properties: {
                matched: { type: Type.ARRAY, items: { type: Type.STRING } },
                missing: { type: Type.ARRAY, items: { type: Type.STRING } },
              },
              required: ["matched", "missing"],
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
          ],
        },
      },
    });

    // ✅ استخراج النص الناتج
    const text = response.text?.trim() || "";
    console.log("🤖 Gemini raw text:", text.slice(0, 300));

    const parsed = JSON.parse(text);
    console.log("✅ Gemini structured result:", parsed);

    return parsed as CvAnalysis;
  } catch (err: any) {
    console.error("❌ Gemini 2.5 API error:", err.message);
    console.error("Full error:", err);

    // 🧩 fallback mock
    const mock: CvAnalysis = {
      score: 70,
      atsScore: 75,
      strengths: ["Fallback result used"],
      weaknesses: ["Gemini not available"],
      improvements: ["Try again later"],
      redFlags: [],
      recommendedJobTitles: ["Software Developer"],
      keywordCoverage: { matched: [], missing: [] },
    };
    console.warn("⚠️ Using fallback mock data");
    return mock;
  }
}
