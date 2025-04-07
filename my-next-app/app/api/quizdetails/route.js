import connectDB from "@/lib/mongodb";
import { NextResponse } from "next/server";
import Quiz from "@/models/quiz";

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const quizId = searchParams.get("id");

    if (!quizId) {
      return NextResponse.json({ error: "Missing quizId" }, { status: 400 });
    }

    const quiz = await Quiz.findById(quizId).lean();

    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    return NextResponse.json(quiz);
  } catch (error) {
    console.error("Error fetching quiz details:", error);
    return NextResponse.json(
      { error: "Failed to fetch quiz details" },
      { status: 500 }
    );
  }
}
