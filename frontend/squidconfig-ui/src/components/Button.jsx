import React from "react";
import "./Button.css";

const Button = ({ className, text, onClick, iClass }) => {
  return (
    <button className={className} onClick={onClick}>
      <i className={iClass}></i>
      {text}
    </button>
  );
};

export default Button;
