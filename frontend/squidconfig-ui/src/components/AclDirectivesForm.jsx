import React from "react";
import "./AclDirectivesForm.css";
import Button from "./Button";

const AclDirectivesForm = ({ onBack }) => {
  return (
    <div className="forms">
      <h2>Adicionar Diretiva</h2>
      <form>
        <input placeholder="Nome da diretiva" />
        <input placeholder="Valor da diretiva" />
        <Button
          iClass="fa-solid fa-check-double"
          className="create-btn"
          type="submit"
        />
      </form>
      <Button
        iClass="fas fa-arrow-left"
        className="back-btn"
        onClick={onBack}
      />
    </div>
  );
};

export default AclDirectivesForm;
