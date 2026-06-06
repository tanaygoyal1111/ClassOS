import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { assignmentTitle, gradeLevel, subject, maxMarks, customCriteria } = await req.json();

    if (!assignmentTitle || !gradeLevel || !subject || !maxMarks) {
      return NextResponse.json({ success: false, error: "Missing required fields." }, { status: 400 });
    }

    const apiKey = process.env.GROQ_API_KEY;

    const prompt = `You are an expert educator. Create a comprehensive grading rubric for an assignment titled '${assignmentTitle}' for Grade ${gradeLevel} ${subject}. Total Marks: ${maxMarks}. 
${customCriteria ? `Focus specifically on these criteria: ${customCriteria}.` : ''}

You MUST output the rubric STRICTLY as a single Markdown table. The columns should represent the Performance Levels (e.g., Excellent, Good, Needs Improvement, Poor) with the corresponding marks ranges. The rows should represent the Grading Criteria (e.g., Accuracy, Grammar, Critical Thinking). Keep the descriptions inside the table concise, actionable, and student-friendly. Do NOT output any conversational text outside of the Markdown table.`;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.4,
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
    console.error("Rubric Generation Error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
