import React, { useEffect, useState } from "react";
import "./CacheRulesPage.css";
import Button from "../components/Button";
import CacheRule from "../components/CacheRule";
import CacheRulesForm from "../components/CacheRulesForm"; // seu form

const CacheRulesPage = () => {
  const [rules, setRules] = useState([]); // cada rule: { rawLine, type, params }
  const [activeForm, setActiveForm] = useState(null); // null | "add" | "edit"
  const [editingRule, setEditingRule] = useState(null); // objeto rule quando editar
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Carrega linhas brutas do backend e faz parse simples
  const loadRules = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:8080/cacherules");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const lines = await res.json(); // lista de strings
      const parsed = parseCacheLines(lines || []);
      setRules(parsed);
    } catch (err) {
      console.error("Erro ao carregar regras:", err);
      setError("Falha ao carregar regras de cache.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRules();
  }, []);

  // parse simples: primeiro token = tipo (cache_dir, cache_mem, refresh_pattern, etc)
  // restante = params (string)
  const parseCacheLines = (lines) =>
    lines.map((line) => {
      const trimmed = (line || "").trim();
      if (!trimmed) return { rawLine: line, type: "", params: "" };
      const parts = trimmed.split(/\s+/);
      const typeToken = parts[0]; // ex: cache_dir
      const params = parts.slice(1).join(" ");
      return { rawLine: line, type: typeToken, params, parts };
    });

  // Chamar POST para criar nova regra (usado para edição: criar a nova regra)
  const createRule = async (rulePayload) => {
    const res = await fetch("http://localhost:8080/cacherules", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(rulePayload),
    });
    if (!res.ok) {
      const errJson = await res.json().catch(() => null);
      throw new Error(errJson?.message || `Erro ${res.status}`);
    }
    return await res.json().catch(() => null);
  };

  // Chamar DELETE com body contendo a regra (conforme seu backend)
  const deleteRule = async (rulePayload) => {
    const res = await fetch("http://localhost:8080/cacherules", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(rulePayload),
    });
    if (!res.ok && res.status !== 204) {
      const errJson = await res.json().catch(() => null);
      throw new Error(errJson?.message || `Erro ${res.status}`);
    }
  };

  // Handler quando o form de criar chama onRuleCreated(created)
  // aqui apenas recarregamos a lista (o form já fez o POST)
  const handleCreateFromForm = async (created /* pode ser null */) => {
    setActiveForm(null);
    await loadRules();
  };

  // ---------------------------
  // ALTERAÇÃO PRINCIPAL: edição
  // Agora usamos PUT /cacherules/{directive} enviando o novo valor no body (text/plain)
  // ---------------------------
  const handleEditSave = async (newPayload) => {
    if (!editingRule) return;
    try {
      // directive for the URL: transform type (ex: "CACHE_MEM") -> "cache_mem"
      const directivePath = newPayload.type.toLowerCase(); // matches getDirectivePrefix mapping

      const res = await fetch(
        `http://localhost:8080/cacherules/${encodeURIComponent(directivePath)}`,
        {
          method: "PUT",
          headers: { "Content-Type": "text/plain" },
          body: newPayload.value, // enviar apenas a string do novo valor
        }
      );

      if (!res.ok) {
        // tenta extrair mensagem do corpo
        const text = await res.text().catch(() => null);
        throw new Error(text || `Erro ${res.status}`);
      }

      // sucesso: recarrega a lista e limpa estado
      setEditingRule(null);
      setActiveForm(null);
      await loadRules();
    } catch (err) {
      alert(`Erro ao editar regra: ${err.message}`);
    }
  };

  const handleDelete = async (rule) => {
    if (
      !window.confirm(
        `Deseja realmente excluir a regra "${rule.type} ${rule.params}"?`
      )
    )
      return;
    try {
      // normaliza o tipo para o formato do enum (REFRESH_PATTERN, CACHE_MEM, ...)
      const typeEnum = rule.type.replace(/-/g, "_").toUpperCase();

      await deleteRule({ type: typeEnum, value: rule.params });
      // atualiza localmente sem recarregar tudo:
      setRules((prev) => prev.filter((r) => r.rawLine !== rule.rawLine));
    } catch (err) {
      alert(`Erro ao excluir: ${err.message}`);
    }
  };

  const handleEdit = (rule) => {
    setEditingRule(rule);
    setActiveForm("edit");
  };

  return (
    <div id="cache-page">
      <h1>CACHE</h1>

      {activeForm === "add" ? (
        <CacheRulesForm
          onBack={() => setActiveForm(null)}
          onRuleCreated={(created) => handleCreateFromForm(created)}
        />
      ) : activeForm === "edit" && editingRule ? (
        <CacheRulesForm
          mode="edit"
          initialRule={{ type: editingRule.type, value: editingRule.params }}
          onBack={() => {
            setEditingRule(null);
            setActiveForm(null);
          }}
          onRuleCreated={(payload) => handleEditSave(payload)}
        />
      ) : (
        <>
          <Button
            className="add-btn"
            text="+ Adicionar regra de cache"
            onClick={() => setActiveForm("add")}
          />

          {loading ? (
            <p>Carregando regras...</p>
          ) : error ? (
            <p className="error-msg">{error}</p>
          ) : rules.length === 0 ? (
            <p>Nenhuma regra de cache encontrada.</p>
          ) : (
            <div id="cache-rules-list">
              {rules.map((r) => (
                <CacheRule
                  key={r.rawLine}
                  rule={{ type: r.type, params: r.params }}
                  onEdit={() => handleEdit(r)}
                  onDelete={() => handleDelete(r)}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CacheRulesPage;
