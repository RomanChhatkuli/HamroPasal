import image from '../assets/NotFoundImage.svg';
import React from "react";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center px-3">
      {/* Image Section */}
      <img src={image} alt="404 Not Found" className="w-72 sm:w-96 mb-6" />

      {/* Text Content */}
      <h1 className="text-3xl sm:text-4xl font-bold mb-4">Something is not right...</h1>
      <p className="text-gray-500 text-lg max-w-lg">
        The page you are looking for does not exist. It may have been moved or deleted. If you think this is an error, please contact support.
      </p>

      {/* Button to go back to home */}
      <Link to="/">
        <button className="mt-6 px-6 py-3 text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow">
          Back to Home
        </button>
      </Link>
    </div>
  );
};

export default NotFoundPage;
