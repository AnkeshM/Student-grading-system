"use client";

import { useState } from "react";

export default function SelectCourse() {
  const courses = [
    "Mathematics", "Physics", "Computer Science", "Chemistry", "Biology"
  ];

  const [selectedCourse, setSelectedCourse] = useState(null);

  return (
    <div style={{ padding: "24px", maxWidth: "800px", margin: "auto" }}>
      <h1 style={{ fontSize: "24px", fontWeight: "bold", textAlign: "center", marginBottom: "16px" }}>Select a Course</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
        {courses.map((course) => (
          <div
            key={course}
            onClick={() => setSelectedCourse(course)}
            style={{
              padding: "16px",
              background: "#f3f3f3",
              borderRadius: "8px",
              textAlign: "center",
              cursor: "pointer",
              fontWeight: "bold",
              transition: "0.3s",
              border: selectedCourse === course ? "2px solid blue" : "none"
            }}
          >
            {course}
          </div>
        ))}
      </div>
      {selectedCourse && (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <button
            style={{
              background: "blue",
              color: "white",
              padding: "10px 20px",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "16px",
            }}
            onClick={() => alert(`Creating quiz for ${selectedCourse}`)}
          >
            Proceed to Create Quiz
          </button>
        </div>
      )}
    </div>
  );
}
