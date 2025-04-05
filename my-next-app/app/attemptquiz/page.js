"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams } from "next/navigation";

export default function AttemptQuizPage() {
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [alreadyAttempted, setAlreadyAttempted] = useState(false);

  const searchParams = useSearchParams();
  const quizId = searchParams.get("id");

  useEffect(() => {
    const fetchQuiz = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || user.role !== "student") return;

      const studentId = user.userId;

      try {
        const attemptCheck = await axios.get(
          `/api/attemptquiz?studentId=${studentId}&quizId=${quizId}`
        );

        if (attemptCheck.data.alreadyAttempted) {
          setAlreadyAttempted(true);
          return;
        }

        const quizRes = await axios.get(`/api/quizzes?quizId=${quizId}`);
        setSelectedQuiz(quizRes.data);
      } catch (err) {
        console.error("Failed to fetch quiz or check attempt:", err);
      }
    };

    if (quizId) fetchQuiz();
  }, [quizId]);

  const handleOptionChange = (qIndex, optIndex) => {
    setAnswers((prev) => ({
      ...prev,
      [qIndex]: optIndex,
    }));
  };

  const handleSubmit = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const studentId = user?.userId;

    const formattedAnswers = selectedQuiz.questions.map((q, idx) => ({
      questionIndex: idx,
      selectedOptionIndex: answers[idx],
    }));

    try {
      await axios.post("/api/attemptquiz", {
        quizId: selectedQuiz._id,
        studentId,
        answers: formattedAnswers,
      });

      let calculatedScore = 0;
      selectedQuiz.questions.forEach((q, idx) => {
        if (q.correctAnswerIndex === answers[idx]) {
          calculatedScore += q.marks || 1;
        }
      });

      setScore(calculatedScore);
      alert("Quiz submitted successfully.");
    } catch (err) {
      alert(err.response?.data?.error || "Submission failed");
    }
  };

  if (alreadyAttempted) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center p-6">
        <div className="bg-white shadow-xl rounded-2xl p-8 max-w-xl w-full text-center">
          <h1 className="text-2xl font-semibold text-red-600">
            You have already attempted this quiz.
          </h1>
        </div>
      </div>
    );
  }

  if (!selectedQuiz) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center p-6 text-white">
        Loading quiz...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-400 to-purple-500 py-10 px-6">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">{selectedQuiz.title}</h1>
        <p className="text-gray-600 mb-6 text-center">{selectedQuiz.description}</p>

        <form className="space-y-6">
          {selectedQuiz.questions.map((q, idx) => (
            <div key={idx} className="border-b pb-4">
              <p className="font-medium text-gray-800 mb-2">
                {idx + 1}. {q.questionText}
              </p>
              {q.options.map((opt, optIdx) => (
                <label key={optIdx} className="block text-gray-700 mb-1">
                  <input
                    type="radio"
                    name={`question-${idx}`}
                    value={optIdx}
                    checked={answers[idx] === optIdx}
                    onChange={() => handleOptionChange(idx, optIdx)}
                    className="mr-2"
                  />
                  {opt.text}
                </label>
              ))}
            </div>
          ))}

          <div className="text-center pt-4">
            <button
              type="button"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
              onClick={handleSubmit}
            >
              Submit Quiz
            </button>
          </div>

          {score !== null && (
            <p className="mt-6 text-center text-xl font-semibold text-green-700">
              Your Score: {score}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
