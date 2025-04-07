import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "/models/user";

export async function GET(req) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  try {
    const user = await User.findOne({ email }).lean();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ academicRecords: user.academicRecords || [] });
  } catch (err) {
    console.error("Error fetching performance data:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
