import OpenAI from "openai";

const getOpenRouter = () => {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
        console.warn("⚠️ OPENROUTER_API_KEY is not set");
    }

    return new OpenAI({
        baseURL: "https://openrouter.ai/api/v1",
        apiKey: apiKey,

    });
};

export const openRouter = getOpenRouter();
