import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "/models/user";
import Semester from "/models/semesters";

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    const { email, semesterName } = body;

    if (!email || !semesterName) {
      return NextResponse.json(
        { error: "Missing required fields (email or semesterName)." },
        { status: 400 }
      );
    }

    // Find the semester by name
    const semester = await Semester.findOne({ name: semesterName });

    if (!semester) {
      return NextResponse.json(
        { error: "Semester with that name not found." },
        { status: 404 }
      );
    }

    const student = await User.findOne({ email, role: "student" });

    if (!student) {
      return NextResponse.json(
        { error: "Student not found." },
        { status: 404 }
      );
    }

    const exists = student.academicRecords.some(
      record => record.semesterId.toString() === semester._id.toString()
    );

    student.semester = semester._id;
    
    if (exists) {
      return NextResponse.json(
        { error: "Semester already added to academic records." },
        { status: 400 }
      );
    }

    // Add semester to academicRecords
    student.academicRecords.push({
      semesterId: semester._id,
      semesterName: semester.name,
      SPI: 0,
      CPI: 0,
      courses: []
    });

    // Optionally also update current semester reference

    await student.save();

    return NextResponse.json(
      { message: "Semester added successfully.", student },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error adding semester:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
