"use client";
import { useRouter } from "next/navigation";

export default function FacultyDashboard() {
  const router = useRouter();

  const handleNavigation = (path) => {
    router.push(path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-400 to-purple-500 flex flex-col">
      {/* Navbar */}
      <nav className="bg-white shadow-md py-4 px-8 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Faculty Dashboard</h1>
        <button 
          className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition duration-300"
          onClick={() => handleNavigation("/logout")}
        >
          Logout
        </button>
      </nav>
      
      {/* Hero Section */}
      <header className="text-center text-white py-12">
        <h2 className="text-4xl font-bold mb-4">Welcome, Faculty Member</h2>
        <p className="text-lg">Manage grades, quizzes, and student performance effortlessly.</p>
      </header>
      
      {/* Main Content */}
      <div className="flex justify-center items-center flex-wrap gap-6 p-8">
        {/* Function Cards */}
        <div 
          className="w-72 h-40 bg-white shadow-lg rounded-lg p-6 text-center cursor-pointer hover:scale-105 transition duration-300"
          onClick={() => handleNavigation("/assignmarks")}
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-2">📄 Assign Marks</h3>
          <p className="text-gray-600">Grade student submissions with ease.</p>
        </div>
        
        <div 
          className="w-72 h-40 bg-white shadow-lg rounded-lg p-6 text-center cursor-pointer hover:scale-105 transition duration-300"
          onClick={() => handleNavigation("/createquiz")}
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-2">📝 Create Quiz</h3>
          <p className="text-gray-600">Design and manage quizzes for students.</p>
        </div>
      </div>
    </div>
  );
}