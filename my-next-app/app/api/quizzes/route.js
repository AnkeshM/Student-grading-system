// app/api/quizzes/route.js
import connectDB from "@/lib/mongodb";
import { NextResponse } from "next/server";
import Quiz from "@/models/quiz";
import Student from "@/models/user";
import Course from "@/models/courses";

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get("studentId");
    const quizId = searchParams.get("quizId");

    // 📌 If quizId is provided, fetch single quiz
    if (quizId) {
      const quiz = await Quiz.findById(quizId)
        .populate("courseId", "name")
        .lean();

      if (!quiz) {
        return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
      }

      return NextResponse.json(quiz);
    }

    // 📌 If studentId is provided, fetch quizzes available for that student
    if (!studentId) {
      return NextResponse.json({ error: "Missing studentId or quizId" }, { status: 400 });
    }

    const student = await Student.findById(studentId);
    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    const courses = await Course.find({ semester: student.semester });
    const courseIds = courses.map((c) => c._id);

    const quizzes = await Quiz.find({ courseId: { $in: courseIds } })
      .populate("courseId", "name")
      .select("title description courseId")
      .lean();

    return NextResponse.json(quizzes);
  } catch (error) {
    console.error("Error in /api/quizzes:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
