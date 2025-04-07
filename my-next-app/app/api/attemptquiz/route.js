import connectDB from "@/lib/mongodb";
import { NextResponse } from "next/server";
import Quiz from "@/models/quiz";
import User from "@/models/user";


export async function GET(req) {
  await connectDB();

  try {
    const { searchParams } = new URL(req.url);
    const quizId = searchParams.get("quizId");
    const studentId = searchParams.get("studentId");

    if (!quizId || !studentId) {
      return NextResponse.json(
        { error: "Missing quizId or studentId" },
        { status: 400 }
      );
    }

    const quiz = await Quiz.findById(quizId).select("submissions");
    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    const hasAttempted = quiz.submissions.some(
      (sub) => sub.studentId.toString() === studentId
    );

    return NextResponse.json({ hasAttempted });
  } catch (error) {
    console.error("Error checking quiz attempt:", error);
    return NextResponse.json(
      { error: "Failed to check quiz attempt" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  await connectDB();

  try {
    const body = await req.json();
    const { quizId, studentId, answers } = body;

    if (!quizId || !studentId || !answers || !Array.isArray(answers)) {
      return NextResponse.json(
        { error: "Missing or invalid quizId, studentId, or answers" },
        { status: 400 }
      );
    }

    const quiz = await Quiz.findById(quizId).populate("courseId");
    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    const hasExistingSubmission = quiz.submissions.some(
      (sub) => sub.studentId.toString() === studentId
    );
    if (hasExistingSubmission) {
      return NextResponse.json(
        { error: "You have already attempted this quiz" },
        { status: 400 }
      );
    }

    let totalScore = 0;
    for (const answer of answers) {
      const question = quiz.questions[answer.questionIndex];
      if (!question) {
        return NextResponse.json(
          { error: `Question at index ${answer.questionIndex} not found` },
          { status: 400 }
        );
      }

      if (
        (question.questionType === "MCQ" || question.questionType === "True/False") &&
        (answer.selectedOptionIndex === undefined || answer.selectedOptionIndex === null)
      ) {
        return NextResponse.json(
          { error: `Selected option index is required for question ${answer.questionIndex}` },
          { status: 400 }
        );
      }

      if (
        question.questionType === "Short Answer" &&
        (!answer.textAnswer || answer.textAnswer.trim() === "")
      ) {
        return NextResponse.json(
          { error: `Text answer is required for question ${answer.questionIndex}` },
          { status: 400 }
        );
      }

      if (
        (question.questionType === "MCQ" || question.questionType === "True/False") &&
        answer.selectedOptionIndex === question.correctAnswerIndex
      ) {
        totalScore += question.marks || 1;
      }
    }

    // Save submission in quiz
    const submission = {
      studentId,
      answers: answers.map((ans) => ({
        questionIndex: ans.questionIndex,
        selectedOptionIndex: ans.selectedOptionIndex,
        textAnswer: ans.textAnswer,
      })),
    };
    quiz.submissions.push(submission);
    await quiz.save();

    // Update student quiz scores
    const student = await User.findById(studentId);
    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    student.quizzes.push({
      quizId: quiz._id,
      score: totalScore,
    });

    await student.save();

    return NextResponse.json({
      success: true,
      message: "Quiz submitted successfully",
      score: totalScore,
      quizId: quiz._id,
    });
  } catch (error) {
    console.error("Quiz submission error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to submit quiz attempt",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
