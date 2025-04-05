// import { NextResponse } from "next/server";
// import mongoose from "mongoose";
// import connectDB from "@/lib/mongodb";
// import User from "@/models/user";
// import Course from "@/models/courses";

// export async function POST(req) {
//   try {
//     await connectDB();
//     const { courseId, semesterId, gradeScale } = await req.json();

//     if (!courseId || !semesterId || !gradeScale) {
//       return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
//     }

//     const semesterObjectId = new mongoose.Types.ObjectId(semesterId);
//     const courseObjectId = new mongoose.Types.ObjectId(courseId);

//     const studentsResponse = await fetch(`http://localhost:3000/api/fetchstudents?semester=${semesterId}`);
//     const students = await studentsResponse.json();

//     if (!students || students.error) {
//       return NextResponse.json({ error: students.error || "Failed to fetch students" }, { status: 400 });
//     }

//     const studentsWithRecords = await User.find(
//       {
//         _id: { $in: students.map(s => s._id) },
//         role: "student",
//         "academicRecords.semesterId": semesterObjectId
//       },
//       "academicRecords"
//     ).lean();

//     let marksArray = [];
//     let studentUpdates = [];
//     let allStudentsMarked = true;

//     studentsWithRecords.forEach(student => {
//       let hasMarks = false;

//       student.academicRecords.forEach(record => {
//         if (record.semesterId.toString() === semesterId) {
//           record.courses.forEach(courseData => {
//             if (courseData.courseId.toString() === courseId) {
//               if (courseData.marks !== null) {
//                 marksArray.push(courseData.marks);
//                 studentUpdates.push({ studentId: student._id, marks: courseData.marks });
//                 hasMarks = true;
//               }
//             }
//           });
//         }
//       });

//       if (!hasMarks) {
//         allStudentsMarked = false;
//       }
//     });

//     if (!allStudentsMarked || marksArray.length !== students.length) {
//       return NextResponse.json({ error: "Not all students have been marked" }, { status: 400 });
//     }

//     // Sort custom grading scale in descending order of marks
//     gradeScale.sort((a, b) => b.minMarks - a.minMarks);

//     for (const { studentId, marks } of studentUpdates) {
//       const assignedGrade = gradeScale.find(scale => marks >= scale.minMarks)?.grade || "F";

//       await User.updateOne(
//         { _id: studentId, "academicRecords.semesterId": semesterObjectId },
//         {
//           $set: { "academicRecords.$[record].courses.$[course].grade": assignedGrade }
//         },
//         {
//           arrayFilters: [
//             { "record.semesterId": semesterObjectId },
//             { "course.courseId": courseObjectId }
//           ]
//         }
//       );
//     }

//     return NextResponse.json({ message: "Grades assigned using custom scale" }, { status: 200 });

//   } catch (err) {
//     console.error("Error assigning custom grades:", err);
//     return NextResponse.json({ error: "Failed to assign grades" }, { status: 500 });
//   }
// }

import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import User from "@/models/user";
import Course from "@/models/courses";
import Semester from "@/models/semesters";

export async function POST(req) {
  try {
    await connectDB();
    const { gradeScale, facultyId } = await req.json();

    if (!facultyId || !gradeScale) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const faculty = await User.findOne({ _id: facultyId, role: "faculty" }).lean();
    if (!faculty || !faculty.courses || faculty.courses.length === 0) {
      return NextResponse.json({ error: "No courses assigned to this faculty." }, { status: 400 });
    }

    const courseId = faculty.courses[0].courseId;
    const semester = await Semester.findOne({ courses: courseId }).lean();
    if (!semester) {
      return NextResponse.json({ error: "No semester found for this course." }, { status: 400 });
    }

    const semesterId = semester._id;

    const students = await User.find({
      role: "student",
      semester: semesterId
    }).lean();

    if (!students || students.length === 0) {
      return NextResponse.json({ error: "No students found for this semester." }, { status: 400 });
    }

    const studentsWithRecords = await User.find(
      {
        _id: { $in: students.map(s => s._id) },
        role: "student",
        "academicRecords.semesterId": semesterId
      },
      "academicRecords"
    ).lean();

    let marksArray = [];
    let studentUpdates = [];
    let allStudentsMarked = true;

    studentsWithRecords.forEach(student => {
      let hasMarks = false;

      student.academicRecords.forEach(record => {
        if (record.semesterId.toString() === semesterId.toString()) {
          record.courses.forEach(courseData => {
            if (courseData.courseId.toString() === courseId.toString()) {
              if (courseData.marks !== null && courseData.marks !== undefined) {
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

    if (!allStudentsMarked || marksArray.length !== students.length) {
      return NextResponse.json({ error: "Not all students have been marked." }, { status: 400 });
    }

    // Sort custom grading scale in descending order of marks
    gradeScale.sort((a, b) => b.minMarks - a.minMarks);

    for (const { studentId, marks } of studentUpdates) {
      const assignedGrade = gradeScale.find(scale => marks >= scale.minMarks)?.grade || "F";

      await User.updateOne(
        { _id: studentId, "academicRecords.semesterId": semesterId },
        {
          $set: { "academicRecords.$[record].courses.$[course].grade": assignedGrade }
        },
        {
          arrayFilters: [
            { "record.semesterId": semesterId },
            { "course.courseId": courseId }
          ]
        }
      );
    }

    return NextResponse.json({ message: "Grades assigned using custom scale." }, { status: 200 });

  } catch (err) {
    console.error("Error assigning custom grades:", err);
    return NextResponse.json({ error: "Failed to assign grades" }, { status: 500 });
  }
}
