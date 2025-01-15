import React, { useState, useEffect } from "react";
import api from "../services/api";

const CourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [newCourse, setNewCourse] = useState({
    name: "",
    paymentType: "",
    registrationStartDate: "",
    registrationEndDate: "",
    instituteId: "",
    branchId: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await api.get("/courses");
      setCourses(response.data);
    } catch (error) {
      setError("Failed to fetch courses.");
      console.error("Error fetching courses:", error);
    }
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      await api.post("/courses/create", newCourse);
      setNewCourse({
        name: "",
        paymentType: "",
        registrationStartDate: "",
        registrationEndDate: "",
        instituteId: "",
        branchId: "",
      });
      fetchCourses();
    } catch (error) {
      setError("Failed to create course.");
      console.error("Error creating course:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold mb-6">Course Management</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleCreateCourse} className="bg-white p-6 rounded-lg shadow-md mb-6">
        <input
          type="text"
          placeholder="Course Name"
          value={newCourse.name}
          onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
          className="w-full p-2 mb-4 border rounded-lg"
          required
        />
        <select
          value={newCourse.paymentType}
          onChange={(e) => setNewCourse({ ...newCourse, paymentType: e.target.value })}
          className="w-full p-2 mb-4 border rounded-lg"
          required
        >
          <option value="">Select Payment Type</option>
          <option value="free">Free</option>
          <option value="per_session">Per Session</option>
          <option value="full_course">Full Course</option>
        </select>
        <input
          type="date"
          placeholder="Registration Start Date"
          value={newCourse.registrationStartDate}
          onChange={(e) => setNewCourse({ ...newCourse, registrationStartDate: e.target.value })}
          className="w-full p-2 mb-4 border rounded-lg"
          required
        />
        <input
          type="date"
          placeholder="Registration End Date"
          value={newCourse.registrationEndDate}
          onChange={(e) => setNewCourse({ ...newCourse, registrationEndDate: e.target.value })}
          className="w-full p-2 mb-4 border rounded-lg"
          required
        />
        <input
          type="number"
          placeholder="Institute ID"
          value={newCourse.instituteId}
          onChange={(e) => setNewCourse({ ...newCourse, instituteId: e.target.value })}
          className="w-full p-2 mb-4 border rounded-lg"
          required
        />
        <input
          type="number"
          placeholder="Branch ID"
          value={newCourse.branchId}
          onChange={(e) => setNewCourse({ ...newCourse, branchId: e.target.value })}
          className="w-full p-2 mb-4 border rounded-lg"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600"
        >
          Create Course
        </button>
      </form>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Course List</h2>
        <ul>
          {courses.map((course) => (
            <li key={course.id} className="mb-2">
              <span>
                {course.name} - {course.paymentType}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CourseManagement;