import React from "react";
import "./NavBar.css";
import logo from "../assets/squid_configurator-logo.png";
import NavBarButton from "./NavBarButton";

const NavBar = () => {
  return (
    <div id="navbar">
      <img src={logo} alt="squid_configurator-logo" />
      <div id="navbar-buttons">
        <NavBarButton id="server-btn" text="SERVIDOR" />
        <NavBarButton id="users-btn" text="USUÁRIOS DA REDE" />
        <h3>Regras:</h3>
        <div id="rule-buttons">
          <NavBarButton id="acls-btn" text="ACLs" />
          <NavBarButton id="band-width-rules-btn" text="LARGURA DE BANDA" />
          <NavBarButton id="cache-rules-btn" text="CACHE" />
        </div>
      </div>
    </div>
  );
};

export default NavBar;
