import React, { useEffect, useState } from "react";
import "./ServerPage.css";
import Button from "../components/Button";

const ServerPage = () => {
  const [exists, setExists] = useState(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [restartLoading, setRestartLoading] = useState(false);
  const [reloadLoading, setReloadLoading] = useState(false);
  const [serviceLoading, setServiceLoading] = useState(false);
  const [serviceRunning, setServiceRunning] = useState(null);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const [configText, setConfigText] = useState("");
  const [configLoading, setConfigLoading] = useState(false);

  const API_BASE = "http://localhost:8080/server";
  const anyLoading =
    loading ||
    actionLoading ||
    restartLoading ||
    reloadLoading ||
    serviceLoading;

  const loadDenyAllStatus = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/deny-all`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setExists(Boolean(json?.exists));
    } catch (err) {
      console.error("Erro ao verificar regra deny-all:", err);
      setExists(false);
      setError("Erro ao verificar regra no servidor.");
    } finally {
      setLoading(false);
    }
  };

  const loadServiceStatus = async () => {
    setServiceLoading(true);
    try {
      const res = await fetch(`${API_BASE}/status`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setServiceRunning(Boolean(json?.running));
    } catch (err) {
      console.error("Erro ao verificar status do serviço:", err);
      setServiceRunning(false);
    } finally {
      setServiceLoading(false);
    }
  };

  //carrega conteúdo do squid.conf
  const loadSquidConfig = async () => {
    setConfigLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/config`);
      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(txt || `HTTP ${res.status}`);
      }
      const text = await res.text();
      setConfigText(text);
    } catch (err) {
      console.error("Erro ao carregar squid.conf:", err);
      setConfigText("");
      setError("Erro ao carregar conteúdo do squid.conf.");
    } finally {
      setConfigLoading(false);
    }
  };

  useEffect(() => {
    loadDenyAllStatus();
    loadServiceStatus();
    loadSquidConfig();
  }, []);

  const handleAddRule = async () => {
    if (!window.confirm("Adicionar 'http_access deny all'?")) return;
    setActionLoading(true);
    setMessage(null);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/deny-all`, { method: "POST" });
      if (!res.ok && res.status !== 201) {
        const txt = await res.text().catch(() => "");
        throw new Error(txt || `HTTP ${res.status}`);
      }
      setMessage("Regra adicionada com sucesso.");
      await loadDenyAllStatus();
      await loadSquidConfig();
    } catch (err) {
      console.error("Erro ao adicionar regra:", err);
      setError("Erro ao adicionar regra.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleRemoveRule = async () => {
    if (!window.confirm("Remover essa regra?")) return;
    setActionLoading(true);
    setMessage(null);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/deny-all`, { method: "DELETE" });
      if (!res.ok && res.status !== 204) {
        const txt = await res.text().catch(() => "");
        throw new Error(txt || `HTTP ${res.status}`);
      }
      setMessage("Regra removida com sucesso.");
      await loadDenyAllStatus();
      await loadSquidConfig();
    } catch (err) {
      console.error("Erro ao remover regra:", err);
      setError("Erro ao remover regra.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleStartService = async () => {
    if (!window.confirm("Iniciar o serviço Squid?")) return;
    setServiceLoading(true);
    setMessage(null);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/start`, { method: "POST" });
      const txt = await res.text().catch(() => "");
      if (!res.ok) throw new Error(txt || `HTTP ${res.status}`);
      setMessage(txt || "Serviço Squid iniciado.");
      await loadServiceStatus();
      await loadSquidConfig();
    } catch (err) {
      console.error("Erro ao iniciar Squid:", err);
      setError("Erro ao iniciar o Squid.");
    } finally {
      setServiceLoading(false);
    }
  };

  const handleStopService = async () => {
    if (!window.confirm("Parar o serviço Squid?")) return;
    setServiceLoading(true);
    setMessage(null);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/stop`, { method: "POST" });
      const txt = await res.text().catch(() => "");
      if (!res.ok) throw new Error(txt || `HTTP ${res.status}`);
      setMessage(txt || "Serviço Squid parado.");
      await loadServiceStatus();
      await loadSquidConfig();
    } catch (err) {
      console.error("Erro ao parar Squid:", err);
      setError("Erro ao parar o Squid.");
    } finally {
      setServiceLoading(false);
    }
  };

  const handleRestart = async () => {
    if (!window.confirm("Reiniciar o Squid agora?")) return;
    setRestartLoading(true);
    setMessage(null);
    setError(null);
    try {
      const r = await fetch(`${API_BASE}/restart`, { method: "POST" });
      const text = await r.text().catch(() => "");
      if (!r.ok) throw new Error(text || `HTTP ${r.status}`);
      setMessage(text || "Squid reiniciado.");
      await loadServiceStatus();
      await loadDenyAllStatus();
      await loadSquidConfig();
    } catch (err) {
      console.error("Erro ao reiniciar Squid:", err);
      setError("Erro ao reiniciar Squid.");
    } finally {
      setRestartLoading(false);
    }
  };

  const handleReload = async () => {
    if (!window.confirm("Recarregar configuração?")) return;
    setReloadLoading(true);
    setMessage(null);
    setError(null);
    try {
      const r = await fetch(`${API_BASE}/reload`, { method: "POST" });
      const text = await r.text().catch(() => "");
      if (!r.ok) throw new Error(text || `HTTP ${r.status}`);
      setMessage(text || "Configuração recarregada.");
      await loadServiceStatus();
      await loadDenyAllStatus();
      await loadSquidConfig();
    } catch (err) {
      console.error("Erro ao recarregar Squid:", err);
      setError("Erro ao recarregar Squid.");
    } finally {
      setReloadLoading(false);
    }
  };

  return (
    <div id="server-page">
      <h1>SERVIDOR</h1>

      {message && <p className="server-message">{message}</p>}
      {error && <p className="error-msg">{error}</p>}

      {/* Seção 1 - Controle do Squid */}
      <section className="section-block">
        <h2>Gerenciar Serviço Squid</h2>

        <div className="service-status-row">
          <div className="service-info">
            <div>
              Serviço Squid:{" "}
              {serviceRunning === null
                ? "desconhecido"
                : serviceRunning
                ? "Ativo"
                : "Inativo"}
            </div>
            <div className="small-note">
              {serviceLoading ? "Verificando status..." : ""}
            </div>
          </div>
        </div>

        <div className="actions-line">
          <Button
            text="Recarregar Configuração"
            className="reload-btn"
            onClick={handleReload}
            disabled={anyLoading}
          />

          <Button
            text="Iniciar"
            className="add-btn"
            onClick={handleStartService}
            disabled={anyLoading || serviceRunning === true}
          />

          <Button
            text="Reiniciar"
            className="clear-btn-s"
            onClick={handleRestart}
            disabled={anyLoading}
          />

          <Button
            text="Parar"
            className="stop-btn-s"
            onClick={handleStopService}
            disabled={anyLoading || serviceRunning === false}
          />
        </div>
      </section>

      {/* Seção 2 - Regra */}
      <section className="section-block">
        <h2>Regra de Bloqueio Geral - http_access deny all</h2>

        {loading ? (
          <p>Verificando...</p>
        ) : exists ? (
          <p className="status-ok">Regra aplicada.</p>
        ) : (
          <p className="status-missing">Regra não encontrada.</p>
        )}

        <div className="actions-line">
          {exists ? (
            <Button
              text="Remover Regra"
              className="clear-btn-s"
              onClick={handleRemoveRule}
              disabled={anyLoading}
            />
          ) : (
            <Button
              text="Adicionar Regra"
              className="add-btn"
              onClick={handleAddRule}
              disabled={anyLoading}
            />
          )}
        </div>
      </section>

      {/* Seção 3 - Visualizar Configuração */}
      <section className="section-block">
        <h2>Conteúdo do squid.conf</h2>

        <div className="actions-line">
          <Button
            iClass="fas fa-refresh"
            className="reload-btn"
            onClick={loadSquidConfig}
            disabled={configLoading || anyLoading}
          />
        </div>

        {configLoading ? (
          <p>Carregando...</p>
        ) : configText ? (
          <pre className="config-view">{configText}</pre>
        ) : (
          <p>Nenhum conteúdo carregado.</p>
        )}
      </section>
    </div>
  );
};

export default ServerPage;
