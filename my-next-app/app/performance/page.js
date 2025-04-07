"use client";
import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

export default function StudentPerformanceChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchPerformance = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user?.email) {
        console.error("User not found in localStorage");
        return;
      }

      try {
        const res = await fetch(`/api/performance?email=${user.email}`);
        const json = await res.json();
        console.log("Fetched performance data:", json);

        if (json.academicRecords) {
          setData(json.academicRecords);
        }
      } catch (err) {
        console.error("Failed to load performance data", err);
      }
    };

    fetchPerformance();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-400 to-blue-500 p-4">
      <div className="max-w-4xl w-full bg-white shadow-xl rounded-lg p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Academic Performance
        </h2>
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="semesterName" />
              <YAxis domain={[0, 10]} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="SPI"
                stroke="#10B981" // Tailwind green-500
                strokeWidth={2}
                dot={{ r: 5 }}
                activeDot={{ r: 7 }}
              />
              <Line
                type="monotone"
                dataKey="CPI"
                stroke="#3B82F6" // Tailwind blue-500
                strokeWidth={2}
                dot={{ r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-center text-gray-600">No academic data found.</p>
        )}
      </div>
    </div>
  );
}
