import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import connectToDatabase from "@/lib/mongoose";
import { Group } from "@/models/Group";
import mongoose from "mongoose";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !(session.user as any).id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const teacherId = (session.user as any).id;
    const resolvedParams = await params;
    const { id } = resolvedParams;

    if (!id) {
      return NextResponse.json({ success: false, error: "Missing Group ID" }, { status: 400 });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, error: "Invalid Group ID" }, { status: 400 });
    }

    await connectToDatabase();

    const group = await Group.findOne({ _id: id, teacherId }).lean();

    if (!group) {
      return NextResponse.json({ success: false, error: "Group not found or forbidden" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: group }, { status: 200 });
  } catch (error) {
    console.error("Fetch group error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !(session.user as any).id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const teacherId = (session.user as any).id;
    const resolvedParams = await params;
    const { id } = resolvedParams;

    if (!id) {
      return NextResponse.json({ success: false, error: "Missing Group ID" }, { status: 400 });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, error: "Invalid Group ID" }, { status: 400 });
    }

    await connectToDatabase();

    const group = await Group.findOne({ _id: id, teacherId });

    if (!group) {
      return NextResponse.json({ success: false, error: "Group not found or forbidden" }, { status: 404 });
    }

    await Group.findOneAndDelete({ _id: id, teacherId });

    return NextResponse.json({ success: true, message: "Group deleted successfully" }, { status: 200 });

  } catch (error) {
    console.error("Delete group error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
