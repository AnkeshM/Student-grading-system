"use client";

import { useEffect, useState } from "react";

export default function StudentGrades() {
  const [gradesData, setGrades] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    const email = userData?.email;

    if (!email) {
      setMessage("Student not logged in.");
      return;
    }

    const fetchGrades = async () => {
      try {
        const res = await fetch("/api/result", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });

        const data = await res.json();
        if (res.ok) {
          setGrades(data.academicRecords);
          setMessage("");
        } else {
          setMessage(data.error || "Failed to load grades.");
        }
      } catch (error) {
        setMessage("Something went wrong.");
        console.error(error);
      }
    };

    fetchGrades();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-400 to-purple-500 py-10 px-6">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">My Grades</h1>
        {message && <p className="text-red-500 text-center">{message}</p>}

        {gradesData.length > 0 ? (
          gradesData.map((record, index) => (
            <div key={index} className="mb-8">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">{record.semesterName}</h2>
              <table className="w-full text-left border border-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-3 border-b border-gray-200">Course</th>
                    <th className="p-3 border-b border-gray-200">Marks</th>
                    <th className="p-3 border-b border-gray-200">Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {record.courses.map((course, idx) => (
                    <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="p-3">{course.courseName}</td>
                      <td className="p-3">{course.marks}</td>
                      <td className="p-3">{course.grade || "N/A"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-4 flex justify-between text-sm text-gray-700">
                <p>
                  <strong>SPI:</strong> {record.SPI?.toFixed(2)}
                </p>
                <p>
                  <strong>CPI:</strong> {record.CPI?.toFixed(2)}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-700 mt-6">No academic records found.</p>
        )}
      </div>
    </div>
  );
}
