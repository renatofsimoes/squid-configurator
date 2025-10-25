import React, { useState } from "react";
import "./AclDirectivesForm.css";
import Button from "./Button";

const AclDirectivesForm = ({ aclName, onBack }) => {
  const [directive, setDirective] = useState("HTTP_ACCESS");
  const [action, setAction] = useState("ALLOW");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch(
        `http://localhost:8080/acls/${aclName}/directives`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ directive, action }),
        }
      );

      if (response.ok) {
        onBack();
        return;
      }

      // tenta interpretar o corpo como JSON
      const errorData = await response.json().catch(() => null);

      if (errorData && errorData.message) {
        setError(errorData.message);
      } else {
        const text = await response.text();
        setError(text || "Erro desconhecido ao criar diretiva.");
      }
    } catch (error) {
      setError(`Falha de conexão com o servidor: ${error.message}`);
    }
  };

  return (
    <div className="forms">
      <form id="directives-form" onSubmit={handleSubmit}>
        <h2>Adicionar Diretiva</h2>

        {error && <p className="error-msg">{error}</p>}

        <div id="directives-top">
          <div className="directives-select">
            <label>Tipo de Diretiva:</label>
            <select
              value={directive}
              onChange={(e) => setDirective(e.target.value)}
            >
              <option value="HTTP_ACCESS">Http_access</option>
              <option value="HTTP_REPLY_ACCESS">Http_reply_access</option>
              <option value="URL_REWRITE_ACCESS">Url_rewrite_access</option>
              <option value="DELAY_ACCESS">Delay_access</option>
              <option value="CACHE">Cache</option>
              <option value="ACCESS_LOG">Access_log</option>
            </select>
          </div>

          <div className="directives-select">
            <label>Ação:</label>
            <select value={action} onChange={(e) => setAction(e.target.value)}>
              <option value="ALLOW">Allow</option>
              <option value="DENY">Deny</option>
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
