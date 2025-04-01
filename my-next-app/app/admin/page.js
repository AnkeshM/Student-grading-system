"use client";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();

  const handleNavigation = (path) => {
    router.push(path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-400 to-purple-500 flex flex-col">
      {/* Navbar */}
      <nav className="bg-white shadow-md py-4 px-8 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        <button 
          className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition duration-300"
          onClick={() => handleNavigation("/logout")}
        >
          Logout
        </button>
      </nav>
      
      {/* Hero Section */}
      <header className="text-center text-white py-12">
        <h2 className="text-4xl font-bold mb-4">Welcome, Admin</h2>
        <p className="text-lg">Manage users, courses, and student data efficiently.</p>
      </header>
      
      {/* Main Content */}
      <div className="flex justify-center items-center flex-wrap gap-6 p-8">
        {/* Function Cards */}
        <div 
          className="w-72 h-40 bg-white shadow-lg rounded-lg p-6 text-center cursor-pointer flex flex-col justify-center hover:scale-105 transition duration-300"
          onClick={() => handleNavigation("/adduser")}
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-2">➕ Add User</h3>
          <p className="text-gray-600">Add new students or faculty to the system.</p>
        </div>
        
        <div 
          className="w-72 h-40 bg-white shadow-lg rounded-lg p-6 text-center cursor-pointer flex flex-col justify-center hover:scale-105 transition duration-300"
          onClick={() => handleNavigation("updatesemester")}
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-2">🔄 Update Student Semester</h3>
          <p className="text-gray-600">Update the semester for any student.</p>
        </div>
        
        <div 
          className="w-72 h-40 bg-white shadow-lg rounded-lg p-6 text-center cursor-pointer flex flex-col justify-center hover:scale-105 transition duration-300"
          onClick={() => handleNavigation("/addcourse")}
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-2">📚 Add Courses to Semester</h3>
          <p className="text-gray-600">Assign courses to specific semesters.</p>
        </div>
        
        <div 
          className="w-72 h-40 bg-white shadow-lg rounded-lg p-6 text-center cursor-pointer flex flex-col justify-center hover:scale-105 transition duration-300"
          onClick={() => handleNavigation("/deleteuser")}
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-2">🗑️ Delete User</h3>
          <p className="text-gray-600">Remove a student or faculty member from the system.</p>
        </div>
      </div>
    </div>
  );
}
