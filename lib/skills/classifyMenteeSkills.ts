import { openRouter } from "@/lib/openrouter";

export type ClassifiedSkillsCategory = {
  category: string;
  skills: string[];
};

function normalizeCategories(input: any): ClassifiedSkillsCategory[] {
  const categories = Array.isArray(input?.categories) ? input.categories : [];

  const cleaned: ClassifiedSkillsCategory[] = [];
  for (const c of categories) {
    const category = String(c?.category || "").trim();
    if (!category) continue;

    const skillsIn = Array.isArray(c?.skills) ? c.skills : [];
    const seen = new Set<string>();
    const skills: string[] = [];

    for (const s of skillsIn) {
      const name = String(s || "").trim();
      if (!name) continue;
      const key = name.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      skills.push(name);
    }

    if (skills.length === 0) continue;
    cleaned.push({ category, skills });
  }

  return cleaned;
}

export async function classifyMenteeSkills(params: {
  skills: string[];
}): Promise<{ categories: ClassifiedSkillsCategory[] }> {
  const rawSkills = Array.isArray(params.skills) ? params.skills : [];

  const skillList = rawSkills
    .map((s) => String(s || "").trim())
    .filter(Boolean);

  if (skillList.length === 0) {
    return { categories: [] };
  }

  const prompt = `You are a helpful assistant that outputs JSON only.\n\nTask:\nGiven a list of raw interview-derived skills (often messy, duplicated, misspelled, or inconsistent), clean them and classify them into categories for a mentee profile.\n\nRules:\n- Normalize names (e.g. reactjs -> React, nextjs -> Next.js, node -> Node.js, ts -> TypeScript).\n- Remove duplicates and trivial variants (case, punctuation, spacing).\n- Prefer widely used canonical names.\n- Keep the output concise: do not include more than 12 skills per category.\n- If a skill is too generic or not a skill, exclude it.\n- Use these categories when applicable: Frontend, Backend, Mobile, Database, DevOps, Cloud, Testing, Data, AI/ML, Languages, Tools, Soft Skills, Other.\n\nInput skills:\n${JSON.stringify(skillList)}\n\nReturn JSON with this exact schema:\n{\n  \"categories\": [\n    { \"category\": \"Frontend\", \"skills\": [\"React\", \"Next.js\", \"CSS\"] }\n  ]\n}`;

  let lastError: any = null;

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const completion = await openRouter.chat.completions.create({
        model: "google/gemini-2.0-flash-001",
        messages: [
          { role: "system", content: "You are a helpful assistant that outputs JSON." },
          { role: "user", content: prompt },
        ],
        response_format: { type: "json_object" },
      });

      const text = completion.choices[0]?.message?.content?.trim() || "{}";
      const parsed = JSON.parse(text);

      return {
        categories: normalizeCategories(parsed),
      };
    } catch (err: any) {
      lastError = err;
      const msg = err?.message || "Unknown error";

      if (
        (err?.status === 503 || msg.includes("overloaded") || msg.includes("timeout")) &&
        attempt < 3
      ) {
        await new Promise((r) => setTimeout(r, 5000));
        continue;
      }

      break;
    }
  }

  console.error("Gemini failed after retries (classify skills):", lastError);
  return { categories: [] };
}
