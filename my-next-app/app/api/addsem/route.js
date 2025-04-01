// import { NextResponse } from "next/server";
// import dbConnect from "@/lib/mongodb";
// import Semester from "@/models/semesters";
// import Course from "@/models/courses";

// export async function POST(req) {
//     try {
//         await dbConnect(); // Ensure DB connection

//         const { name, startDate, endDate, courses } = await req.json();

//         if (!name || !startDate || !endDate) {
//             return NextResponse.json({ error: "All fields are required" }, { status: 400 });
//         }

//         // Find the ObjectIds of the provided course codes
//         let courseObjects = [];
//         if (courses && courses.length > 0) {
//             courseObjects = await Course.find({ code: { $in: courses } }).select("_id name");

//             if (courseObjects.length !== courses.length) {
//                 return NextResponse.json({ error: "One or more course codes are invalid" }, { status: 400 });
//             }
//         }

//         // Create the semester with valid course ObjectIds
//         const newSemester = new Semester({
//             name,
//             startDate: new Date(startDate),
//             endDate: new Date(endDate),
//             courses: courseObjects.map(course => ({
//                 courseId: course._id,
//                 courseName: course.name
//             }))
//         });

//         await newSemester.save();

//         return NextResponse.json({ message: "Semester added successfully", semester: newSemester }, { status: 201 });

//     } catch (error) {
//         console.error("Error adding semester:", error);
//         return NextResponse.json({ error: "Failed to add semester" }, { status: 500 });
//     }
// }


import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Semester from "@/models/semesters";
import Course from "@/models/courses";

export async function POST(req) {
    try {
        await dbConnect(); // Ensure DB connection

        const { name, startDate, endDate, courses } = await req.json();

        if (!name || !startDate || !endDate) {
            return NextResponse.json({ error: "All fields are required" }, { status: 400 });
        }

        // Find the ObjectIds of the provided course codes
        let courseObjects = [];
        if (courses && courses.length > 0) {
            courseObjects = await Course.find({ code: { $in: courses } }).select("_id");

            if (courseObjects.length !== courses.length) {
                return NextResponse.json({ error: "One or more course codes are invalid" }, { status: 400 });
            }
        }

        // Create the semester with valid course ObjectIds
        const newSemester = new Semester({
            name,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            courses: courseObjects.map(course => course._id) // Only store ObjectIds
        });

        await newSemester.save();

        return NextResponse.json({ message: "Semester added successfully", semester: newSemester }, { status: 201 });

    } catch (error) {
        console.error("Error adding semester:", error);
        return NextResponse.json({ error: "Failed to add semester" }, { status: 500 });
    }
}
