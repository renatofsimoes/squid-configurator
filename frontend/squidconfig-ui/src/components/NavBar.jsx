import React, { useEffect, useState } from "react";
import "./NavBar.css";
import logo from "../assets/squid_configurator-logo.png";
import NavBarButton from "./NavBarButton";
import { Link } from "react-router-dom";

const NavBar = () => {
  const [running, setRunning] = useState(null);

  const fetchStatus = async () => {
    try {
      const res = await fetch("http://localhost:8080/server/status");
      if (!res.ok) return setRunning(false);
      const json = await res.json();
      setRunning(Boolean(json.running));
    } catch (err) {
      console.error("Erro ao buscar status do server:", err);
      setRunning(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    const id = setInterval(fetchStatus, 10000); // a cada 10s
    return () => clearInterval(id);
  }, []);

  return (
    <div id="navbar">
      <Link to="/home" id="logo-link">
        <img src={logo} alt="squid_configurator-logo" />
      </Link>
      <div id="navbar-buttons">
        <Link to="/server" className="server-link">
          <NavBarButton id="server-btn" text="SERVIDOR" />
          <span
            className={`server-dot ${
              running ? "on" : running === null ? "unknown" : "off"
            }`}
            title={
              running
                ? "Squid ativo"
                : running === null
                ? "Status desconhecido"
                : "Squid inativo"
            }
          />
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
