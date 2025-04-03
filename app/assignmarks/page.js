 "use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AssignMarks() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [students, setStudents] = useState([]);
  const [marks, setMarks] = useState({});
  const router = useRouter();

  useEffect(() => {
    fetch("/api/courses")
      .then((res) => res.json())
      .then((data) => setCourses(data));
  }, []);

  const handleCourseSelect = async (courseId) => {
    setSelectedCourse(courseId);
    const response = await fetch(`/api/students?courseId=${courseId}`);
    const data = await response.json();
    setStudents(data);
  };

  const handleChange = (studentId, value) => {
    setMarks({ ...marks, [studentId]: value });
  };

  const handleSubmit = async () => {
    const response = await fetch("/api/assignmarks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ courseId: selectedCourse, marks }),
    });

    if (response.ok) {
      alert("Marks Assigned Successfully");
    } else {
      alert("Failed to Assign Marks");
    }
  };

  return (
    <div>
      <h1>Assign Marks</h1>
      <select onChange={(e) => handleCourseSelect(e.target.value)}>
        <option value="">Select a Course</option>
        {courses.map((course) => (
          <option key={course._id} value={course._id}>{course.name}</option>
        ))}
      </select>

      {selectedCourse && (
        <div>
          {students.map((student) => (
            <div key={student._id}>
              <span>{student.name}</span>
              <input
                type="number"
                value={marks[student._id] || ""}
                onChange={(e) => handleChange(student._id, e.target.value)}
              />
            </div>
          ))}
          <button onClick={handleSubmit}>Submit Marks</button>
        </div>
      )}
    </div>
  );
}

