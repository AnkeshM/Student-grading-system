import { NextResponse } from "next/server";
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/quizdb";

if (!mongoose.connections[0].readyState) {
  mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

const questionSchema = new mongoose.Schema({
  text: String,
  type: String,
  marks: Number,
  options: [String],
  correctOption: String,
});

const quizSchema = new mongoose.Schema({
  title: String,
  questions: [questionSchema],
});

const Quiz = mongoose.models.Quiz || mongoose.model("Quiz", quizSchema);

export async function POST(req) {
  try {
    const body = await req.json();
    const { title, questions } = body;
    const newQuiz = new Quiz({ title, questions });
    await newQuiz.save();
    return NextResponse.json({ message: "Quiz created successfully!" }, { status: 201 });
  } catch (error) {
    console.error("Error creating quiz:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const quizzes = await Quiz.find();
    return NextResponse.json(quizzes, { status: 200 });
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
