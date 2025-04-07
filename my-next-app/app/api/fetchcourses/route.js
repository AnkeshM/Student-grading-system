import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/user";
import Course from "@/models/courses";

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const facultyId = searchParams.get("facultyId");

    if (!facultyId) {
      return NextResponse.json({ error: "Faculty ID is required" }, { status: 400 });
    }

    // Find the faculty
    const faculty = await User.findOne({ _id: facultyId, role: "faculty" });

    if (!faculty) {
      return NextResponse.json({ error: "Faculty not found or unauthorized" }, { status: 404 });
    }

    // Extract courseIds from faculty.courses
    const courseIds = faculty.courses.map((c) => c.courseId);

    // Fetch course details
    const courses = await Course.find({ _id: { $in: courseIds } });

    if (!courses || courses.length === 0) {
      return NextResponse.json({ error: "No courses found for this faculty" }, { status: 404 });
    }

    return NextResponse.json(courses, { status: 200 });

  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
