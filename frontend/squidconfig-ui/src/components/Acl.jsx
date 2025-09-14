import React from "react";
import "./Acl.css";
import Button from "./Button";

const Acl = ({ aclNme, aclType, aclValues }) => {
  return (
    <div className="acl">
      <div className="acl-content">
        <div className="acl-top">
          <h2>{aclNme}</h2>
          <div>
            Tipo: <b>{aclType}</b>
          </div>
        </div>
        <div className="acl-bottom">
          <p>Valores:</p>
          <div className="values">{aclValues}</div>
        </div>
      </div>
      <div className="acl-buttons">
        <Button className="delete-acl-btn" iClass="fa-solid fa-delete-left" />
      </div>
    </div>
  );
};

export default Acl;
