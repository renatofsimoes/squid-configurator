import React, { useState } from "react";
import Button from "./Button";
import "./BandWidthRulesForm.css";

const BandWidthRulesForm = ({ onBack, onRuleCreated }) => {
  const [type, setType] = useState("DELAY_PARAMETERS");
  const [value, setValue] = useState("");
  const [error, setError] = useState(null);

  const types = [
    { value: "DELAY_POOLS", label: "delay_pools" },
    { value: "DELAY_CLASS", label: "delay_class" },
    { value: "DELAY_PARAMETERS", label: "delay_parameters" },
  ];

  // Placeholders dinâmicos
  const placeholders = {
    DELAY_POOLS: "Ex: 3  (Quantidade de pools de delay)",
    DELAY_CLASS: "Ex: 1 1  (poolId classType)",
    DELAY_PARAMETERS: "Ex: 1 128000/128000  (poolId rate/max)",
  };

  const clearForm = (e) => {
    if (e) e.preventDefault();
    setType("DELAY_PARAMETERS");
    setValue("");
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!value.trim()) return setError("Informe os parâmetros (value).");

    const payload = {
      type: type.toUpperCase(),
      value: value.trim(),
    };

    try {
      const res = await fetch("http://localhost:8080/bandwidthrules", {
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
      } else {
        const errJson = await res.json().catch(() => null);
        setError(
          errJson?.message || (await res.text()) || "Erro ao criar regra."
        );
      }
    } catch (err) {
      console.error("Erro ao conectar:", err);
      setError("Falha de conexão com o servidor.");
    }
  };

  return (
    <div className="forms">
      <form id="bandwidthrules-form" onSubmit={handleSubmit}>
        <h2>Adicionar Regra de Largura de Banda</h2>

        {error && <p className="error-msg">{error}</p>}

        <div className="bw-inputs">
          <div className="bw-row">
            <label>Tipo de regra:</label>
            <select value={type} onChange={(e) => setType(e.target.value)}>
              {types.map((t) => (
                <option value={t.value} key={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          <div className="bw-row">
            <label>Valores:</label>
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={placeholders[type]}
              required
            />
          </div>
          <div className="bw-clear-btn">
            <Button text="LIMPAR" className="clear-btn" onClick={clearForm} />
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
        </div>
      </form>
    </div>
  );
};

export default BandWidthRulesForm;
