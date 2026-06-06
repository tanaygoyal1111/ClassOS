import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import connectToDatabase from "@/lib/mongoose";
import { Assignment } from "@/models/Assignment";
import { LessonPlan } from "@/models/LessonPlan";
import { Rubric } from "@/models/Rubric";
import { Concept } from "@/models/Concept";
// import { Group } from "@/models/Group"; // Assuming Group doesn't exist yet, uncomment if it does

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !(session.user as any).id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;

    await connectToDatabase();

    // Wipe all user data across all models
    await Assignment.deleteMany({ userId });
    await LessonPlan.deleteMany({ userId });
    await Rubric.deleteMany({ userId });
    await Concept.deleteMany({ userId });
    
    // if (Group) await Group.deleteMany({ userId });

    return NextResponse.json({ 
      success: true, 
      message: "Database wiped successfully. Clean slate ready!" 
    }, { status: 200 });

  } catch (error) {
    console.error("Database reset error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
