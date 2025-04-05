import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/user";

export async function POST(req) {
  try {
    await connectDB();
    const { email } = await req.json();

    const student = await User.findOne({ email, role: "student" });

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    return NextResponse.json({ academicRecords: student.academicRecords }, { status: 200 });
  } catch (err) {
    console.error("Error fetching grades:", err);
    return NextResponse.json({ error: "Failed to fetch grades" }, { status: 500 });
  }
}
