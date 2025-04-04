import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import User from "@/models/user";
import Course from "@/models/courses";

export async function POST(req) {
  try {
    await connectDB();
    const { courseId, semesterId } = await req.json();

    if (!courseId || !semesterId) {
      return NextResponse.json({ error: "Course ID and Semester ID are required" }, { status: 400 });
    }

    // Convert to ObjectId if necessary
    const semesterObjectId = new mongoose.Types.ObjectId(semesterId);
    const courseObjectId = new mongoose.Types.ObjectId(courseId);

    // Fetch students using API
    const studentsResponse = await fetch(`http://localhost:3000/api/fetchstudents?semester=${semesterId}`);
    const students = await studentsResponse.json();

    if (!students || students.error) {
      return NextResponse.json({ error: students.error || "Failed to fetch students" }, { status: 400 });
    }

    // Fetch students' academic records
    const studentsWithRecords = await User.find(
      { 
        _id: { $in: students.map(s => s._id) },
        role: "student",
        "academicRecords.semesterId": semesterObjectId
      },
      "academicRecords"
    ).lean();

    // Fetch the course
    const course = await Course.findById(courseObjectId).lean();
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // Collect marks and check if all students have marks assigned
    let marksArray = [];
    let studentUpdates = [];
    let allStudentsMarked = true;

    studentsWithRecords.forEach(student => {
      let hasMarks = false;

      student.academicRecords.forEach(record => {
        if (record.semesterId.toString() === semesterId) {
          record.courses.forEach(courseData => {
            if (courseData.courseId.toString() === courseId) {
              if (courseData.marks !== null) {
                marksArray.push(courseData.marks);
                studentUpdates.push({ studentId: student._id, marks: courseData.marks });
                hasMarks = true;
              }
            }
          });
        }
      });

      if (!hasMarks) {
        allStudentsMarked = false;
      }
    });

    // Ensure all students have marks before proceeding
    if (!allStudentsMarked || marksArray.length !== students.length) {
      return NextResponse.json({ error: "Not all students have been marked for this course" }, { status: 400 });
    }

    // Calculate mean and standard deviation
    const mean = marksArray.reduce((sum, mark) => sum + mark, 0) / marksArray.length;
    const stdDev = Math.sqrt(marksArray.reduce((sum, mark) => sum + Math.pow(mark - mean, 2), 0) / marksArray.length);

    // Define grading scale
    const gradeScale = [
      { grade: "AA", minZ: 1.5 },
      { grade: "AB", minZ: 1.0 },
      { grade: "BB", minZ: 0.5 },
      { grade: "BC", minZ: 0.0 },
      { grade: "CC", minZ: -0.5 },
      { grade: "CD", minZ: -1.0 },
      { grade: "DD", minZ: -1.5 },
      { grade: "F", minZ: -Infinity },
    ];

    // Assign grades and update database
    for (const { studentId, marks } of studentUpdates) {
      const zScore = (marks - mean) / stdDev;
      const assignedGrade = gradeScale.find(scale => zScore >= scale.minZ).grade;

      await User.updateOne(
        { _id: studentId, "academicRecords.semesterId": semesterObjectId },
        { 
          $set: { "academicRecords.$[record].courses.$[course].grade": assignedGrade } 
        },
        {
          arrayFilters: [
            { "record.semesterId": semesterObjectId },
            { "course.courseId": courseObjectId }
          ]
        }
      );
    }

    return NextResponse.json({ message: "Grades assigned successfully" }, { status: 200 });
  } catch (err) {
    console.error("Error assigning grades:", err);
    return NextResponse.json({ error: "Failed to assign grades" }, { status: 500 });
  }
}
