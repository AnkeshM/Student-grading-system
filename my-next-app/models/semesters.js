import mongoose from "mongoose";

const newSemester = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    courses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "courses"
    }]
});

const Semester = mongoose.models.semesters || mongoose.model("semesters", newSemester);
export default Semester;
