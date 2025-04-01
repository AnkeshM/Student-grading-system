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
        ref: "User",
        default: null // Faculty is optional
    }
});

const Course = mongoose.models.Course || mongoose.model("Course", newCourse);
export default Course;
