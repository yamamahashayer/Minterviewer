import { GoogleGenerativeAI } from "@google/generative-ai";
import { buildCvPrompt } from "./prompt";
import type { CvAnalysis, RoleSpec } from "./schema";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// نستخدم النموذج المجاني الأقوى
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

function safeParse<T = any>(raw: string): T {
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  const json = raw.slice(start, end + 1);
  return JSON.parse(json);
}

export async function analyzeWithGemini(affindaJson: any, role?: RoleSpec): Promise<CvAnalysis> {
  const prompt = buildCvPrompt(affindaJson, role);

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  return safeParse<CvAnalysis>(text);
}
