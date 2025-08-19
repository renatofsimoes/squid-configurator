import React from "react";
import "./NavBar.css";
import logo from "../assets/squid_configurator-logo.png";
import Button from "./NavBarButton";

const NavBar = () => {
  return (
    <div id="navbar">
      <img src={logo} alt="squid_configurator-logo" />
      <div id="navbar-buttons">
        <Button id="server-btn" text="SERVIDOR" />
        <Button id="users-btn" text="USUÁRIOS DA REDE" />
        <h3>Regras:</h3>
        <div id="rule-buttons">
          <Button id="acls-btn" text="ACLS" />
          <Button id="band-width-rules-btn" text="LARGURA DE BANDA" />
          <Button id="cache-rules-btn" text="CACHE" />
        </div>
      </div>
    </div>
  );
};

export default NavBar;
