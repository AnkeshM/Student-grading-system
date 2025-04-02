import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import Course from "@/models/Course";
import { NextResponse } from "next/server";

export async function GET(req) {
  await connectToDatabase(); // Ensure DB is connected

  const { searchParams } = new URL(req.url);
  const courseId = searchParams.get("courseId");

  if (courseId) {
    try {
      // Fetch students enrolled in the course by courseId
      const students = await User.find(
        { 
          role: "student",
          "academicRecords.courses.courseId": courseId 
        }, 
        "_id name academicRecords"
      );

      return NextResponse.json(students);
    } catch (error) {
      console.error("Error fetching students:", error);
      return NextResponse.json({ error: "Failed to fetch students" }, { status: 500 });
    }
  } else {
    const facultyId = searchParams.get("facultyId");
    
    try {
      // Fetch courses assigned to a specific faculty
      const courses = await Course.find({ faculty: facultyId });
      return NextResponse.json(courses);
    } catch (error) {
      console.error("Error fetching courses:", error);
      return NextResponse.json({ error: "Failed to fetch courses" }, { status: 500 });
    }
  }
}

export async function POST(req) {
  await connectToDatabase(); // Ensure DB is connected

  try {
    const { courseId, marks } = await req.json();

    // Ensure marks is a valid object
    if (!marks || typeof marks !== 'object') {
      return NextResponse.json({ error: "Invalid marks data" }, { status: 400 });
    }

    // Iterate over marks and update the students' marks for the course
    for (const studentId in marks) {
      if (marks.hasOwnProperty(studentId)) {
        // Update the specific student document with new marks
        await User.updateOne(
          { _id: studentId, "academicRecords.courses.courseId": courseId },
          { $set: { "academicRecords.$.marks": marks[studentId] } }
        );
      }
    }

    return NextResponse.json({ message: "Marks assigned successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error assigning marks:", error);
    return NextResponse.json({ error: "Failed to assign marks" }, { status: 500 });
  }
}
