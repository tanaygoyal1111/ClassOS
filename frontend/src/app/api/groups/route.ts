import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import connectToDatabase from '@/lib/mongoose';
import { Group } from '@/models/Group';
import { Assignment } from '@/models/Assignment';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !(session.user as any).id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const teacherId = (session.user as any).id;
    const groups = await Group.find({ teacherId }).sort({ createdAt: -1 }).lean();

    const groupsWithCounts = await Promise.all(
      groups.map(async (group) => {
        const count = await Assignment.countDocuments({ groupId: String(group._id) });
        return {
          ...group,
          assignmentCount: count
        };
      })
    );

    return NextResponse.json({ success: true, count: groupsWithCounts.length, data: groupsWithCounts }, { status: 200 });
  } catch (error) {
    console.error('Fetch groups error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !(session.user as any).id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const teacherId = (session.user as any).id;
    const body = await req.json();
    const { name, description } = body;

    if (!name) {
      return NextResponse.json({ error: 'Group name is required' }, { status: 400 });
    }

    await connectToDatabase();

    const newGroup = await Group.create({
      name,
      description,
      teacherId,
      students: [],
      assignments: []
    });

    return NextResponse.json({ success: true, data: newGroup }, { status: 201 });
  } catch (error) {
    console.error('Create group error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
