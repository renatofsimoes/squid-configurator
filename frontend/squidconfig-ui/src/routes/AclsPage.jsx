import React, { useState, useEffect } from "react";
import "./AclsPage.css";
import Button from "../components/Button";
import Select from "../components/Select";
import AclsForm from "../components/AclsForm";
import DirectivesForm from "../components/AclDirectivesForm";
import Acl from "../components/Acl";

const AclsPage = () => {
  const [selectedAclType, setSelectedAclType] = useState("all");
  const [activeForm, setActiveForm] = useState(null);
  const [acls, setAcls] = useState([]);

  const aclTypes = [
    { value: "all", label: "Todos" },
    { value: "src", label: "IPs de origem" },
    { value: "dst", label: "IPs de destino" },
    { value: "dstdomain", label: "Domínios de destino" },
    { value: "port", label: "Portas de destino" },
    { value: "time", label: "Horários" },
    { value: "url_regex", label: "Palavras-chave" },
  ];

  // Buscar ACLs ao carregar a página
  useEffect(() => {
    fetch("http://localhost:8080/acls")
      .then((res) => res.json())
      .then((data) => {
        const parsed = parseAcls(data);
        setAcls(parsed);
      })
      .catch((err) => console.error("Erro ao buscar ACLs:", err));
  }, []);

  // Função que transforma as linhas em objetos ACL
  const parseAcls = (lines) => {
    const aclMap = {};

    lines.forEach((rawLine) => {
      const line = rawLine.trim();
      if (!line || line.startsWith("#")) return;

      const parts = line.split(/\s+/);
      const prefix = parts[0].toLowerCase();

      if (prefix === "acl") {
        const name = parts[1];
        const type = parts[2];
        const values = parts.slice(3);

        if (!aclMap[name]) {
          aclMap[name] = { name, type, values, directives: [] };
        } else {
          aclMap[name].values.push(...values);
        }
      } else if (
        line.toLowerCase().startsWith("http_access") ||
        line.toLowerCase().startsWith("http_reply_access") ||
        line.toLowerCase().startsWith("url_rewrite_access") ||
        line.toLowerCase().startsWith("access_log")
      ) {
        // Vincula a diretiva à ACL correspondente, se existir
        Object.keys(aclMap).forEach((aclName) => {
          if (line.includes(aclName)) {
            aclMap[aclName].directives.push(line);
          }
        });
      }
    });

    return Object.values(aclMap);
  };

  // Aplicar filtro por tipo
  const filteredAcls =
    selectedAclType === "all"
      ? acls
      : acls.filter((a) => a.type === selectedAclType);

  return (
    <div id="acls-page">
      <h1>ACLs</h1>

      {activeForm === "addAcl" ? (
        <AclsForm onBack={() => setActiveForm(null)} />
      ) : activeForm === "addDirective" ? (
        <DirectivesForm onBack={() => setActiveForm(null)} />
      ) : (
        <>
          <div className="filter-header">
            <Button
              className="add-btn"
              text="+ Adicionar ACL"
              onClick={() => setActiveForm("addAcl")}
            />
            <Select
              label="Filtrar por ACLs baseadas em: "
              options={aclTypes}
              value={selectedAclType}
              onChange={(e) => setSelectedAclType(e.target.value)}
            />
          </div>

          <div className="rules-list">
            {filteredAcls.length === 0 ? (
              <p>Nenhuma ACL encontrada.</p>
            ) : (
              filteredAcls.map((acl) => (
                <Acl
                  key={acl.name}
                  aclName={acl.name}
                  aclType={acl.type}
                  aclValues={acl.values}
                  directives={acl.directives}
                  onAddDirective={() => setActiveForm("addDirective")}
                />
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default AclsPage;
