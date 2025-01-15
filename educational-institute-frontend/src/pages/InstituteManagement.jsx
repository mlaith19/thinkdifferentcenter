import React, { useState } from "react";
import api from "../services/api";

const InstituteManagement = () => {
  const [newInstitute, setNewInstitute] = useState({
    name: "",
    email: "",
    password: "",
    adminName: "",
  });
  const [error, setError] = useState("");

  const handleCreateInstitute = async (e) => {
    e.preventDefault();
    try {
      await api.post("/institute/create", newInstitute);
      setNewInstitute({ name: "", email: "", password: "", adminName: "" });
      setError("");
    } catch (error) {
      setError("Failed to create institute.");
      console.error("Error creating institute:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold mb-6">Institute Management</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleCreateInstitute} className="bg-white p-6 rounded-lg shadow-md">
        <input
          type="text"
          placeholder="Institute Name"
          value={newInstitute.name}
          onChange={(e) => setNewInstitute({ ...newInstitute, name: e.target.value })}
          className="w-full p-2 mb-4 border rounded-lg"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={newInstitute.email}
          onChange={(e) => setNewInstitute({ ...newInstitute, email: e.target.value })}
          className="w-full p-2 mb-4 border rounded-lg"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={newInstitute.password}
          onChange={(e) => setNewInstitute({ ...newInstitute, password: e.target.value })}
          className="w-full p-2 mb-4 border rounded-lg"
          required
        />
        <input
          type="text"
          placeholder="Admin Name"
          value={newInstitute.adminName}
          onChange={(e) => setNewInstitute({ ...newInstitute, adminName: e.target.value })}
          className="w-full p-2 mb-4 border rounded-lg"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600"
        >
          Create Institute
        </button>
      </form>
    </div>
  );
};

export default InstituteManagement;