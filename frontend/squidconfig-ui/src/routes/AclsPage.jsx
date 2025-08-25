import React from "react";
import "./AclsPage.css";
import AddButton from "../components/AddButton";

const AclsPage = () => {
  return (
    <div id="acls-page">
      <h1>ACLs</h1>
      <AddButton text="+ Adicionar ACL" />
    </div>
  );
};

export default AclsPage;
