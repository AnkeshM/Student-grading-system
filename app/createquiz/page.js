"use client";

import { useState } from "react";

export default function CreateQuiz() {
  const [questions, setQuestions] = useState([]);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { id: Date.now(), text: "", type: "MCQ", marks: "", options: ["", "", "", ""], correctOption: "" },
    ]);
  };

  const updateQuestion = (id, field, value) => {
    setQuestions(
      questions.map((q) => (q.id === id ? { ...q, [field]: value } : q))
    );
  };

  const updateOption = (id, index, value) => {
    setQuestions(
      questions.map((q) =>
        q.id === id
          ? { ...q, options: q.options.map((opt, i) => (i === index ? value : opt)) }
          : q
      )
    );
  };

  const removeQuestion = (id) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  const createQuiz = async () => {
    try {
      const response = await fetch("/api/createquiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "New Quiz", questions }),
      });

      if (response.ok) {
        alert("Quiz Created Successfully!");
        setQuestions([]);
      } else {
        alert("Failed to create quiz");
      }
    } catch (error) {
      console.error("Error creating quiz:", error);
      alert("An error occurred");
    }
  };

  return (
    <div style={{ padding: "24px", maxWidth: "600px", margin: "auto" }}>
      <h1 style={{ fontSize: "24px", fontWeight: "bold", textAlign: "center", marginBottom: "16px" }}>Create a Quiz</h1>
      <div>
        {questions.map((q, index) => (
          <div key={q.id} style={{ padding: "16px", background: "#f3f3f3", borderRadius: "8px", marginBottom: "12px" }}>
            <input
              type="text"
              placeholder={`Question ${index + 1}`}
              value={q.text}
              onChange={(e) => updateQuestion(q.id, "text", e.target.value)}
              style={{ display: "block", width: "100%", padding: "8px", marginBottom: "8px" }}
            />
            <select
              value={q.type}
              onChange={(e) => updateQuestion(q.id, "type", e.target.value)}
              style={{ display: "block", width: "100%", padding: "8px", marginBottom: "8px" }}
            >
              <option value="MCQ">MCQ</option>
              <option value="Subjective">Subjective</option>
            </select>
            {q.type === "MCQ" && (
              <div>
                {[0, 1, 2, 3].map((optIndex) => (
                  <input
                    key={optIndex}
                    type="text"
                    placeholder={`Option ${optIndex + 1}`}
                    value={q.options[optIndex]}
                    onChange={(e) => updateOption(q.id, optIndex, e.target.value)}
                    style={{ display: "block", width: "100%", padding: "8px", marginBottom: "8px" }}
                  />
                ))}
                <select
                  value={q.correctOption}
                  onChange={(e) => updateQuestion(q.id, "correctOption", e.target.value)}
                  style={{ display: "block", width: "100%", padding: "8px", marginBottom: "8px" }}
                >
                  <option value="">Select Correct Option</option>
                  {q.options.map((opt, idx) => (
                    <option key={idx} value={opt}>{`Option ${idx + 1}`}</option>
                  ))}
                </select>
              </div>
            )}
            <input
              type="number"
              placeholder="Marks"
              value={q.marks}
              onChange={(e) => updateQuestion(q.id, "marks", e.target.value)}
              style={{ display: "block", width: "100%", padding: "8px", marginBottom: "8px" }}
            />
            <button
              style={{ color: "red", cursor: "pointer", background: "none", border: "none" }}
              onClick={() => removeQuestion(q.id)}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: questions.length === 0 ? "center" : "space-between", marginTop: "16px" }}>
        <button
          style={{ background: "#ccc", padding: "10px", borderRadius: "6px", cursor: "pointer" }}
          onClick={addQuestion}
        >
          Add Question
        </button>
        {questions.length > 0 && (
          <button
            style={{ background: "blue", color: "white", padding: "10px", borderRadius: "6px", cursor: "pointer" }}
            onClick={createQuiz}
          >
            Create Quiz
          </button>
        )}
      </div>
    </div>
  );
}
