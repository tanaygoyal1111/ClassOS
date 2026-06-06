import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import clientPromise from "@/lib/mongodb";
import connectToDatabase from "@/lib/mongoose";
import { Assignment } from "@/models/Assignment";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !(session.user as any).id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    
    // We are querying the assignments collection for the specific user.
    // Replace 'assignments' with your actual collection name if different.
    const userId = (session.user as any).id;
    const groupId = req.nextUrl.searchParams.get("groupId");
    
    // Construct query
    const query: any = { userId: userId, isArchived: { $ne: true } };
    if (groupId) {
      query.groupId = groupId;
    }
    
    const count = await Assignment.countDocuments(query);

    const assignments = await Assignment.find(query)
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    return NextResponse.json({ success: true, count, data: assignments }, { status: 200 });
  } catch (error) {
    console.error("Assignments fetch error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !(session.user as any).id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const body = await req.json();

    const { title, classLevel, subject, paperContent, groupId, institutionName, studentFieldsSnapshot } = body;

    if (!title || !classLevel || !subject || !paperContent) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await connectToDatabase();

    const newAssignment = await Assignment.create({
      userId,
      title,
      classLevel,
      subject,
      groupId: groupId || undefined,
      institutionName,
      studentFieldsSnapshot,
      paperContent
    });

    return NextResponse.json({ 
      success: true, 
      assignmentId: newAssignment._id 
    }, { status: 201 });

  } catch (error) {
    console.error("Assignment save error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
