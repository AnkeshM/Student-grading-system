import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Course from "@/models/courses";
import User from "@/models/user";

export async function POST(req) {
    try {
        await dbConnect();

        const { name, code, faculty } = await req.json();

        if (!name || !code) {
            return NextResponse.json({ error: "Course name and code are required" }, { status: 400 });
        }

        let facultyObjectId = null;
        if (faculty) {
            const facultyMember = await User.findOne({ _id: faculty, role: "faculty" });
            if (!facultyMember) {
                return NextResponse.json({ error: "Invalid faculty ID" }, { status: 400 });
            }
            facultyObjectId = facultyMember._id;
        }

        const newCourse = new Course({
            name,
            code,
            faculty: facultyObjectId
        });

        await newCourse.save();

        return NextResponse.json({ message: "Course added successfully", course: newCourse }, { status: 201 });

    } catch (error) {
        console.error("Error adding course:", error);
        return NextResponse.json({ error: "Failed to add course" }, { status: 500 });
    }
}
