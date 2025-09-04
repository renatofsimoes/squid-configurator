import React from "react";
import "./NavBar.css";
import logo from "../assets/squid_configurator-logo.png";
import NavBarButton from "./NavBarButton";
import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <div id="navbar">
      <Link to="/home">
        <img src={logo} alt="squid_configurator-logo" />
      </Link>
      <div id="navbar-buttons">
        <Link to="/server">
          <NavBarButton id="server-btn" text="SERVIDOR" />
        </Link>
        <Link to="/network-users">
          <NavBarButton id="users-btn" text="USUÁRIOS DA REDE" />
        </Link>
        <h3>Regras:</h3>
        <div id="rule-buttons">
          <Link to="/acls">
            <NavBarButton id="acls-btn" text="ACLs" />
          </Link>
          <Link to="/bandwidth-rules">
            <NavBarButton id="band-width-rules-btn" text="LARGURA DE BANDA" />
          </Link>
          <Link to="/cache-rules">
            <NavBarButton id="cache-rules-btn" text="CACHE" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
