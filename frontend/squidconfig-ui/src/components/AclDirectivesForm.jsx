import React from "react";
import "./AclDirectivesForm.css";
import Button from "./Button";

const AclDirectivesForm = ({ onBack }) => {
  return (
    <div className="forms">
      <form id="directives-form">
        <h2>Adicionar Diretiva</h2>
        <div id="directives-top">
          <label></label>
          <input placeholder="Nome da diretiva" />
          <input placeholder="Valor da diretiva" />
        </div>
        <div id="directives-btns">
          <Button
            iClass="fas fa-arrow-left"
            className="back-btn"
            onClick={onBack}
          />
          <Button
            iClass="fa-solid fa-check-double"
            className="create-btn"
            type="submit"
          />
        </div>
      </form>
    </div>
  );
};

export default AclDirectivesForm;
