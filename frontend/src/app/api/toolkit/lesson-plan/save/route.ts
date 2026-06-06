import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import connectToDatabase from "@/lib/mongoose";
import { LessonPlan } from "@/models/LessonPlan";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !(session.user as any).id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { topic, subject, grade, duration, content } = await req.json();

    if (!topic || !subject || !grade || !duration || !content) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    await connectToDatabase();

    const lessonPlan = new LessonPlan({
      userId: (session.user as any).id,
      topic,
      subject,
      grade,
      duration,
      content,
    });

    await lessonPlan.save();

    return NextResponse.json({ success: true, lessonPlan }, { status: 201 });
  } catch (error: any) {
    console.error("Save Lesson Plan Error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
