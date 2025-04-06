"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function CreateQuizPage() {
  const [title, setTitle] = useState("");
  const [courseId, setCourseId] = useState("");
  const [courseName, setCourseName] = useState("");
  const [questions, setQuestions] = useState([]);
  const [message, setMessage] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);

  const [newQuestion, setNewQuestion] = useState({
    questionText: "",
    questionType: "MCQ",
    options: ["", "", "", ""],
    correctAnswerIndex: 0,
    marks: 1,
  });

  useEffect(() => {
    const fetchCourses = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || user.role !== "faculty") return;

      const facultyId = user.userId;
      try {
        const res = await axios.get(`/api/fetchcourses?facultyId=${facultyId}`);
        if (res.data.length > 0) {
          setCourseId(res.data[0]._id);
          setCourseName(res.data[0].name);
        }
      } catch (err) {
        console.error("Error fetching courses:", err);
      }
    };

    fetchCourses();
  }, []);

  const resetQuestionForm = () => {
    setNewQuestion({
      questionText: "",
      questionType: "MCQ",
      options: ["", "", "", ""],
      correctAnswerIndex: 0,
      marks: 1,
    });
    setEditingIndex(null);
  };

  const handleAddOrUpdateQuestion = () => {
    const { questionText, questionType, options, correctAnswerIndex, marks } = newQuestion;

    if (!questionText.trim()) {
      setMessage("Question text is required.");
      return;
    }

    if (options.some((opt) => !opt.trim())) {
      setMessage("All options must be filled.");
      return;
    }

    if (
      isNaN(correctAnswerIndex) ||
      correctAnswerIndex < 0 ||
      correctAnswerIndex >= options.length
    ) {
      setMessage("Correct answer index is invalid.");
      return;
    }

    if (isNaN(marks) || marks <= 0) {
      setMessage("Please assign valid marks greater than 0.");
      return;
    }

    if (editingIndex !== null) {
      const updatedQuestions = [...questions];
      updatedQuestions[editingIndex] = newQuestion;
      setQuestions(updatedQuestions);
      setMessage("Question updated.");
    } else {
      setQuestions([...questions, newQuestion]);
      setMessage("Question added.");
    }

    resetQuestionForm();
  };

  const handleEdit = (index) => {
    setNewQuestion(questions[index]);
    setEditingIndex(index);
    setMessage("");
  };

  const handleSubmitQuiz = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const facultyId = user?.userId;
    if (!user || user.role !== "faculty") {
      alert("Unauthorized");
      return;
    }

    if (!title || !courseId || questions.length === 0) {
      setMessage("Please fill all fields and add at least one question.");
      return;
    }

    try {
      const res = await axios.post("/api/createquiz", {
        title,
        courseId,
        createdBy: facultyId,
        questions,
      });

      if (res.status === 201) {
        setMessage("Quiz created successfully!");
        setTitle("");
        setQuestions([]);
        resetQuestionForm();
      }
    } catch (err) {
      console.error("Error submitting quiz:", err);
      setMessage("Failed to create quiz");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-400 to-purple-500 py-10 px-6">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">Create a New Quiz</h1>

        {courseName && (
          <p className="mb-6 text-lg font-medium text-center text-blue-600">
            📘 Course: <span className="font-semibold">{courseName}</span>
          </p>
        )}

        <input
          className="border p-3 w-full mb-6 rounded-lg"
          type="text"
          placeholder="Quiz Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <div className="border p-6 mb-6 rounded-xl bg-gray-50 shadow-sm">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            {editingIndex !== null ? "✏️ Edit Question" : "➕ New Question"}
          </h2>

          <input
            className="border p-3 w-full mb-3 rounded-md"
            type="text"
            placeholder="Question Text"
            value={newQuestion.questionText}
            onChange={(e) =>
              setNewQuestion({ ...newQuestion, questionText: e.target.value })
            }
          />

          <select
            className="border p-3 w-full mb-3 rounded-md"
            value={newQuestion.questionType}
            onChange={(e) =>
              setNewQuestion({ ...newQuestion, questionType: e.target.value })
            }
          >
            <option value="MCQ">MCQ</option>
            <option value="True/False">True/False</option>
          </select>

          {newQuestion.options.map((opt, idx) => (
            <input
              key={idx}
              className="border p-3 w-full mb-2 rounded-md"
              type="text"
              placeholder={`Option ${idx + 1}`}
              value={opt}
              onChange={(e) => {
                const updatedOptions = [...newQuestion.options];
                updatedOptions[idx] = e.target.value;
                setNewQuestion({ ...newQuestion, options: updatedOptions });
              }}
            />
          ))}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block font-medium mb-1">Correct Option (1 to {newQuestion.options.length})</label>
              <input
                className="border p-3 rounded-md w-full"
                type="number"
                min={1}
                max={newQuestion.options.length}
                value={
                  newQuestion.correctAnswerIndex >= 0
                    ? newQuestion.correctAnswerIndex + 1
                    : ""
                }
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  setNewQuestion({
                    ...newQuestion,
                    correctAnswerIndex: isNaN(value) ? -1 : value - 1,
                  });
                }}
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Marks</label>
              <input
                className="border p-3 rounded-md w-full"
                type="number"
                placeholder="Marks"
                value={newQuestion.marks || ""}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  setNewQuestion({
                    ...newQuestion,
                    marks: isNaN(value) ? 0 : value,
                  });
                }}
              />
            </div>
          </div>

          <button
            className={`mt-6 ${editingIndex !== null ? "bg-yellow-500 hover:bg-yellow-600" : "bg-green-600 hover:bg-green-700"
              } text-white px-6 py-2 rounded-lg transition`}
            onClick={handleAddOrUpdateQuestion}
          >
            {editingIndex !== null ? "💾 Save Changes" : "➕ Add Question"}
          </button>
        </div>

        <div className="text-center">
          <button
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            onClick={handleSubmitQuiz}
          >
            Create Quiz
          </button>
        </div>

        {message && (
          <p
            className={`mt-4 text-center text-lg font-medium ${message.startsWith("✅") ? "text-green-700" : "text-red-600"
              }`}
          >
            {message}
          </p>
        )}

        {questions.length > 0 && (
          <div className="mt-8">
            <h3 className="text-xl font-bold mb-3 text-gray-800">📝 Questions Preview</h3>
            <ul className="space-y-3">
              {questions.map((q, i) => (
                <li
                  key={i}
                  className="bg-white border p-4 rounded-md shadow-sm flex justify-between items-start"
                >
                  <div>
                    <p className="font-semibold">{i + 1}. {q.questionText}</p>
                    <p className="text-sm text-gray-600">Type: {q.questionType} | Marks: {q.marks} | Correct Option: {q.correctAnswerIndex + 1}</p>
                  </div>
                  <button
                    className="ml-4 bg-yellow-400 hover:bg-yellow-500 text-sm text-white px-4 py-1 rounded"
                    onClick={() => handleEdit(i)}
                  >
                    ✏️ Edit
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
