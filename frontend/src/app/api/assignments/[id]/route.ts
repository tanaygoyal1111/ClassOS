import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import connectToDatabase from "@/lib/mongoose";
import { Assignment } from "@/models/Assignment";
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

    const userId = (session.user as any).id;
    const resolvedParams = await params;
    const { id } = resolvedParams;

    if (!id) {
      return NextResponse.json({ success: false, error: "Missing Assignment ID" }, { status: 400 });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, error: "Invalid Assignment ID" }, { status: 400 });
    }

    await connectToDatabase();

    const assignment = await Assignment.findOne({ _id: id, userId });

    if (!assignment) {
      return NextResponse.json({ success: false, error: "Assignment not found or forbidden" }, { status: 404 });
    }

    await Assignment.findOneAndUpdate({ _id: id, userId }, { isArchived: true });

    revalidatePath('/dashboard');
    revalidatePath('/library');

    return NextResponse.json({ success: true, message: "Assignment deleted successfully" }, { status: 200 });

  } catch (error) {
    console.error("Delete assignment error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !(session.user as any).id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const resolvedParams = await params;
    const { id } = resolvedParams;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, error: "Invalid Assignment ID" }, { status: 400 });
    }

    const body = await req.json();
    const { groupId } = body;

    await connectToDatabase();

    const assignment = await Assignment.findOne({ _id: id, userId });

    if (!assignment) {
      return NextResponse.json({ success: false, error: "Assignment not found or forbidden" }, { status: 404 });
    }

    assignment.groupId = groupId || null;
    await assignment.save();

    return NextResponse.json({ success: true, data: assignment }, { status: 200 });
  } catch (error) {
    console.error("Patch assignment error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
