import React, { useState, useEffect } from "react";
import api from "../services/api";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    password: "",
    roleId: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get("/users");
      setUsers(response.data);
    } catch (error) {
      setError("Failed to fetch users.");
      console.error("Error fetching users:", error);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await api.post("/users/create", newUser);
      setNewUser({ username: "", email: "", password: "", roleId: "" });
      fetchUsers();
    } catch (error) {
      setError("Failed to create user.");
      console.error("Error creating user:", error);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await api.delete(`/users/delete/${userId}`);
      fetchUsers();
    } catch (error) {
      setError("Failed to delete user.");
      console.error("Error deleting user:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold mb-6">User Management</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleCreateUser} className="bg-white p-6 rounded-lg shadow-md mb-6">
        <input
          type="text"
          placeholder="Username"
          value={newUser.username}
          onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
          className="w-full p-2 mb-4 border rounded-lg"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          className="w-full p-2 mb-4 border rounded-lg"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={newUser.password}
          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
          className="w-full p-2 mb-4 border rounded-lg"
          required
        />
        <input
          type="number"
          placeholder="Role ID"
          value={newUser.roleId}
          onChange={(e) => setNewUser({ ...newUser, roleId: e.target.value })}
          className="w-full p-2 mb-4 border rounded-lg"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600"
        >
          Create User
        </button>
      </form>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">User List</h2>
        <ul>
          {users.map((user) => (
            <li key={user.id} className="flex justify-between items-center mb-2">
              <span>
                {user.username} - {user.email}
              </span>
              <button
                onClick={() => handleDeleteUser(user.id)}
                className="bg-red-500 text-white px-4 py-1 rounded-lg hover:bg-red-600"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default UserManagement;