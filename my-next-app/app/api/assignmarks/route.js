import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/mongodb';
import User from '@/models/user';
import Course from '@/models/courses';
import Semester from '@/models/semesters';

export async function POST(req) {
  try {
    await connectDB();

    const { courseId, marks } = await req.json();

    if (!courseId || !marks || typeof marks !== 'object') {
      return NextResponse.json({ error: 'Invalid or missing courseId or marks' }, { status: 400 });
    }

    const courseObjectId = new mongoose.Types.ObjectId(courseId);

    const faculty = await User.findOne({
      role: 'faculty',
      'courses.courseId': courseObjectId,
    });

    if (!faculty) {
      return NextResponse.json({ error: 'Faculty not assigned to this course' }, { status: 403 });
    }

    const course = await Course.findById(courseObjectId);
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    const semester = await Semester.findOne({ courses: courseObjectId });
    if (!semester) {
      return NextResponse.json({ error: 'Semester not found for this course' }, { status: 404 });
    }

    const updatePromises = Object.entries(marks).map(async ([studentId, mark]) => {
      const numericMark = Number(mark);
      if (isNaN(numericMark) || numericMark < 0 || numericMark > 100) {
        throw new Error(`Invalid mark (${mark}) for student ID ${studentId}`);
      }

      const student = await User.findById(studentId);
      if (!student || student.role !== 'student') {
        throw new Error(`Student not found with ID ${studentId}`);
      }

      if (!student.semester || student.semester.toString() !== semester._id.toString()) {
        throw new Error(`Student ${student.name} is not enrolled in this semester`);
      }

      // Get index of academic record for this semester
      const recordIndex = student.academicRecords.findIndex(
        (record) => record.semesterId.toString() === semester._id.toString()
      );

      if (recordIndex === -1) {
        // If not present, create a new academic record
        student.academicRecords.push({
          semesterId: semester._id,
          semesterName: semester.name,
          courses: [
            {
              courseId: course._id,
              courseName: course.name,
              marks: numericMark,
            },
          ],
        });
      } else {
        // Check if the course already exists in this record
        const courseIndex = student.academicRecords[recordIndex].courses.findIndex(
          (c) => c.courseId.toString() === course._id.toString()
        );

        if (courseIndex === -1) {
          // Add course if it doesn't exist
          student.academicRecords[recordIndex].courses.push({
            courseId: course._id,
            courseName: course.name,
            marks: numericMark,
          });
        } else {
          // Update marks if it does
          student.academicRecords[recordIndex].courses[courseIndex].marks = numericMark;
        }
      }

      return student.save();
    });

    await Promise.all(updatePromises);

    return NextResponse.json({ message: 'Marks assigned successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error assigning marks:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
