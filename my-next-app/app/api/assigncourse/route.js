import Faculty from "/models/user";
import Course from "/models/courses";

export async function POST(req) {
  try {
    const { facultyName, courseName } = await req.json();

    if (!facultyName || !courseName) {
      return new Response(JSON.stringify({ error: "Faculty name and course name are required" }), { status: 400 });
    }

    // Find the faculty by name and role
    const faculty = await Faculty.findOne({ name: facultyName, role: "faculty" });
    if (!faculty) {
      return new Response(JSON.stringify({ error: "Faculty not found" }), { status: 404 });
    }

    // Find the course by name
    const course = await Course.findOne({ name: courseName });
    if (!course) {
      return new Response(JSON.stringify({ error: "Course not found" }), { status: 404 });
    }

    // Check if the course is already assigned
    const alreadyAssigned = faculty.courses.some(c => c.courseId.toString() === course._id.toString());
    if (alreadyAssigned) {
      return new Response(JSON.stringify({ message: "Course already assigned to faculty" }), { status: 200 });
    }

    // Assign the course
    faculty.courses.push({ courseId: course._id });
    await faculty.save();

    return new Response(JSON.stringify({ message: "Course assigned to faculty successfully" }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
