import React from "react";

const ErrorPage = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
      {/* رمز الخطأ */}
      <h1 className="text-9xl font-bold text-gray-800">404</h1>

      {/* رسالة الخطأ */}
      <p className="mt-4 text-2xl text-gray-600">
        Oops! The page you're looking for doesn't exist.
      </p>

      {/* زر العودة للصفحة الرئيسية */}
      <a
        href="/"
        className="mt-8 px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition duration-300"
      >
        Go back to Home
      </a>
    </div>
  );
};

export default ErrorPage;
