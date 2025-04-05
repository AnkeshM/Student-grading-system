"use client";
import { useRouter } from "next/navigation";

export default function StudentDashboard() {
  const router = useRouter();

  const handleNavigation = (path) => {
    router.push(path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-400 to-purple-500 flex flex-col">
      {/* Navbar */}
      <nav className="bg-white shadow-md py-4 px-8 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Student Dashboard</h1>
        <button 
          className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition duration-300"
          onClick={() => handleNavigation("/logout")}
        >
          Logout
        </button>
      </nav>
      
      {/* Hero Section */}
      <header className="text-center text-white py-12">
        <h2 className="text-4xl font-bold mb-4">Welcome, Student</h2>
        <p className="text-lg">Access your grades, performance, and course materials easily.</p>
      </header>
      
      {/* Main Content */}
      <div className="flex justify-center items-center flex-wrap gap-6 p-8">
        {/* Function Cards */}
        <div 
          className="w-72 h-40 bg-white shadow-lg rounded-lg p-6 text-center cursor-pointer flex flex-col justify-center hover:scale-105 transition duration-300"
          onClick={() => handleNavigation("/result")}
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-2">📄 View Grade Sheet</h3>
          <p className="text-gray-600">Check your marks and academic performance.</p>
        </div>
        
        <div 
          className="w-72 h-40 bg-white shadow-lg rounded-lg p-6 text-center cursor-pointer flex flex-col justify-center hover:scale-105 transition duration-300"
          onClick={() => handleNavigation("/performance")}
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-2">📊 View Performance Graph</h3>
          <p className="text-gray-600">Analyze your academic progress over time.</p>
        </div>
        
        <div 
          className="w-72 h-40 bg-white shadow-lg rounded-lg p-6 text-center cursor-pointer flex flex-col justify-center hover:scale-105 transition duration-300"
          onClick={() => handleNavigation("/quizzes")}
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-2">📝 Attempt Quizzes</h3>
          <p className="text-gray-600">Participate in quizzes and test your knowledge.</p>
        </div>
        
        <div 
          className="w-72 h-40 bg-white shadow-lg rounded-lg p-6 text-center cursor-pointer flex flex-col justify-center hover:scale-105 transition duration-300"
          onClick={() => handleNavigation("/course-contents")}
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-2">📚 View Course Contents</h3>
          <p className="text-gray-600">Access study materials and course resources.</p>
        </div>
      </div>
    </div>
  );
}