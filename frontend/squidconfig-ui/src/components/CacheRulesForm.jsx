import React, { useEffect, useState } from "react";
import Button from "./Button";
import "./CacheRulesForm.css";

/*
 Props suportados:
 - onBack()
 - onRuleCreated(payload)  -> quando modo "add" será chamado com o objeto retornado pelo POST
                              quando modo "edit" será chamado com o payload (sem fazer POST),
                              para que o parent trate delete+create.
 - initialRule: optional { type: "...", value: "..." }  -> para edição pré-preenchida
 - mode: "add" (default) | "edit"
*/

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
    CACHE_DIR: "ex: /var/spool/squid 100 16 256",
    CACHE_MEM: "ex: 256 MB",
    MAXIMUM_OBJECT_SIZE: "ex: 4096 KB",
    MINIMUM_OBJECT_SIZE: "ex: 5 KB",
    CACHE_SWAP_LOW: "ex(%): 90",
    CACHE_SWAP_HIGH: "ex(%): 95",
    REFRESH_PATTERN: "ex: -i \\.(jpg|png)$ 0 20% 4320",
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
        // Em modo edit: não executamos o POST aqui para evitar comportamento indesejado
        // O parent deve receber o payload e executar delete(old) -> post(new)
        if (onRuleCreated) {
          await onRuleCreated(payload);
        }
        onBack();
        return;
      }

      // modo "add": comportamento original (faz o POST)
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
