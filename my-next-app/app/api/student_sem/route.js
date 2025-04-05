import { NextResponse } from "next/server";
import User from "/models/user";
import Semester from "/models/semesters";
import connectDB from "@/lib/mongodb";

export async function GET() {
  await connectDB();

  try {
    // Find semesters that have students assigned
    const studentSemesters = await User.distinct("semester", { role: "student" });

    const semesters = await Semester.find({ _id: { $in: studentSemesters } });

    return NextResponse.json({ semesters });
  } catch (err) {
    console.error("Error fetching semesters:", err);
    return NextResponse.json({ error: "Failed to fetch semesters" }, { status: 500 });
  }
}
