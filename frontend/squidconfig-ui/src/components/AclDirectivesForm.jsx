import React from "react";
import "./AclDirectivesForm.css";
import Button from "./Button";

const AclDirectivesForm = ({ onBack }) => {
  return (
    <div className="forms">
      <form id="directives-form">
        <h2>Adicionar Diretiva</h2>
        <div id="directives-top">
          <div className="directives-select">
            <label>Tipo de Diretiva:</label>
            <select>
              <option value="http_access">Http_access</option>
              <option value="http_reply_access">Http_reply_access</option>
              <option value="url_rewrite_access">Url_rewrite_access</option>
              <option value="delay_access">Delay_access</option>
              <option value="cache">Cache</option>
              <option value="access_log">Access_log</option>
            </select>
          </div>
          <div className="directives-select">
            <label>Ação:</label>
            <select>
              <option value="allow">Allow</option>
              <option value="deny">Deny</option>
            </select>
          </div>
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
