import connectDB from "@/lib/mongodb";
import { NextResponse } from "next/server";
import Quiz from "@/models/quiz";
import Student from "@/models/user";
import Semester from "@/models/semesters";
import Course from "@/models/courses";


export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get("studentId");
    const quizId = searchParams.get("quizId");

    // If quizId is provided, fetch a single quiz
    if (quizId) {
      const quiz = await Quiz.findById(quizId)
        .populate("courseId", "name")
        .lean();
      console.log("Fetched single quiz:", quiz);
      if (!quiz) {
        return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
      }
      return NextResponse.json(quiz);
    }

    if (!studentId) {
      return NextResponse.json({ error: "Missing studentId or quizId" }, { status: 400 });
    }

    const student = await Student.findById(studentId);
    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    // Fetch the Semester document using student's semester field
    const semesterDoc = await Semester.findById(student.semester).lean();
    if (!semesterDoc) {
      return NextResponse.json({ error: "Semester not found for student" }, { status: 404 });
    }

    // Get courses from the Semester's courses array
    const courseIds = semesterDoc.courses;
    console.log("Courses from semester:", courseIds);

    // Fetch quizzes for those courses using courseId field in Quiz schema
    const quizzes = await Quiz.find({ courseId: { $in: courseIds } })
      .populate("courseId", "name")
      .select("title description courseId")
      .lean();

    console.log("Fetched quizzes for student:", quizzes);
    return NextResponse.json(quizzes);
  } catch (error) {
    console.error("Error in /api/quizzes:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
