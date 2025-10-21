import React, { useState } from "react";
import "./AclsForm.css";
import Button from "./Button";

const AclsForm = ({ onBack, onAclCreated }) => {
  const [name, setName] = useState("");
  const [type, setType] = useState("src");
  const [value, setValue] = useState("");
  const [error, setError] = useState(null);

  const clearForm = (e) => {
    e.preventDefault();
    setName("");
    setType("src");
    setValue("");
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const acl = { name, type: type.toUpperCase(), value: value };

    try {
      const response = await fetch("http://localhost:8080/acls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(acl),
      });

      if (response.ok) {
        const createdAcl = await response.json();
        if (onAclCreated) onAclCreated(createdAcl); // atualiza lista na página
        clearForm(e);
        onBack();
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Erro ao criar ACL");
      }
    } catch (err) {
      console.error("Erro de conexão:", err);
      setError("Erro ao conectar com o servidor");
    }
  };

  return (
    <div className="forms">
      <form id="acls-form" onSubmit={handleSubmit}>
        <h2>Adicionar ACL</h2>

        {error && <p className="error-msg">{error}</p>}

        <div id="acl-inputs-control">
          <div id="acl-first">
            <div className="acl-input">
              <label>Nome da ACL:</label>
              <input
                type="text"
                placeholder="nome_da_acl"
                value={name}
                onChange={(e) => setName(e.target.value.replace(/\s/g, ""))}
                required
              />
            </div>
            <div className="acl-select">
              <label>Tipo da ACL:</label>
              <select value={type} onChange={(e) => setType(e.target.value)}>
                <option value="src">src (IP de origem)</option>
                <option value="dst">dst (IP de destino)</option>
                <option value="dstdomain">
                  dstdomain (Domínio de destino)
                </option>
                <option value="port">port (Porta de destino)</option>
                <option value="time">time (Horário)</option>
                <option value="url_regex">url_regex (Palavra-chave)</option>
              </select>
            </div>
          </div>

          <div id="acl-last">
            <div className="acl-input">
              <label>Primeiro valor:</label>
              {type === "src" || type === "dst" ? (
                <input
                  type="text"
                  placeholder="Ex: 192.168.0.1"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  required
                />
              ) : type === "dstdomain" ? (
                <input
                  type="text"
                  placeholder="Ex: exemplo.com"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  required
                />
              ) : (
                <input
                  type="text"
                  placeholder="Digite o valor"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  required
                />
              )}
            </div>
            <Button text="LIMPAR" className="clear-btn" onClick={clearForm} />
          </div>
        </div>

        <div className="form-btns">
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

export default AclsForm;
