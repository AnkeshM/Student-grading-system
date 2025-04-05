import mongoose from "mongoose";

const quizSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "courses",
    required: true
  },
  title: {
    type: String,
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true
  },
  questions: [{
    questionText: {
      type: String,
      required: true
    },
    questionType: {
      type: String,
      enum: ["MCQ", "True/False"],
      required: true
    },
    options: [{
      text: { type: String }
    }],
    correctAnswerIndex: {
      type: Number
    },
    marks: {
      type: Number,
      default: 1
    }
  }],
  submissions: [{
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user"
    },
    answers: [{
      questionIndex: Number,
      selectedOptionIndex: Number
    }],
    score: Number,
    submittedAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Quiz = mongoose.models.quiz || mongoose.model("quiz", quizSchema);
export default Quiz;
