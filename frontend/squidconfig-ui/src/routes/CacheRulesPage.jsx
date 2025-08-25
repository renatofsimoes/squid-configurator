import React from "react";
import "./CacheRulesPage.css";
import AddButton from "../components/AddButton";

const CacheRulesPage = () => {
  return (
    <div id="cache-page">
      <h1>Cache</h1>
      <AddButton text="+ Adicionar regra de cache" />
    </div>
  );
};

export default CacheRulesPage;
