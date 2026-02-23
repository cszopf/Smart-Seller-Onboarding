import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

/**
 * GEMINI_API_KEY must be set in your environment variables.
 * Do not use NEXT_PUBLIC_ prefix for this key as it is used server-side only.
 */

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.error("GEMINI_API_KEY is not set in environment variables.");
      return NextResponse.json(
        { error: "Internal Server Error: API key missing" },
        { status: 500 }
      );
    }

    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ result: text });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return NextResponse.json(
      { error: "Failed to generate content" },
      { status: 500 }
    );
  }
}
