import React, { useState } from "react";
import "./AclsPage.css";
import Button from "../components/Button";
import Select from "../components/Select";
import AclsForm from "../components/AclsForm";

const AclsPage = () => {
  const [selectedAclType, setSelectedAclType] = useState("ALL");
  const [showForm, setShowForm] = useState(false);

  const aclTypes = [
    { value: "ALL", label: "Todos" },
    { value: "SRC", label: "IPs de origem" },
    { value: "DST", label: "IPs de destino" },
    { value: "DSTDOMAIN", label: "Domínios de destino" },
    { value: "PORT", label: "Portas de destino" },
    { value: "TIME", label: "Horários" },
    { value: "URL_REGEX", label: "Palavras-chave" },
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
          <p>{selectedAclType}</p>
        </>
      )}
    </div>
  );
};

export default AclsPage;
