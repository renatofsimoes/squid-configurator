import React, { useState } from "react";
import "./AclsPage.css";
import AddButton from "../components/AddButton";
import Select from "../components/Select";

const AclsPage = () => {
  const [selectedAclType, setSelectedAclType] = useState("");

  const aclTypes = [
    { value: "ALL", label: "Todos" },
    { value: "DST", label: "IPs de destino" },
    { value: "DSTDOMAIN", label: "Domínios de destino" },
    { value: "PORT", label: "Portas de destino" },
    { value: "SRC", label: "IPs de origem" },
    { value: "TIME", label: "Horários" },
    { value: "URL_REGEX", label: "Palavras-chave" },
  ];

  return (
    <div id="acls-page">
      <h1>ACLs</h1>
      <div className="filter-header">
        <AddButton text="+ Adicionar ACL" />
        <Select
          label="Filtrar por ACLs baseadas em: "
          options={aclTypes}
          value={selectedAclType}
          onChange={(e) => setSelectedAclType(e.target.value)}
        />
      </div>
      <p>{selectedAclType}</p>
    </div>
  );
};

export default AclsPage;
