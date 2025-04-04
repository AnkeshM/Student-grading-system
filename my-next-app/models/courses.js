import mongoose from "mongoose";

const newCourse = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true,
        unique: true
    },
    faculty: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        default: null // Faculty is optional
    },
    semester: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "semesters"
    },
    credits: {
        type: Number,
        required: true
    }
});

const Course = mongoose.models.courses || mongoose.model("courses", newCourse);
export default Course;
