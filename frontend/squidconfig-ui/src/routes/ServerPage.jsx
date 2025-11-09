import React, { useEffect, useState } from "react";
import "./ServerPage.css";
import Button from "../components/Button";

const ServerPage = () => {
  const [exists, setExists] = useState(null); // deny-all status
  const [loading, setLoading] = useState(false); // checking deny-all
  const [actionLoading, setActionLoading] = useState(false); // add/remove deny-all
  const [restartLoading, setRestartLoading] = useState(false);
  const [reloadLoading, setReloadLoading] = useState(false);
  const [serviceLoading, setServiceLoading] = useState(false); // start/stop
  const [serviceRunning, setServiceRunning] = useState(null); // null = unknown, true/false
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const API_BASE = "http://localhost:8080/server";
  const anyLoading =
    loading ||
    actionLoading ||
    restartLoading ||
    reloadLoading ||
    serviceLoading;

  // checa se a linha "http_access deny all" existe
  const loadDenyAllStatus = async () => {
    setLoading(true);
    setError(null);
    setMessage(null);
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

  // checa se o serviço squid está rodando
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
      // não sobrescrever mensagem de regra
    } finally {
      setServiceLoading(false);
    }
  };

  useEffect(() => {
    // carregar ambos os status ao montar
    loadDenyAllStatus();
    loadServiceStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ADD / REMOVE deny-all
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
    } catch (err) {
      console.error("Erro ao remover regra:", err);
      setError("Erro ao remover regra.");
    } finally {
      setActionLoading(false);
    }
  };

  // START / STOP service
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
    } catch (err) {
      console.error("Erro ao parar Squid:", err);
      setError("Erro ao parar o Squid.");
    } finally {
      setServiceLoading(false);
    }
  };

  // RESTART / RELOAD (mantidos)
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

      {message && <p className="server-message">{message}</p>}
      {error && <p className="error-msg">{error}</p>}
    </div>
  );
};

export default ServerPage;
