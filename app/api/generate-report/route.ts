import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI, Type } from "@google/genai";

export async function POST(req: NextRequest) {
    try {
        const { answers, emotionData, toneData, setupData, hasVideoData } = await req.json();

        // Debug: Log incoming data
        console.log("Incoming interview data:", {
            answersCount: Array.isArray(answers) ? answers.length : 0,
            answers: answers,
            emotionDataCount: Array.isArray(emotionData) ? emotionData.length : 0,
            setupData
        });

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json(
                { error: "Missing GEMINI_API_KEY" },
                { status: 500 }
            );
        }

        const ai = new GoogleGenAI({ apiKey });

        const systemPrompt = `You are an expert interview evaluator. Analyze each answer and provide detailed feedback.

SCORING GUIDELINES (0-100 scale):
- 90-100: Excellent - Perfect or near-perfect answer, well-explained, demonstrates deep understanding
- 80-89: Very Good - Strong answer with clear explanations, minor areas for improvement
- 70-79: Good - Solid answer that addresses the question, generally correct understanding
- 60-69: Acceptable - Mostly correct with some explanations or clarity issues
- 50-59: Below Average - Shows understanding but has significant gaps or unclear explanations
- 40-49: Poor - Incomplete answer with notable errors or misunderstandings
- Below 40: Very Poor - Incorrect or incomplete answer with major gaps

For CODING questions:
- If code is correct and efficient: 75-100 (depending on clarity and completeness)
- If code works but not optimal: 60-75
- If code has minor bugs: 40-60
- If code is fundamentally wrong: Below 40

For CONCEPTUAL questions:
- If answer is comprehensive and well-explained: 75-100
- If answer covers main points with good clarity: 60-75
- If answer is partially correct or unclear: 45-60
- If answer is mostly incorrect: Below 45

IMPORTANT SCORING RULES:
1. Score each question based on correctness, clarity, and completeness
2. Do NOT score on a 0-4 scale - USE 0-100 SCALE ONLY
3. Average scores should fall in 50-85 range for typical interviews
4. Excellent code solutions should score 80+
5. Calculate overall score as average of all question scores (normalized to 0-100)

MANDATORY REQUIREMENTS:
1. EVERY QUESTION must have a non-empty feedback field with exactly 2-3 sentences
2. The feedback must include: what was good, what needs improvement, specific action items
3. For toneAnalysis: KEEP IT BRIEF - maximum 3-4 sentences total, not more
${hasVideoData ? '4. For visualAnalysis in each question: Include 1-2 sentences about body language, confidence level, engagement' : '4. DO NOT include visualAnalysis fields - camera was not used during this interview'}
5. Return ONLY valid JSON - no markdown, no extra text, ONLY JSON

Example feedback format:
"The candidate demonstrated good understanding of the concept and provided a clear explanation. However, they could improve by including more practical examples. Recommendation: Study real-world case studies to strengthen practical application."

Example visualAnalysis:
"Maintained good eye contact and confident posture throughout. Clear hand gestures enhanced explanation."

Full structure required:
{
  "overallScore": <number 0-100>,
  "technicalScore": <number 0-100>,
  "communicationScore": <number 0-100>,
  "confidenceScore": <number 0-100>,
  "feedback": "<overall summary>",
  "strengths": [<list of strengths>],
  "improvements": [<list of improvements>],
  "perQuestionFeedback": [
    {
      "question": "<question text>",
      "candidateAnswer": "<their answer>",
      "score": <number 0-100>,
      "feedback": "<MANDATORY 2-3 sentence evaluation>",
${hasVideoData ? '      "visualAnalysis": "<1-2 sentence observation about body language, confidence, engagement>",' : ''}
      "emotion": "<emotion>",
      "tone": "<tone>"
    }
  ],
  "recommendations": [<actionable recommendations>],
  "emotionalAnalysis": {"dominantEmotion": "<emotion>", "emotionBreakdown": [...]},
  "toneAnalysis": "<BRIEF: 3-4 sentences max about overall tone, pace, clarity across all responses>"
}

CRITICAL:
- Do not skip any feedback field
- Keep toneAnalysis SHORT (3-4 sentences, not 200+ words)
${hasVideoData ? '- Include visualAnalysis for each question based on observed body language and engagement' : '- DO NOT include visualAnalysis fields'}
- USE 0-100 SCALE FOR ALL SCORES
- Score fairly based on actual performance (coding skill, understanding, clarity)`;

        const contents = [
            { role: "user", parts: [{ text: systemPrompt }] },
            {
                role: "user",
                parts: [{ text: `Interview Context: ${JSON.stringify(setupData)}` }]
            }
        ];

        // Add answers (skip images to reduce latency)
        if (Array.isArray(answers)) {
            const answersText = answers.map((ans, idx) => {
                let questionText = 'N/A';
                if (ans.question) {
                    if (typeof ans.question === 'string') {
                        questionText = ans.question;
                    } else if (typeof ans.question === 'object' && ans.question.text) {
                        questionText = ans.question.text;
                    }
                }

                let answerText = ans.answer || '';
                if (ans.isCoding && ans.code) {
                    answerText = `Code: ${ans.code} | Explanation: ${ans.explanation || ''}`;
                }

                return `Q${idx + 1}: ${questionText}\nAnswer: ${answerText}\nTone: ${ans.toneData?.tone || 'N/A'}`;
            }).join('\n\n');

            contents.push({
                role: "user",
                parts: [{ text: `INTERVIEW ANSWERS:\n\n${answersText}` }]
            });
        }

        // Add summary instruction
        contents.push({
            role: "user",
            parts: [{ text: `Emotion: ${emotionData?.length ? 'Detected' : 'N/A'} | Tone: ${toneData?.tone || 'N/A'}\n\nGenerate the report NOW.` }]
        });

        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: contents,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        overallScore: { type: Type.NUMBER },
                        technicalScore: { type: Type.NUMBER },
                        communicationScore: { type: Type.NUMBER },
                        confidenceScore: { type: Type.NUMBER },
                        feedback: { type: Type.STRING },
                        strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                        improvements: { type: Type.ARRAY, items: { type: Type.STRING } },
                        perQuestionFeedback: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    question: { type: Type.STRING },
                                    candidateAnswer: { type: Type.STRING },
                                    score: { type: Type.NUMBER },
                                    feedback: { type: Type.STRING },
                                    ...(hasVideoData ? { visualAnalysis: { type: Type.STRING } } : {}),
                                    emotion: { type: Type.STRING },
                                    tone: { type: Type.STRING }
                                },
                                required: ["question", "candidateAnswer", "score", "feedback", ...(hasVideoData ? ["visualAnalysis"] : []), "emotion", "tone"]
                            }
                        },
                        recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
                        emotionalAnalysis: {
                            type: Type.OBJECT,
                            properties: {
                                dominantEmotion: { type: Type.STRING },
                                emotionBreakdown: {
                                    type: Type.ARRAY,
                                    items: {
                                        type: Type.OBJECT,
                                        properties: {
                                            emotion: { type: Type.STRING },
                                            percentage: { type: Type.NUMBER }
                                        }
                                    }
                                }
                            }
                        },
                        toneAnalysis: { type: Type.STRING },
                    },
                    required: [
                        "overallScore",
                        "technicalScore",
                        "communicationScore",
                        "confidenceScore",
                        "feedback",
                        "strengths",
                        "improvements",
                        "perQuestionFeedback",
                        "recommendations",
                        "emotionalAnalysis",
                        "toneAnalysis"
                    ]
                }
            }
        });

        const text = response.text?.trim() || "{}";

        // Debug: Log raw Gemini response (full response for debugging)
        console.log("Gemini raw response (full):", text);
        console.log("Response length:", text.length, "characters");

        let parsed;
        try {
            // Try to extract JSON from response (in case there's extra text)
            let jsonText = text;
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                jsonText = jsonMatch[0];
            }

            parsed = JSON.parse(jsonText);
        } catch {
            console.error("JSON parse failed. Raw response:", text);
            return NextResponse.json(
                { error: "Invalid JSON returned from Gemini", details: text.substring(0, 200) },
                { status: 500 }
            );
        }

        // Validate required fields
        if (!parsed.overallScore || !Array.isArray(parsed.perQuestionFeedback)) {
            console.error("Missing required fields in response:", {
                hasOverallScore: !!parsed.overallScore,
                hasPerQuestionFeedback: Array.isArray(parsed.perQuestionFeedback)
            });
            return NextResponse.json(
                { error: "Invalid report structure from Gemini" },
                { status: 500 }
            );
        }

        // Debug: Log parsed response structure
        console.log("Parsed response perQuestionFeedback:", parsed?.perQuestionFeedback?.length, "questions");
        if (Array.isArray(parsed?.perQuestionFeedback)) {
            parsed.perQuestionFeedback.forEach((q: { feedback?: string; visualAnalysis?: string }, idx: number) => {
                console.log(`Q${idx + 1} feedback length:`, q.feedback?.length || 0, "chars");
                console.log(`Q${idx + 1} visualAnalysis length:`, q.visualAnalysis?.length || 0, "chars");
            });
        }
        console.log("Tone Analysis length:", parsed?.toneAnalysis?.length || 0, "chars (should be 3-4 sentences, not 200+)");

        return NextResponse.json(parsed);
    } catch (error) {
        console.error("Report Generation Error:", error);
        return NextResponse.json(
            { error: "Failed to generate report" },
            { status: 500 }
        );
    }
}