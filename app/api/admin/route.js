import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/mongodb";
import User from "@/models/user"; // Use User schema
import Semester from "@/models/semesters";

export async function POST(req) {
    try {
        await connectDB();

        const body = await req.json();
        const { role, name, gender, batch, department, email, password } = body;

        // Validate required fields
        if (!gender) {
            return NextResponse.json({ error: "Gender is required" }, { status: 400 });
        }

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ error: "User already exists" }, { status: 400 });
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // Define new user object based on role
        const newUserData = {
            role,
            name,
            gender,
            email,
            password: hashedPassword
        };

        if (role === "student") {
            if (!batch) {
                return NextResponse.json({ error: "Batch is required for students" }, { status: 400 });
            }

            // Fetch Semester 1 from the database
            const semester1 = await Semester.findOne({ name: "Semester 1" });
            if (!semester1) {
                return NextResponse.json({ error: "Semester 1 not found" }, { status: 500 });
            }

            newUserData.batch = batch;
            newUserData.semester = semester1._id; // Assign Semester 1 ObjectId
        } else if (role === "faculty") {
            if (!department) {
                return NextResponse.json({ error: "Department is required for faculty" }, { status: 400 });
            }
            newUserData.department = department;
        }

        // Save user to database
        const newUser = new User(newUserData);
        await newUser.save();

        return NextResponse.json({ message: "User registered successfully" }, { status: 201 });

    } catch (err) {
        console.error("Registration Error:", err);
        return NextResponse.json({ error: "Failed to register user" }, { status: 500 });
    }
}
