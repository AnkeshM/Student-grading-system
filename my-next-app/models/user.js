import mongoose from "mongoose";

const newUser = new mongoose.Schema({
    role: {
        type: String,
        required: true,
        enum: ["student", "faculty", "admin"]
    },
    name: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    batch: {
        type: String, // Only for students
        required: function () { return this.role === "student"; }
    },
    semester: {
        type: mongoose.Schema.Types.ObjectId, // Reference to Semester model
        ref: "semesters",
        required: function () { return this.role === "student"; }
    },
    department: {
        type: String, // Only for faculty
        required: function () { return this.role === "faculty"; }
    },
    courses: [{ // Courses assigned (for faculty)
        courseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "courses"
        }
    }],
    quizzes: [{ // Quizzes attempted (for students)
        quizId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "quiz"
        },
        score: Number
    }],
    academicRecords: [{ // Stores marks and grades for each semester
        semesterId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "semesters"
        },
        semesterName: String, // e.g., "Semester 1"
        courses: [{
            courseId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "courses"
            },
            courseName: String,
            marks: {
                type: Number,
                required: true
            },
            grade: {
                type: String
            }
        }]
    }]
});

const User = mongoose.models.user || mongoose.model("user", newUser);
export default User;
