import React, { useEffect, useState } from "react";
import Button from "./Button";
import "./CacheRulesForm.css";

const CacheRulesForm = ({
  onBack,
  onRuleCreated,
  initialRule = null,
  mode = "add",
}) => {
  const [type, setType] = useState(initialRule?.type || "CACHE_DIR");
  const [value, setValue] = useState(initialRule?.value || "");
  const [error, setError] = useState(null);
  const examples = {
    CACHE_DIR: "Ex: /var/spool/squid 100 16 256",
    CACHE_MEM: "Ex: 256 MB",
    MAXIMUM_OBJECT_SIZE: "Ex: 4096 KB",
    MINIMUM_OBJECT_SIZE: "Ex: 5 KB",
    CACHE_SWAP_LOW: "Ex(%): 90",
    CACHE_SWAP_HIGH: "Ex(%): 95",
    REFRESH_PATTERN: "Ex: -i \\.(jpg|png)$ 0 20% 4320",
  };

  useEffect(() => {
    if (initialRule) {
      setType(initialRule.type?.toUpperCase() || "CACHE_DIR");
      setValue(initialRule.value || initialRule.params || "");
      setError(null);
    }
  }, [initialRule]);

  const clearForm = (e) => {
    if (e) e.preventDefault();
    setType("CACHE_DIR");
    setValue("");
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const payload = {
      type: type.toUpperCase(),
      value: value.trim(),
    };

    try {
      if (mode === "edit") {
        if (onRuleCreated) {
          await onRuleCreated(payload);
        }
        onBack();
        return;
      }
      const res = await fetch("http://localhost:8080/cacherules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.status === 201 || res.ok) {
        const created = await res.json().catch(() => null);
        if (onRuleCreated) onRuleCreated(created);
        clearForm();
        onBack();
        return;
      }

      const errJson = await res.json().catch(() => null);
      setError(
        errJson?.message || (await res.text()) || "Erro ao criar regra."
      );
    } catch (err) {
      console.error("Erro ao conectar com o servidor:", err);
      setError("Falha de conexão com o servidor.");
    }
  };

  return (
    <div className="forms">
      <form id="cacherules-form" onSubmit={handleSubmit}>
        <h2>
          {mode === "edit"
            ? "Editar Regra de Cache"
            : "Adicionar Regra de Cache"}
        </h2>

        {error && <p className="error-msg">{error}</p>}

        <div className="cache-inputs">
          <div className="cache-first">
            <div className="cache-select">
              <label>Tipo de regra:</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                disabled={mode === "edit"}
              >
                <option value="CACHE_DIR">CACHE_DIR</option>
                <option value="CACHE_MEM">CACHE_MEM</option>
                <option value="MAXIMUM_OBJECT_SIZE">MAXIMUM_OBJECT_SIZE</option>
                <option value="MINIMUM_OBJECT_SIZE">MINIMUM_OBJECT_SIZE</option>
                <option value="CACHE_SWAP_LOW">CACHE_SWAP_LOW</option>
                <option value="CACHE_SWAP_HIGH">CACHE_SWAP_HIGH</option>
                <option value="REFRESH_PATTERN">REFRESH_PATTERN</option>
              </select>
            </div>
          </div>

          <div className="cache-last">
            <div className="cache-input">
              <label>Parâmetros / valor:</label>
              <input
                type="text"
                placeholder={examples[type]}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                required
              />
            </div>

            {mode === "add" && (
              <Button text="LIMPAR" className="clear-btn" onClick={clearForm} />
            )}
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

export default CacheRulesForm;
