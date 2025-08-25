import React from "react";
import "./HomePage.css";

import HomeTechnologies from "../components/HomeTechnologies";
import HomeDescription from "../components/HomeDescription";

import { Outlet } from "react-router-dom";

const Home = () => {
  return (
    <div id="home-page">
      <div id="home-title">
        <h1>SQUID CONFIGURATOR</h1>
        <h2>Automatizando configurações de proxy, simplificando redes.</h2>
      </div>
      <HomeDescription />
      <HomeTechnologies />
    </div>
  );
};

export default Home;
