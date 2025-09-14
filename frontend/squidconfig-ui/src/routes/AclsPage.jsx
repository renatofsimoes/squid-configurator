import React, { useState } from "react";
import "./AclsPage.css";
import Button from "../components/Button";
import Select from "../components/Select";
import AclsForm from "../components/AclsForm";
import Acl from "../components/Acl";

const AclsPage = () => {
  const [selectedAclType, setSelectedAclType] = useState("ALL");
  const [showForm, setShowForm] = useState(false);

  const aclTypes = [
    { value: "all", label: "Todos" },
    { value: "src", label: "IPs de origem" },
    { value: "dst", label: "IPs de destino" },
    { value: "dstdomain", label: "Domínios de destino" },
    { value: "port", label: "Portas de destino" },
    { value: "time", label: "Horários" },
    { value: "url_regex", label: "Palavras-chave" },
  ];

  return (
    <div id="acls-page">
      <h1>ACLs</h1>
      {showForm ? (
        <AclsForm onBack={() => setShowForm(false)} />
      ) : (
        <>
          <div className="filter-header">
            <Button
              className="add-btn"
              text="+ Adicionar ACL"
              onClick={() => setShowForm(true)}
            />
            <Select
              label="Filtrar por ACLs baseadas em: "
              options={aclTypes}
              value={selectedAclType}
              onChange={(e) => setSelectedAclType(e.target.value)}
            />
          </div>
          <div className="rules-list">
            <Acl aclNme="rede_local" aclType="src" aclValues="192.168.0.0/24" />
          </div>
        </>
      )}
    </div>
  );
};

export default AclsPage;
