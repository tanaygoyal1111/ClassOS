import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import connectToDatabase from "@/lib/mongoose";
import { Concept } from "@/models/Concept";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !(session.user as any).id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { concept, subject, gradeLevel, content } = await req.json();

    if (!concept || !subject || !gradeLevel || !content) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    await connectToDatabase();

    const savedConcept = new Concept({
      userId: (session.user as any).id,
      concept,
      subject,
      gradeLevel,
      content,
    });

    await savedConcept.save();

    return NextResponse.json({ success: true, concept: savedConcept }, { status: 201 });
  } catch (error: any) {
    console.error("Save Concept Error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
