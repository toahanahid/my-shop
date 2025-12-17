// src/components/LoadingSpinner.jsx
import React from "react";

const LoadingSpinner = ({ text = "Loading..." }) => {
  return (
    <div
      className="d-flex justify-content-center align-items-center position-fixed top-0 start-0 w-100 h-100 bg-light"
      style={{ zIndex: 1050 }}
    >
      <div className="text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">{text}</span>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
