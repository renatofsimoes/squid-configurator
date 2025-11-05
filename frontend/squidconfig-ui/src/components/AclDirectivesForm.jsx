import React, { useState } from "react";
import "./AclDirectivesForm.css";
import Button from "./Button";

// util para normalizar token para o enum (HTTP_ACCESS etc.)
const normalizeDirectiveEnum = (token) =>
  token.toUpperCase().replace(/\./g, "_");

const parseDirectiveLine = (line) => {
  // tenta extrair: directive (token1) e action (possível token2 'allow'/'deny')
  const parts = line.trim().split(/\s+/);
  const directiveToken = parts[0]; // ex: http_access
  const actionToken = parts[1] ? parts[1].toUpperCase() : null; // ALLOW / DENY
  return { directiveToken, actionToken };
};

const AclDirectivesForm = ({ acl, onBack, mode = "add" }) => {
  const [directive, setDirective] = useState("HTTP_ACCESS");
  const [action, setAction] = useState("ALLOW");
  const [selectedDirective, setSelectedDirective] = useState(null);
  const [selectedAction, setSelectedAction] = useState(null);
  const [error, setError] = useState(null);

  if (!acl) return null;

  const handleAdd = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await fetch(
        `http://localhost:8080/acls/${encodeURIComponent(acl.name)}/directives`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ directive, action }),
        }
      );
      if (response.ok) {
        onBack();
        return;
      }
      const errorData = await response.json().catch(() => null);
      setError(
        errorData?.message ||
          (await response.text()) ||
          "Erro desconhecido ao criar diretiva."
      );
    } catch (err) {
      setError(`Falha de conexão com o servidor: ${err.message}`);
    }
  };

  const handleRemove = async (e) => {
    e.preventDefault();
    setError(null);
    if (!selectedDirective) {
      setError("Selecione uma diretiva para remover.");
      return;
    }

    if (
      !window.confirm(
        `Remover a diretiva '${selectedDirective}'${
          selectedAction ? " com ação " + selectedAction : ""
        }?`
      )
    )
      return;

    try {
      // selectedDirective já no formato do enum, ex: HTTP_ACCESS
      const actionQuery = selectedAction
        ? `?action=${encodeURIComponent(selectedAction)}`
        : "";
      const url = `http://localhost:8080/acls/${encodeURIComponent(
        acl.name
      )}/directives/${encodeURIComponent(selectedDirective)}${actionQuery}`;
      const res = await fetch(url, { method: "DELETE" });
      if (res.ok) {
        onBack();
        return;
      }
      const errJson = await res.json().catch(() => null);
      setError(
        errJson?.message || (await res.text()) || "Erro ao remover diretiva."
      );
    } catch (err) {
      setError(`Falha de conexão: ${err.message}`);
    }
  };

  return (
    <div className="forms">
      <form
        id="directives-form"
        onSubmit={mode === "remove" ? handleRemove : handleAdd}
      >
        <h2>{mode === "remove" ? "Remover Diretiva" : "Adicionar Diretiva"}</h2>
        <h3>ACL: {acl.name}</h3>
        <p>
          <strong>Tipo:</strong> {acl.type}
        </p>

        <p>Diretivas existentes:</p>
        <div className="dValues">
          {Array.isArray(acl.directives) && acl.directives.length > 0 ? (
            acl.directives.map((line, i) => {
              const parsed = parseDirectiveLine(line);
              const enumName = normalizeDirectiveEnum(parsed.directiveToken);
              const display = line;
              // Se estiver em modo remover → botão clicável
              if (mode === "remove") {
                return (
                  <button
                    key={i}
                    type="button"
                    className={`dValue-item removable ${
                      selectedDirective === enumName &&
                      selectedAction === parsed.actionToken
                        ? "selected"
                        : ""
                    }`}
                    onClick={() => {
                      setSelectedDirective(enumName);
                      setSelectedAction(parsed.actionToken);
                    }}
                  >
                    {display}
                  </button>
                );
              }
              // Se não estiver em remover → apenas exibir texto sem ser clicável
              return (
                <div key={i} className="dValue-item">
                  {display}
                </div>
              );
            })
          ) : (
            <span className="value-empty">(nenhuma diretiva associada)</span>
          )}
        </div>

        {mode === "add" ? (
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
              <select
                value={action}
                onChange={(e) => setAction(e.target.value)}
              >
                <option value="ALLOW">Allow</option>
                <option value="DENY">Deny</option>
              </select>
            </div>
          </div>
        ) : (
          <div id="remove-msg2">
            <p>Selecione uma diretiva clique na lixeira.</p>
          </div>
        )}

        {error && <p className="error-msg">{error}</p>}

        <div id="directives-btns">
          <Button
            iClass="fas fa-arrow-left"
            className="back-btn"
            onClick={onBack}
          />
          <Button
            iClass={
              mode === "remove"
                ? "fa-solid fa-trash"
                : "fa-solid fa-check-double"
            }
            className={mode === "remove" ? "remove-btn" : "create-btn"}
            type="submit"
          />
        </div>
      </form>
    </div>
  );
};

export default AclDirectivesForm;
