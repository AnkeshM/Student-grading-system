// "use client";
// import { useState } from "react";
// import { useRouter } from "next/navigation";

// export default function AddCourse() {
//   const router = useRouter();
//   const [courseData, setCourseData] = useState({
//     courseName: "",
//     courseCode: "",
//     faculty: "",
//     credits: "",
//   });
  
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setCourseData({
//       ...courseData,
//       [name]: name === "credits" ? (value ? Number(value) : undefined) : value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const formattedData = {
//       name: courseData.courseName,
//       code: courseData.courseCode,
//       faculty: courseData.faculty.trim() === "" ? null : courseData.faculty,
//       credits: courseData.credits ? Number(courseData.credits) : undefined,
//     };

//     console.log("Sending data:", formattedData);
    
//     try {
//       const response = await fetch("/api/addcourse", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formattedData),
//       });
      
//       if (response.ok) {
//         alert("Course added successfully!");
//       } else {
//         alert("Failed to add course.");
//       }
//     } catch (error) {
//       console.error("Error adding course:", error);
//       alert("Error adding course.");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-r from-blue-400 to-purple-500 flex flex-col items-center p-8">
//       {/* Navbar */}
//       <nav className="bg-white shadow-md py-4 px-8 w-full flex justify-between items-center">
//         <h1 className="text-2xl font-bold text-gray-800">Add Course</h1>
//         <button 
//           className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition duration-300"
//           onClick={() => router.push("/admin")}
//         >
//           Back to Dashboard
//         </button>
//       </nav>

//       {/* Form Container */}
//       <div className="bg-white p-8 rounded-lg shadow-lg mt-10 w-96">
//         <h2 className="text-xl font-semibold text-gray-800 mb-4">Enter Course Details</h2>
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <input
//             type="text"
//             name="courseName"
//             placeholder="Course Name"
//             value={courseData.courseName}
//             onChange={handleChange}
//             className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
//             required
//           />
//           <input
//             type="text"
//             name="courseCode"
//             placeholder="Course Code"
//             value={courseData.courseCode}
//             onChange={handleChange}
//             className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
//             required
//           />
//           <input
//             type="text"
//             name="faculty"
//             placeholder="Faculty Assigned (Optional)"
//             value={courseData.faculty}
//             onChange={handleChange}
//             className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
//           />
//           <input
//             type="number"
//             name="credits"
//             placeholder="Credits"
//             value={courseData.credits}
//             onChange={handleChange}
//             className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
//             required
//           />
//           <button
//             type="submit"
//             className="w-full bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600 transition duration-300"
//           >
//             Add Course
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddCourse() {
  const router = useRouter();
  const [courseData, setCourseData] = useState({
    courseName: "",
    courseCode: "",
    faculty: "",
    credits: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourseData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formattedData = {
      name: courseData.courseName.trim(),
      code: courseData.courseCode.trim(),
      faculty: courseData.faculty.trim() === "" ? null : courseData.faculty.trim(),
      credits: courseData.credits !== "" ? Number(courseData.credits) : undefined,
    };

    console.log("Sending data:", formattedData);

    try {
      const response = await fetch("/api/addcourse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedData),
      });

      if (response.ok) {
        alert("Course added successfully!");
      } else {
        alert("Failed to add course.");
      }
    } catch (error) {
      console.error("Error adding course:", error);
      alert("Error adding course.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-400 to-purple-500 flex flex-col items-center p-8">
      {/* Navbar */}
      <nav className="bg-white shadow-md py-4 px-8 w-full flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Add Course</h1>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition duration-300"
          onClick={() => router.push("/admin")}
        >
          Back to Dashboard
        </button>
      </nav>

      {/* Form Container */}
      <div className="bg-white p-8 rounded-lg shadow-lg mt-10 w-96">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Enter Course Details</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="courseName"
            placeholder="Course Name"
            value={courseData.courseName}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <input
            type="text"
            name="courseCode"
            placeholder="Course Code"
            value={courseData.courseCode}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <input
            type="text"
            name="faculty"
            placeholder="Faculty Assigned (Optional)"
            value={courseData.faculty}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="number"
            name="credits"
            placeholder="Credits"
            value={courseData.credits}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600 transition duration-300"
          >
            Add Course
          </button>
        </form>
      </div>
    </div>
  );
}
