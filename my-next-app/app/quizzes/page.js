"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function QuizzesPage() {
  const [quizzesByCourse, setQuizzesByCourse] = useState({});
  const router = useRouter();

  useEffect(() => {
    const fetchQuizzes = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || user.role !== "student") return;

      try {
        const res = await axios.get(`/api/quizzes?studentId=${user.userId}`);
        const grouped = {};
        res.data.forEach((quiz) => {
          const courseName = quiz.courseId?.name || "Unknown Course";
          if (!grouped[courseName]) grouped[courseName] = [];
          grouped[courseName].push(quiz);
        });

        setQuizzesByCourse(grouped);
      } catch (err) {
        console.error("Failed to fetch quizzes:", err);
      }
    };

    fetchQuizzes();
  }, []);

  const handleQuizClick = (quizId) => {
    router.push(`/attemptquiz?id=${quizId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-400 to-purple-500 py-10 px-6">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          📚 Available Quizzes
        </h1>

        {Object.keys(quizzesByCourse).length === 0 ? (
          <p className="text-gray-600 text-center">No quizzes found.</p>
        ) : (
          Object.entries(quizzesByCourse).map(([courseName, quizzes]) => (
            <div key={courseName} className="mb-8">
              <h2 className="text-2xl font-semibold text-blue-700 mb-4 border-b pb-1">
                📘 {courseName}
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {quizzes.map((quiz) => (
                  <div
                    key={quiz._id}
                    className="bg-blue-50 border border-blue-200 shadow-md rounded-xl p-5 hover:shadow-xl cursor-pointer transition duration-300"
                    onClick={() => handleQuizClick(quiz._id)}
                  >
                    <h3 className="text-lg font-bold text-blue-900 mb-1">
                      {quiz.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Click to start this quiz
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
