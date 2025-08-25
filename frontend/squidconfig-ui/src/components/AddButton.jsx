import React from "react";
import "./AddButton.css";

const AddButton = ({ text }) => {
  return (
    <div id="add-btn">
      <button>{text}</button>
    </div>
  );
};

export default AddButton;
