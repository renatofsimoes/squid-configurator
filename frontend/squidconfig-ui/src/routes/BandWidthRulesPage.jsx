import React from "react";
import "./BandWidthRulesPage.css";
import Button from "../components/Button";

const BandWidthRulesPage = () => {
  return (
    <div id="band-width-page">
      <h1>LARGURA DE BANDA</h1>
      <Button
        className="add-btn"
        text="+ Adicionar regra de largura de banda"
      />
    </div>
  );
};

export default BandWidthRulesPage;
