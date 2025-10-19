import React, { useState } from "react";
import "./AclsPage.css";
import Button from "../components/Button";
import Select from "../components/Select";
import AclsForm from "../components/AclsForm";
import DirectivesForm from "../components/AclDirectivesForm";
import Acl from "../components/Acl";

const AclsPage = () => {
  const [selectedAclType, setSelectedAclType] = useState("ALL");
  const [activeForm, setActiveForm] = useState(null);

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
            <Acl
              aclName="rede_local2"
              aclType="src"
              aclValues={[
                "192.168.0.0/24",
                "192.168.1.0/24",
                "10.0.0.0/8",
                "172.16.0.0/12",
                "192.168.56.0/24",
                "192.168.100.0/24",
                "200.200.200.0/24",
                "10.10.10.0/24",
                "192.168.10.0/24",
                "192.168.11.0/24",
                "192.168.12.0/24",
                "192.168.13.0/24",
                "192.168.14.0/24",
                "192.168.15.0/24",
                "10.0.1.0/24",
                "10.0.2.0/24",
                "10.0.3.0/24",
                "192.168.200.0/24",
                "192.168.201.0/24",
                "192.168.202.0/24",
              ]}
              onAddDirective={() => setActiveForm("addDirective")}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default AclsPage;
