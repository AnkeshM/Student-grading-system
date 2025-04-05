"use client";
import { useEffect, useState } from "react";

export default function CustomGrading() {
  const [gradeScale, setGradeScale] = useState([
    { grade: "AA", minMarks: 85 },
    { grade: "AB", minMarks: 75 },
    { grade: "BB", minMarks: 65 },
    { grade: "BC", minMarks: 55 },
    { grade: "CC", minMarks: 45 },
    { grade: "CD", minMarks: 35 },
    { grade: "DD", minMarks: 25 },
    { grade: "F", minMarks: 0 },
  ]);

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [course, setCourse] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      const userData = JSON.parse(localStorage.getItem("user"));
      if (!userData || userData.role !== "faculty") {
        setMessage("Unauthorized. Please login as a faculty member.");
        return;
      }

      try {
        const res = await fetch(`/api/fetchcourses?facultyId=${userData.userId}`);
        const data = await res.json();

        if (Array.isArray(data) && data.length > 0) {
          setCourse(data[0]); // only one course is assigned
        } else {
          setMessage("No courses found for this faculty.");
        }
      } catch (error) {
        setMessage("Failed to load course.");
      }
    };

    fetchCourse();
  }, []);

  const handleChange = (index, field, value) => {
    const updated = [...gradeScale];
    updated[index][field] = field === "minMarks" ? Number(value) : value;
    setGradeScale(updated);
  };

  const handleSubmit = async () => {
    setMessage("");
    setLoading(true);

    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      if (!userData || userData.role !== "faculty" || !course) {
        setMessage("Unauthorized or course not loaded.");
        return;
      }

      const res = await fetch("/api/customgrades", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          facultyId: userData.userId,
          gradeScale,
          courseId: course._id,
        }),
      });

      const data = await res.json();
      setMessage(data.message || data.error);
    } catch (err) {
      setMessage("An error occurred while assigning grades.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-400 to-purple-500 py-10 px-6">
      <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Custom Grade Assignment</h1>

        {course && (
          <h2 className="text-xl font-semibold text-gray-600 mb-4 text-center">
            For {course.name} ({course.code})
          </h2>
        )}

        {gradeScale.map((item, index) => (
          <div key={index} className="flex items-center justify-between mb-3">
            <input
              type="text"
              className="border px-3 py-2 rounded-lg w-24 text-center"
              value={item.grade}
              onChange={(e) => handleChange(index, "grade", e.target.value)}
            />
            <span className="text-gray-600 font-medium">≥</span>
            <input
              type="number"
              className="border px-3 py-2 rounded-lg w-24 text-center"
              value={item.minMarks}
              onChange={(e) => handleChange(index, "minMarks", e.target.value)}
            />
          </div>
        ))}

        <div className="text-center pt-6">
          <button
            onClick={handleSubmit}
            className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition duration-300"
            disabled={loading || !course}
          >
            {loading ? "Assigning..." : "Assign Grades"}
          </button>
        </div>

        {message && (
          <p
            className={`mt-4 text-center ${
              message.toLowerCase().includes("fail") || message.toLowerCase().includes("error")
                ? "text-red-500"
                : "text-green-600"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
