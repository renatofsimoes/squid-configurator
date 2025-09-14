import React, { useState } from "react";
import "./AclsForm.css";
import Button from "./Button";

const AclsForm = ({ onBack }) => {
  const [name, setName] = useState("");
  const [type, setType] = useState("SRC");
  const [value, setValue] = useState("");

  const clearForm = (e) => {
    e.preventDefault();
    setName("");
    setType("SRC");
    setValue("");
  };

  return (
    <div className="forms">
      <form id="acls-form">
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
              {type === "SRC" || type === "DST" ? (
                <input
                  type="text"
                  placeholder="Ex: 192.168.0.1"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  required
                />
              ) : type === "DSTDOMAIN" ? (
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
