import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import connectToDatabase from "@/lib/mongoose";
import { Assignment } from "@/models/Assignment";
import { LessonPlan } from "@/models/LessonPlan";
import { Rubric } from "@/models/Rubric";
import { Concept } from "@/models/Concept";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !(session.user as any).id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    await connectToDatabase();

    const [assignments, lessonPlans, rubrics, concepts] = await Promise.all([
      Assignment.find({ userId }).sort({ createdAt: -1 }).lean(),
      LessonPlan.find({ userId }).sort({ createdAt: -1 }).lean(),
      Rubric.find({ userId }).sort({ createdAt: -1 }).lean(),
      Concept.find({ userId }).sort({ createdAt: -1 }).lean(),
    ]);

    return NextResponse.json({ success: true, assignments, lessonPlans, rubrics, concepts });
  } catch (error: any) {
    console.error("Library Fetch Error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
