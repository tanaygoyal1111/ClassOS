import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import connectToDatabase from "@/lib/mongoose";
import { Rubric } from "@/models/Rubric";
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

    const rubric = await Rubric.findOneAndUpdate(
      { _id: id, userId: (session.user as any).id },
      { isArchived: true },
      { new: true }
    );

    if (!rubric) {
      return NextResponse.json({ success: false, error: "Rubric not found or unauthorized" }, { status: 404 });
    }

    revalidatePath('/dashboard');
    revalidatePath('/library');

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Rubric Delete Error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
