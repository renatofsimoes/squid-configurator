import React, { useState } from "react";
import Button from "./Button";
import "./ValuesForm.css";

const ValuesForm = ({ acl, onBack, mode = "add" }) => {
  const [newValue, setNewValue] = useState("");
  const [selectedValue, setSelectedValue] = useState(null);
  const [error, setError] = useState(null);

  if (!acl) return null;

  const handleAdd = async (e) => {
    e.preventDefault();
    setError(null);
    if (!newValue.trim()) return;

    try {
      const res = await fetch(
        `http://localhost:8080/acls/${encodeURIComponent(acl.name)}/values/add`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ value: newValue.trim() }),
        }
      );
      if (res.ok) {
        onBack();
        return;
      }
      const errJson = await res.json().catch(() => null);
      setError(
        errJson?.message || (await res.text()) || "Erro ao adicionar valor."
      );
    } catch (err) {
      setError(`Falha de conexão: ${err.message}`);
    }
  };

  const handleRemove = async (e) => {
    e.preventDefault();
    setError(null);
    const valueToRemove = selectedValue;
    if (!valueToRemove) {
      setError("Selecione um valor para remover.");
      return;
    }

    if (
      !window.confirm(
        `Remover o valor "${valueToRemove}" da ACL "${acl.name}"?`
      )
    )
      return;

    try {
      // endpoint PUT /acls/{aclName}/values/remove?value=...
      const url = `http://localhost:8080/acls/${encodeURIComponent(
        acl.name
      )}/values/remove?value=${encodeURIComponent(valueToRemove)}`;
      const res = await fetch(url, { method: "PUT" });
      if (res.ok) {
        onBack();
        return;
      }
      const errJson = await res.json().catch(() => null);
      setError(
        errJson?.message || (await res.text()) || "Erro ao remover valor."
      );
    } catch (err) {
      setError(`Falha de conexão: ${err.message}`);
    }
  };

  return (
    <div className="forms">
      <div className="values-form">
        <div className="valuesForm-top">
          <h2>{mode === "remove" ? "Remover Valor" : "Adicionar Valor"}</h2>
          <h3>ACL: {acl.name}</h3>
          <p>
            <strong>Tipo:</strong> {acl.type}
          </p>
        </div>

        <p>Valores existentes:</p>
        <div className="values-list">
          {Array.isArray(acl.values) && acl.values.length > 0 ? (
            acl.values.map((v, i) => {
              // Se estiver removendo → botão
              if (mode === "remove") {
                return (
                  <button
                    key={i}
                    type="button"
                    className={`value-item removable ${
                      selectedValue === v ? "selected" : ""
                    }`}
                    onClick={() => setSelectedValue(v)}
                  >
                    {v}
                  </button>
                );
              }
              // Se estiver adicionando → apenas exibe
              return (
                <div key={i} className="value-item">
                  {v}
                </div>
              );
            })
          ) : (
            <span className="value-empty">(nenhum valor cadastrado)</span>
          )}
        </div>

        <form onSubmit={mode === "remove" ? handleRemove : handleAdd}>
          {mode === "add" ? (
            <>
              <label>Novo valor: </label>
              <input
                type="text"
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                placeholder="Digite o novo valor"
                required
              />
            </>
          ) : (
            <div id="remove-msg">
              <p>Selecione um valor e clique na lixeira.</p>
            </div>
          )}

          {error && <p className="error-msg">{error}</p>}

          <div className="form-btns">
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
    </div>
  );
};

export default ValuesForm;
