import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { concept, gradeLevel, subject } = await req.json();

    if (!concept || !gradeLevel || !subject) {
      return NextResponse.json({ success: false, error: "Missing required fields." }, { status: 400 });
    }

    const apiKey = process.env.GROQ_API_KEY;

    const prompt = `You are a master educator known for making complex topics incredibly easy to understand. Break down the concept of '${concept}' for a Grade ${gradeLevel} student studying ${subject}.
You MUST output the response in heavily styled Markdown using the following structure exactly:

## 🧠 The ELI5 (Explain Like I'm 5)
(A 2-3 sentence extremely simple definition.)

## 🌍 Real-World Analogy
(Compare the concept to something the student interacts with daily e.g., video games, pizza, sports.)

## 🔍 Vocabulary Breakdown
(Pick 2-3 hard words related to the concept and define them simply.)

## 💡 Fun Fact
(A mind-blowing fact to keep them engaged.)

Output strictly the Markdown content without any conversational filler before or after the headings.`;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Groq API Error:", errorText);
      return NextResponse.json({ success: false, error: "Failed to communicate with AI provider." }, { status: 500 });
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    return NextResponse.json({ success: true, data: content });
  } catch (error: any) {
    console.error("Concept Simplifier Error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
