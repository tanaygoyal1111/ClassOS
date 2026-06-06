import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import connectToDatabase from "@/lib/mongoose";
import { LessonPlan } from "@/models/LessonPlan";
import mongoose from "mongoose";
import { revalidatePath } from "next/cache";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !(session.user as any).id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, error: "Invalid ID" }, { status: 400 });
    }

    await connectToDatabase();

    const lessonPlan = await LessonPlan.findOneAndUpdate(
      { _id: id, userId: (session.user as any).id },
      { isArchived: true },
      { new: true }
    );

    if (!lessonPlan) {
      return NextResponse.json({ success: false, error: "Lesson plan not found or unauthorized" }, { status: 404 });
    }

    revalidatePath('/dashboard');
    revalidatePath('/library');

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Lesson Plan Delete Error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
