import connectDB from "@/lib/mongodb";
import { NextResponse } from "next/server";
import Quiz from "@/models/quiz";
import Faculty from "@/models/user";

export async function POST(req) {
  await connectDB();

  try {
    const body = await req.json();
    const { title, createdBy, courseId, questions } = body;

    if (!title || !createdBy || !courseId || !Array.isArray(questions)) {
      return NextResponse.json(
        { error: "Missing required fields: title, createdBy, courseId, questions" },
        { status: 400 }
      );
    }

    const newQuiz = new Quiz({
      courseId,
      title,
      createdBy,
      questions: questions.map((q) => ({
        questionText: q.questionText,
        questionType: q.questionType,
        options: q.options.map((opt) => ({ text: opt })),
        correctAnswerIndex: q.correctAnswerIndex,
        marks: q.marks || 1,
      })),
    });

    await newQuiz.save();

    return NextResponse.json(
      {
        message: "Quiz created successfully",
        quiz: {
          id: newQuiz._id,
          title: newQuiz.title,
          questionCount: newQuiz.questions.length,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating quiz:", error);
    return NextResponse.json(
      { error: "Failed to create quiz", details: error.message },
      { status: 500 }
    );
  }
}
