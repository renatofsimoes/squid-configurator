import React from "react";
import "./BandWidthRulesPage.css";
import AddButton from "../components/AddButton";

const BandWidthRulesPage = () => {
  return (
    <div id="band-width-page">
      <h1>LARGURA DE BANDA</h1>
      <AddButton text="+ Adicionar regra de largura de banda" />
    </div>
  );
};

export default BandWidthRulesPage;
