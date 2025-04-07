"use client";
import { useState } from "react";

export default function UpdateSemesterForm() {
  const [email, setEmail] = useState("");
  const [semester, setSemester] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch("/api/updatesem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, semesterName: semester })
      });

      const data = await res.json();
      setMessage(data.message || data.error);

      if (res.ok) {
        setEmail("");
        setSemester("");
      }
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-400 to-blue-500 p-4">
      <div className="max-w-md w-full bg-white shadow-xl rounded-lg p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Update Student Semester</h2>
        <form onSubmit={handleUpdate} className="space-y-6">
          {/* Email */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Student Email</label>
            <input
              type="email"
              placeholder="Enter student email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 border rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

          {/* Semester Selection */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Semester</label>
            <select
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              required
              className="w-full p-3 border rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-purple-400"
            >
              <option value="" disabled>Select Semester</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                <option key={num} value={`Semester ${num}`}>{`Semester ${num}`}</option>
              ))}
            </select>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 text-white p-3 rounded-lg font-semibold hover:bg-purple-700 transition duration-300"
          >
            {loading ? "Updating..." : "Add Semester"}
          </button>
        </form>

        {message && (
          <p className="mt-6 text-center text-red-500 font-medium">{message}</p>
        )}
      </div>
    </div>
  );
}
