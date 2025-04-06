"use client";
import { useState } from "react";

export default function AssignCourseForm() {
  const [facultyName, setFacultyName] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAssign = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsSuccess(null);
    setLoading(true);

    try {
      const res = await fetch("/api/assigncourse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ facultyName, courseCode }),
      });

      const data = await res.json();

      if (res.ok) {
        setIsSuccess(true);
        setMessage(data.message);
        setFacultyName("");
        setCourseCode(""); 
      } else {
        setIsSuccess(false);
        setMessage(data.error || "Failed to assign course");
      }
    } catch (err) {
      setIsSuccess(false);
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-400 to-purple-500 p-4">
      <div className="max-w-md w-full bg-white shadow-xl rounded-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Assign Course to Faculty
        </h2>
        <form onSubmit={handleAssign} className="space-y-6">
          {/* Faculty Name */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Faculty Name</label>
            <input
              type="text"
              placeholder="Enter Faculty Name"
              value={facultyName}
              onChange={(e) => setFacultyName(e.target.value)}
              required
              className="w-full p-3 border rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          {/* Course Code */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Course Code</label>
            <input
              type="text"
              placeholder="Enter Course Code"
              value={courseCode}
              onChange={(e) => setCourseCode(e.target.value)}
              required
              className="w-full p-3 border rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-500 text-white p-3 rounded-lg font-semibold hover:bg-indigo-600 transition duration-300"
          >
            {loading ? "Assigning..." : "Assign Course"}
          </button>
        </form>

        {/* Message */}
        {message && (
          <p
            className={`mt-6 text-center text-sm font-medium ${
              isSuccess ? "text-green-600" : "text-red-500"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
