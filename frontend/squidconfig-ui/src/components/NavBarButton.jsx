import React from "react";
import "./NavBarButton.css";

const NavBarButton = ({ text, id }) => {
  return <button id={id}>{text}</button>;
};

export default NavBarButton;
