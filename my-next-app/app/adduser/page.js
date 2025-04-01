"use client"
import { useState } from "react";

export default function AdminPanel() {
  const [role, setRole] = useState("student");
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [batch, setBatch] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleAddUser = async (e) => {
    e.preventDefault();

    // Set semester to 1 automatically for students
    const userSemester = role === "student" ? 1 : ""; // Only set for student role

    const res = await fetch("/api/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role, name, gender, batch, semester: userSemester, email, password }),
    });

    const data = await res.json();
    setMessage(data.message || data.error);

    if (res.ok) {
      setRole("");
      setName("");
      setGender("");
      setBatch("");
      setEmail("");
      setPassword("");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-400 to-blue-500 p-4">
      <div className="max-w-md w-full bg-white shadow-xl rounded-lg p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Admin Panel</h2>
        <form onSubmit={handleAddUser} className="space-y-6">
          {/* Role */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full p-3 border rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              <option value="student">Student</option>
              <option value="faculty">Faculty</option>
            </select>
          </div>

          {/* Name */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Name</label>
            <input
              type="text"
              placeholder="Enter Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full p-3 border rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Gender</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full p-3 border rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          {/* Batch */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Batch</label>
            <select
              value={batch}
              onChange={(e) => setBatch(e.target.value)}
              className="w-full p-3 border rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              <option value="2020">2020</option>
              <option value="2021">2021</option>
              <option value="2022">2022</option>
              <option value="2023">2023</option>
              <option value="2024">2024</option>
            </select>
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Email</label>
            <input
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 border rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Password</label>
            <input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 border rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-green-500 text-white p-3 rounded-lg font-semibold hover:bg-green-600 transition duration-300"
          >
            Add User
          </button>
        </form>

        {message && (
          <p className="mt-6 text-center text-red-500 font-medium">{message}</p>
        )}
      </div>
    </div>
  );
}
