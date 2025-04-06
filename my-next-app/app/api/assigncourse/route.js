import Faculty from "/models/user";
import Course from "/models/courses";

export async function POST(req) {
  try {
    const { facultyName, courseCode } = await req.json();

    if (!facultyName || !courseCode) {
      return new Response(JSON.stringify({ error: "Faculty name and course code are required" }), { status: 400 });
    }

    // Find the faculty by name and role
    const faculty = await Faculty.findOne({ name: facultyName, role: "faculty" });
    if (!faculty) {
      return new Response(JSON.stringify({ error: "Faculty not found" }), { status: 404 });
    }

    // Find the course by course code
    const course = await Course.findOne({ code: courseCode });
    if (!course) {
      return new Response(JSON.stringify({ error: "Course not found" }), { status: 404 });
    }

    // Check if the same course is already assigned
    const alreadyAssigned = faculty.courses.length === 1 &&
      faculty.courses[0].courseId.toString() === course._id.toString();

    if (alreadyAssigned) {
      return new Response(JSON.stringify({ message: "Course already assigned to faculty" }), { status: 200 });
    }

    // Replace any existing course with the new one
    faculty.courses = [{ courseId: course._id }];
    await faculty.save();

    return new Response(JSON.stringify({ message: "Course assigned to faculty successfully" }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
