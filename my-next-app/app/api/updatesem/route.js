import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Semester from "@/models/semesters";
import Course from "@/models/courses";

export async function PATCH(req) {
    try {
        await dbConnect();
        const { semesterId, courseCode, action } = await req.json();

        if (!semesterId || !courseCode || !action) {
            return NextResponse.json({ error: "Semester ID, course code, and action are required" }, { status: 400 });
        }

        const semester = await Semester.findById(semesterId);
        if (!semester) {
            return NextResponse.json({ error: "Semester not found" }, { status: 404 });
        }

        const course = await Course.findOne({ code: courseCode });
        if (!course) {
            return NextResponse.json({ error: "Course not found" }, { status: 404 });
        }

        if (action === "add") {
            if (!semester.courses.includes(course._id)) {
                semester.courses.push(course._id);
            }
        } else if (action === "remove") {
            semester.courses = semester.courses.filter(id => !id.equals(course._id));
        } else {
            return NextResponse.json({ error: "Invalid action. Use 'add' or 'remove'" }, { status: 400 });
        }

        await semester.save();

        return NextResponse.json({ message: "Semester updated successfully", semester }, { status: 200 });

    } catch (error) {
        console.error("Error updating semester:", error);
        return NextResponse.json({ error: "Failed to update semester" }, { status: 500 });
    }
}