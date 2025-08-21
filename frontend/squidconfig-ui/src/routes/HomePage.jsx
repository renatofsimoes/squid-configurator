import React from "react";
import "./HomePage.css";

import HomeTechnologies from "../components/HomeTechnologies";

import { Outlet } from "react-router-dom";

const Home = () => {
  return (
    <div id="home-page">
      <span id="home-content">
        <h1>SQUID CONFIGURATOR</h1>
        <h2>Automatizando configurações de proxy, simplificando redes.</h2>
        <HomeTechnologies />
      </span>
    </div>
  );
};

export default Home;
