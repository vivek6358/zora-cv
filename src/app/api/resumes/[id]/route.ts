import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { Resume } from "@/models/Resume";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";

// PUT /api/resumes/[id] - Update a specific resume
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user || !(session.user as any).id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const userId = (session.user as any).id;
    const updateData = await req.json();

    await connectToDatabase();

    // Ensure the resume belongs to the user
    const resume = await Resume.findOne({ _id: id, userId });
    
    if (!resume) {
      return NextResponse.json({ error: "Resume not found or unauthorized" }, { status: 404 });
    }

    // Update the resume
    const updatedResume = await Resume.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    return NextResponse.json({ resume: updatedResume }, { status: 200 });
  } catch (error) {
    console.error("Error updating resume:", error);
    return NextResponse.json({ error: "Failed to update resume" }, { status: 500 });
  }
}

// DELETE /api/resumes/[id] - Delete a specific resume
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user || !(session.user as any).id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const userId = (session.user as any).id;

    await connectToDatabase();

    const deletedResume = await Resume.findOneAndDelete({ _id: id, userId });
    
    if (!deletedResume) {
      return NextResponse.json({ error: "Resume not found or unauthorized" }, { status: 404 });
    }

    return NextResponse.json({ message: "Resume deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting resume:", error);
    return NextResponse.json({ error: "Failed to delete resume" }, { status: 500 });
  }
}
