import React, { useState, useEffect } from "react";
import api from "../../services/api";

const AccountantManagement = () => {
  const [payments, setPayments] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await api.get("/accountant/financial-reports");
      setPayments(response.data);
    } catch (error) {
      setError("Failed to fetch payments.");
      console.error("Error fetching payments:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold mb-6">Accountant Management</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Financial Reports</h2>
        <ul>
          {payments.map((payment) => (
            <li key={payment.id} className="mb-2">
              <span>
                {payment.studentName} - Amount: {payment.amount}, Date: {payment.date}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AccountantManagement;