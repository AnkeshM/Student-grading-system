import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/mongodb";
import User from "@/models/user";
import Semester from "@/models/semesters";

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    const { role, name, gender, batch, department, email, password, semester } = body;

    // Validate required fields
    if (!gender) {
      return NextResponse.json({ error: "Gender is required" }, { status: 400 });
    }

    if (!email || !password || !name || !role) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Base user object
    const newUserData = {
      role,
      name,
      gender,
      email,
      password: hashedPassword,
    };

    if (role === "student") {
      if (!batch || !semester) {
        return NextResponse.json({ error: "Batch and semester are required for students" }, { status: 400 });
      }

      const semesterName = `Semester ${semester}`;
      const semesterDoc = await Semester.findOne({ name: semesterName });

      if (!semesterDoc) {
        return NextResponse.json({ error: `Semester ${semester} not found` }, { status: 404 });
      }

      newUserData.batch = batch;
      newUserData.semester = semesterDoc._id;
      newUserData.academicRecords = [{
        semesterId: semesterDoc._id,
        semesterName: semesterDoc.name,
        courses: [],
      }];
    }

    if (role === "faculty") {
      if (!department) {
        return NextResponse.json({ error: "Department is required for faculty" }, { status: 400 });
      }
      newUserData.department = department;
    }

    const newUser = new User(newUserData);
    await newUser.save();

    return NextResponse.json({ message: "User registered successfully" }, { status: 201 });

  } catch (err) {
    console.error("Registration Error:", err);
    return NextResponse.json({ error: "Failed to register user" }, { status: 500 });
  }
}
