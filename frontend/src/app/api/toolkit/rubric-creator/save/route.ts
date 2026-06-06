import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import connectToDatabase from "@/lib/mongoose";
import { Rubric } from "@/models/Rubric";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !(session.user as any).id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { assignmentTitle, subject, gradeLevel, maxMarks, content } = await req.json();

    if (!assignmentTitle || !subject || !gradeLevel || !maxMarks || !content) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    await connectToDatabase();

    const rubric = new Rubric({
      userId: (session.user as any).id,
      assignmentTitle,
      subject,
      gradeLevel,
      maxMarks,
      content,
    });

    await rubric.save();

    return NextResponse.json({ success: true, rubric }, { status: 201 });
  } catch (error: any) {
    console.error("Save Rubric Error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
