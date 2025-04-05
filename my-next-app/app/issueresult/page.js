"use client";

import { useEffect, useState } from "react";

export default function IssueResultsPage() {
  const [semesters, setSemesters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const fetchSemesters = async () => {
      try {
        const res = await fetch("/api/student_sem");
        const data = await res.json();
        setSemesters(data.semesters || []);
      } catch (err) {
        console.error("Failed to fetch semesters", err);
      }
    };

    fetchSemesters();
  }, []);

  const issueResult = async (semesterId) => {
    setLoading(true);
    setStatus(null);
    try {
      const res = await fetch("/api/spi_cpi", {
        method: "POST",
        body: JSON.stringify({ semesterId }),
      });

      const result = await res.json();
      if (res.ok) {
        setStatus({ type: "success", message: result.message });
      } else {
        setStatus({ type: "error", message: result.error });
      }
    } catch (err) {
      setStatus({ type: "error", message: "Something went wrong" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Issue Results</h1>

      {status && (
        <div
          className={`mb-4 p-3 rounded ${
            status.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {status.message}
        </div>
      )}

      <ul className="space-y-4">
        {semesters.map((semester) => (
          <li
            key={semester._id}
            className="flex items-center justify-between p-4 border rounded shadow-sm"
          >
            <span className="text-lg">{semester.name}</span>
            <button
              onClick={() => issueResult(semester._id)}
              disabled={loading}
              className={`px-4 py-2 rounded text-white font-semibold ${
                loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? "Processing..." : "Issue Result"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
