import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Semester from "@/models/semesters";

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get("courseId");

    if (!courseId) {
      return NextResponse.json({ error: "Course ID is required" }, { status: 400 });
    }

    if (!courseId.match(/^[0-9a-fA-F]{24}$/)) {
      return NextResponse.json({ error: "Invalid Course ID format" }, { status: 400 });
    }

    // Find semester that includes this courseId
    const semester = await Semester.findOne({ courses: courseId });

    if (!semester) {
      return NextResponse.json({ error: "Semester not found for this course" }, { status: 404 });
    }

    return NextResponse.json({ semester }, { status: 200 });

  } catch (error) {
    console.error("Error fetching semester:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
