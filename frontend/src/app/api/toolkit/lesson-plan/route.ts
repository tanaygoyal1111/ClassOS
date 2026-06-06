import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { topic, grade, subject, duration = "45 mins" } = await req.json();

    if (!topic || !grade || !subject) {
      return NextResponse.json({ success: false, error: "Missing required fields: topic, grade, or subject." }, { status: 400 });
    }

    // Attempt to use Groq API key from environment, with a safe fallback to ClassOS's internal groq key
    const apiKey = process.env.GROQ_API_KEY;

    const prompt = `You are an expert master teacher. Generate a highly practical, structured lesson plan for the Topic: ${topic}, Subject: ${subject}, Grade: ${grade}, Duration: ${duration}.

Use Markdown formatting heavily (Headers, bullet points, bold text). Include emojis for visual breaks. You MUST include the following specific sections exactly:

## 🎯 Objective & Real-World Hook
(How to introduce the concept using a relatable, real-world analogy to grab student attention)

## 🛠️ Materials Needed
(List of materials)

## 📢 Direct Instruction & Teacher Examples (${Math.floor(parseInt(duration) * 0.35)} mins)
(Include 2-3 specific examples or problems the teacher should solve on the board)

## 🗣️ Checking for Understanding (CFU) (${Math.floor(parseInt(duration) * 0.15)} mins)
(List 3 specific, probing questions the teacher should ask the class out loud to ensure they are following)

## 🤝 Guided Practice (${Math.floor(parseInt(duration) * 0.3)} mins)
(What the class will do together)

## ✍️ Independent Practice (Student Questions) (${Math.floor(parseInt(duration) * 0.1)} mins)
(Provide exactly 3-5 concrete, varied practice questions/problems that the teacher can directly give to the students to solve on their own)

## ✅ Closure & Exit Ticket (${Math.floor(parseInt(duration) * 0.1)} mins)
(A quick wrap-up task)

Output strictly the Markdown content without any conversational filler. Provide actual educational content (real math problems, science questions, etc.), not just generic placeholders.`;

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
    console.error("Lesson Plan Generation Error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
