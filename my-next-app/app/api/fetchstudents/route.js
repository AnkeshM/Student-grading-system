import connectDB from "@/lib/mongodb";
import User from "@/models/user";
import mongoose from "mongoose";

export async function GET(req) {
  try {
    await connectDB();

    // Extract semester ID from query params
    const { searchParams } = new URL(req.url);
    const semesterId = searchParams.get("semester");

    if (!semesterId || !mongoose.Types.ObjectId.isValid(semesterId)) {
      return new Response(JSON.stringify({ error: "Valid Semester ID is required" }), { status: 400 });
    }

    // Convert semesterId to ObjectId
    const semesterObjectId = new mongoose.Types.ObjectId(semesterId);

    // Find all students in the given semester
    const students = await User.find(
      { role: "student", semester: semesterObjectId },
      "_id name email batch semester"
    )
      .populate("semester", "name startDate endDate") // Populate semester details if needed
      .sort({ name: 1 });

    if (!students.length) {
      return new Response(JSON.stringify({ error: "No students found for this semester" }), { status: 404 });
    }

    return new Response(JSON.stringify(students), { status: 200 });
  } catch (error) {
    console.error("Error fetching students:", error);
    return new Response(JSON.stringify({ error: error.message || "Internal server error" }), { status: 500 });
  }
}
