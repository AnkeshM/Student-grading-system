"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AssignMarks() {
  const router = useRouter();
  const [course, setCourse] = useState(null);
  const [students, setStudents] = useState([]);
  const [marks, setMarks] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [semesterId, setSemesterId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const userData = JSON.parse(localStorage.getItem("user"));
        if (!userData || !userData.userId || userData.role !== "faculty") {
          throw new Error("Unauthorized access. Please log in as a faculty member.");
        }

        const facultyId = userData.userId;
        const courseRes = await fetch(`/api/fetchcourses?facultyId=${facultyId}`);
        if (!courseRes.ok) throw new Error("Failed to fetch assigned courses.");

        const courseData = await courseRes.json();
        if (!courseData || courseData.length === 0) throw new Error("No courses assigned to this faculty.");

        const selectedCourse = {
          _id: courseData[0]._id || courseData[0].courseId,
          name: courseData[0].name,
          code: courseData[0].code,
        };
        setCourse(selectedCourse);

        const semesterRes = await fetch(`/api/fetchsemester?courseId=${selectedCourse._id}`);
        if (!semesterRes.ok) throw new Error("Failed to fetch semester data.");

        const semesterData = await semesterRes.json();
        const semester = semesterData.semester;
        if (!semester || !semester._id) throw new Error("No semester found for this course.");

        setSemesterId(semester._id);

        const studentsRes = await fetch(`/api/fetchstudents?semester=${semester._id}`);
        if (!studentsRes.ok) throw new Error("Failed to fetch student data.");

        const studentsData = await studentsRes.json();
        setStudents(studentsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (studentId, value) => {
    const numValue = parseInt(value, 10);
    setMarks((prev) => ({
      ...prev,
      [studentId]: isNaN(numValue) || numValue < 0 || numValue > 100 ? "" : numValue,
    }));
  };

  const handleSubmit = async () => {
    try {
      if (!course || !course._id) return alert("Course information is missing.");
      if (Object.keys(marks).length === 0) return alert("Please enter marks for at least one student.");

      const validMarks = Object.fromEntries(
        Object.entries(marks).filter(([_, mark]) => mark !== "")
      );

      if (Object.keys(validMarks).length === 0) return alert("Please enter valid marks.");

      // ✅ Get facultyId from localStorage
      const userData = JSON.parse(localStorage.getItem("user"));
      if (!userData || !userData.userId) return alert("Faculty information is missing.");

      // ✅ Step 1: Assign Marks
      const response = await fetch("/api/assignmarks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId: course._id,
          marks: validMarks,
          facultyId: userData.userId, // ✅ Include manually from localStorage
        }),
      });

      if (response.ok) {
        alert("Marks Assigned Successfully");
        setMarks({});

        // ✅ Step 2: Assign Grades after marks are successfully assigned
        const gradeResponse = await fetch("/api/grades", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            courseId: course._id,
            semesterId: semesterId,
          }),
        });

        if (gradeResponse.ok) {
          alert("Grades Assigned Successfully!");
        } else {
          const gradeError = await gradeResponse.json();
          alert(`Grade Assignment Failed: ${gradeError.error || "Unknown error"}`);
        }

      } else {
        const errorData = await response.json();
        alert(`Failed: ${errorData.error || "Unknown error"}`);
      }
    } catch (err) {
      alert("Error submitting marks: " + err.message);
    }
  };

  if (loading) return <div className="text-center mt-10 text-white">Loading course data...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-400 to-purple-500 py-10 px-6">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Assign Marks</h1>
        <h2 className="text-xl font-semibold text-gray-600 mb-4 text-center">
          {course ? `For ${course.name} (${course.code})` : "Course Information"}
        </h2>

        {students.length > 0 ? (
          <form className="space-y-4">
            {students.map((student) => (
              <div key={student._id} className="flex items-center justify-between border-b pb-2">
                <span className="text-gray-700 font-medium">{student.name}</span>
                <input
                  type="number"
                  min="0"
                  max="100"
                  placeholder="Marks"
                  className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={marks[student._id] || ""}
                  onChange={(e) => handleChange(student._id, e.target.value)}
                />
              </div>
            ))}
            <div className="text-center pt-6">
              <button
                type="button"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
                onClick={handleSubmit}
              >
                Submit Marks
              </button>
            </div>
          </form>
        ) : (
          <p className="text-center text-gray-600">No students registered for this semester.</p>
        )}
      </div>
    </div>
  );
}
