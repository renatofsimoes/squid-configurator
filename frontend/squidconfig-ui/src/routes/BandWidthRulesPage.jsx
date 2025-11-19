import React, { useEffect, useState } from "react";
import "./BandWidthRulesPage.css";
import Button from "../components/Button";
import BandWidthRule from "../components/BandWidthRule";
import BandWidthRulesForm from "../components/BandWidthRulesForm";

const BandWidthRulesPage = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeForm, setActiveForm] = useState(null);

  useEffect(() => {
    loadRules();
  }, []);

  const loadRules = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:8080/bandwidthrules");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const lines = await res.json();
      const parsed = parseBandWidthLines(lines || []);
      const grouped = groupByPool(parsed);
      setGroups(grouped);
    } catch (err) {
      console.error("Erro ao carregar regras de largura de banda:", err);
      setError("Falha ao carregar regras de largura de banda.");
    } finally {
      setLoading(false);
    }
  };

  const parseBandWidthLines = (lines) =>
    lines
      .map((raw) => {
        const line = (raw || "").trim();
        if (!line || line.startsWith("#")) return null;
        const parts = line.split(/\s+/);
        const directive = parts[0];
        let poolId = null;
        if (directive === "delay_pools") {
          poolId = "delay_pools";
        } else if (parts.length >= 2) {
          poolId = parts[1];
        } else {
          poolId = "unknown";
        }
        const params = parts.slice(1).join(" ");
        return { rawLine: raw, directive, poolId, params, parts };
      })
      .filter(Boolean);

  const groupByPool = (parsedLines) => {
    const map = new Map();
    parsedLines.forEach((item) => {
      const key = item.poolId || "unknown";
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(item);
    });
    const arr = Array.from(map.entries()).map(([poolId, lines]) => ({
      poolId,
      lines,
    }));
    arr.sort((a, b) => {
      if (a.poolId === "delay_pools") return -1;
      if (b.poolId === "delay_pools") return 1;
      const na = Number(a.poolId);
      const nb = Number(b.poolId);
      if (!isNaN(na) && !isNaN(nb)) return na - nb;
      return String(a.poolId).localeCompare(String(b.poolId));
    });
    return arr;
  };

  const handleDeletePool = async (poolId) => {
    if (
      !window.confirm(
        `Deseja realmente excluir todas as regras do pool ${poolId}?`
      )
    )
      return;
    try {
      const res = await fetch(
        `http://localhost:8080/bandwidthrules/${encodeURIComponent(poolId)}`,
        { method: "DELETE" }
      );
      if (!res.ok && res.status !== 204) {
        const txt = await res.text().catch(() => "");
        throw new Error(txt || `Erro ${res.status}`);
      }
      setGroups((prev) => prev.filter((g) => g.poolId !== poolId));
    } catch (err) {
      alert(`Erro ao excluir regras do pool: ${err.message}`);
    }
  };

  const handleDeleteDelayPools = async () => {
    if (
      !window.confirm(
        "Isso removerá TODAS as regras de largura de banda. Continuar?"
      )
    )
      return;

    try {
      const res = await fetch(
        "http://localhost:8080/bandwidthrules/delaypools",
        {
          method: "DELETE",
        }
      );

      if (!res.ok && res.status !== 204) {
        const txt = await res.text().catch(() => "");
        throw new Error(txt || `Erro ${res.status}`);
      }

      setGroups([]);
    } catch (err) {
      alert(`Erro ao remover delay_pools: ${err.message}`);
    }
  };

  const handleAddFromForm = async (created) => {
    setActiveForm(null);
    await loadRules();
  };

  return (
    <div id="band-width-page">
      <h1>LARGURA DE BANDA</h1>

      {activeForm === "add" ? (
        <BandWidthRulesForm
          onBack={() => setActiveForm(null)}
          onRuleCreated={(created) => handleAddFromForm(created)}
        />
      ) : (
        <>
          <Button
            className="add-btn"
            text="+ Adicionar regra de largura de banda"
            onClick={() => setActiveForm("add")}
          />

          {loading ? (
            <p>Carregando regras...</p>
          ) : error ? (
            <p className="error-msg">{error}</p>
          ) : groups.length === 0 ? (
            <div className="lbne">
              <p>Nenhuma regra de largura de banda encontrada.</p>
            </div>
          ) : (
            <div id="bandwidth-rules-list">
              {groups.map((g) => (
                <BandWidthRule
                  key={g.poolId}
                  poolId={g.poolId}
                  lines={g.lines}
                  onDeletePool={() => handleDeletePool(g.poolId)}
                  onDeleteDelayPools={handleDeleteDelayPools}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BandWidthRulesPage;
