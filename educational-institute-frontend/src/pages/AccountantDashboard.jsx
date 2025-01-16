import React from "react";
import { Link } from "react-router-dom";

const AccountantDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold mb-6">Accountant Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/payments" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg">
          <h2 className="text-xl font-bold mb-4">Manage Payments</h2>
          <p>View and manage payments.</p>
        </Link>
        <Link to="/discounts" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg">
          <h2 className="text-xl font-bold mb-4">Manage Discounts</h2>
          <p>View and manage discounts.</p>
        </Link>
        <Link to="/financial-reports" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg">
          <h2 className="text-xl font-bold mb-4">Generate Reports</h2>
          <p>Generate financial reports.</p>
        </Link>
      </div>
    </div>
  );
};

export default AccountantDashboard;