import mongoose from "mongoose";

const quizSchema = new mongoose.Schema({
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true
    },
    title: {
        type: String,
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Ensure only faculty create quizzes in app logic
        required: true
    },
    questions: [{
        questionText: {
            type: String,
            required: true
        },
        options: [{
            type: String,
            required: true
        }],
        correctAnswerIndex: {
            type: Number,
            required: true
        }
    }],
    submissions: [{
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
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

const Quiz = mongoose.models.Quiz || mongoose.model("Quiz", quizSchema);
export default Quiz;
