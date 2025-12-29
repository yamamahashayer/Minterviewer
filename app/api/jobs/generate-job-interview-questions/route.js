import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Job from "@/models/Job";

export async function POST(req) {
    try {
        await connectDB();

        const { jobId, questionCount = 6 } = await req.json();

        if (!jobId) {
            return NextResponse.json(
                { ok: false, message: "jobId is required" },
                { status: 400 }
            );
        }

        // Fetch job details
        const job = await Job.findById(jobId);
        if (!job) {
            return NextResponse.json(
                { ok: false, message: "Job not found" },
                { status: 404 }
            );
        }

        // Build prompt for AI question generation
        const prompt = `Generate ${questionCount} interview questions for a ${job.level || "Mid-level"} ${job.title} position.

Job Description:
${job.description}

Required Skills:
${job.skills?.join(", ") || "General skills"}

${job.aiFocus?.length > 0 ? `Focus Areas: ${job.aiFocus.join(", ")}` : ""}

${job.aiQuestions ? `Additional Instructions: ${job.aiQuestions}` : ""}

Generate a mix of technical and behavioral questions appropriate for this role. Each question should be clear, specific, and relevant to the job requirements. Return the questions as a JSON array of strings.`;

        // Call OpenRouter API to generate questions
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "google/gemini-2.0-flash-exp:free",
                messages: [
                    {
                        role: "system",
                        content: "You are an expert technical interviewer. Generate relevant, professional interview questions based on job requirements. Return only a JSON array of question strings, nothing else."
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                temperature: 0.7,
            }),
        });

        if (!response.ok) {
            throw new Error(`OpenRouter API error: ${response.statusText}`);
        }

        const data = await response.json();
        const content = data.choices[0]?.message?.content;

        if (!content) {
            throw new Error("No content received from AI");
        }

        // Parse the JSON response
        let questions;
        try {
            // Try to extract JSON from the response
            const jsonMatch = content.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
                questions = JSON.parse(jsonMatch[0]);
            } else {
                questions = JSON.parse(content);
            }
        } catch (parseError) {
            console.error("Failed to parse AI response:", content);
            // Fallback: split by newlines and filter
            questions = content
                .split("\n")
                .filter(line => line.trim() && !line.startsWith("{") && !line.startsWith("["))
                .map(line => line.replace(/^\d+\.\s*/, "").replace(/^[-*]\s*/, "").trim())
                .filter(q => q.length > 10)
                .slice(0, questionCount);
        }

        // Ensure we have the right number of questions
        if (!Array.isArray(questions) || questions.length === 0) {
            throw new Error("Failed to generate valid questions");
        }

        return NextResponse.json({
            ok: true,
            questions: questions.slice(0, questionCount),
            jobContext: {
                title: job.title,
                level: job.level,
                skills: job.skills,
            },
        });
    } catch (error) {
        console.error("Error generating job interview questions:", error);
        return NextResponse.json(
            { ok: false, message: "Failed to generate questions", error: error.message },
            { status: 500 }
        );
    }
}
