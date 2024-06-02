import React from "react";

const Spinner = () => {
  return (
    <>
      <div className="d-flex vh-100 align-items-center justify-content-center">
        <div
          className="spinner-grow"
          style={{ width: "3rem", height: "3rem" }}
          role="status"
        >
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    </>
  );
};

export default Spinner;
