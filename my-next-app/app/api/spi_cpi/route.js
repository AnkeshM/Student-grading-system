import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import User from "/models/user";
import Semester from "/models/semesters";
import Course from "/models/courses";

export async function POST(req) {
  await connectDB();

  try {
    const { semesterId } = await req.json();

    if (!semesterId) {
      return NextResponse.json({ error: "semesterId is required" }, { status: 400 });
    }

    const semesterObjectId = new mongoose.Types.ObjectId(semesterId);
    const semester = await Semester.findById(semesterObjectId).populate("courses");

    if (!semester) {
      return NextResponse.json({ error: "Semester not found" }, { status: 404 });
    }

    const courses = semester.courses;
    const students = await User.find({ role: "student", semester: semesterObjectId });

    // Validation: check all students are graded for all courses
    for (const student of students) {
      const record = student.academicRecords.find(rec =>
        rec.semesterId.toString() === semesterId
      );

      if (!record || record.courses.length !== courses.length) {
        return NextResponse.json({
          error: `Student ${student.name} is missing grades or course data`
        }, { status: 400 });
      }

      for (const course of record.courses) {
        if (!course.grade) {
          return NextResponse.json({
            error: `Student ${student.name} has an ungraded course`
          }, { status: 400 });
        }
      }
    }

    const gradeMap = {
      AA: 10,
      AB: 9,
      BB: 8,
      BC: 7,
      CC: 6,
      CD: 5,
      DD: 4,
      F: 0
    };

    // Calculate SPI & CPI for each student
    for (const student of students) {
      const record = student.academicRecords.find(rec =>
        rec.semesterId.toString() === semesterId
      );

      let totalCredits = 0;
      let weightedSum = 0;

      for (const courseRec of record.courses) {
        const course = courses.find(c =>
          c._id.toString() === courseRec.courseId.toString()
        );

        const credit = course.credits;
        const gradeVal = gradeMap[courseRec.grade];

        totalCredits += credit;
        weightedSum += credit * gradeVal;
      }

      const SPI = weightedSum / totalCredits;
      record.SPI = parseFloat(SPI.toFixed(2));

      // Calculate CPI
      let cumulativeWeighted = 0;
      let cumulativeCredits = 0;

      for (const sem of student.academicRecords) {
        let semCredits = 0;

        for (const course of sem.courses) {
          const courseData = await Course.findById(course.courseId);
          if (courseData) {
            semCredits += courseData.credits;
          }
        }

        cumulativeCredits += semCredits;
        cumulativeWeighted += (sem.SPI || 0) * semCredits;
      }

      const CPI = cumulativeWeighted / cumulativeCredits;
      record.CPI = parseFloat(CPI.toFixed(2));

      await student.save();
    }

    return NextResponse.json({ message: "SPI and CPI calculated successfully" });

  } catch (err) {
    console.error("Error calculating SPI/CPI:", err);
    return NextResponse.json({ error: "Failed to calculate SPI/CPI" }, { status: 500 });
  }
}
