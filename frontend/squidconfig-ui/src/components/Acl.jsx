import React from "react";
import "./Acl.css";
import Button from "./Button";

const Acl = ({
  aclName,
  aclType,
  aclValues,
  directives,
  onAddDirective,
  onDeleteAcl,
  onRemove,
}) => {
  const values = Array.isArray(aclValues) ? aclValues : [aclValues];
  const dValues = Array.isArray(directives) ? directives : [directives];

  return (
    <div className="acl">
      <div className="acl-content">
        <div className="acl-top">
          <h2>{aclName}</h2>
          <div>
            Tipo: <b>{aclType}</b>
          </div>
          <div className="acl-buttons">
            <Button
              className="add-acl-values-btn"
              iClass="fa-solid fa-plus"
              onClick={onAddDirective}
            />
            <Button
              className="remove-acl-values-btn"
              iClass="fa-solid fa-minus"
              onClick={onRemove}
            />
            <Button
              className="delete-acl-btn"
              iClass="fa-solid fa-trash-alt"
              onClick={() => onDeleteAcl(aclName)} //chama função passada pelo pai
            />
          </div>
        </div>

        <div className="acl-bottom">
          <p>Valores:</p>
          <div className="values">
            {values.map((value, index) => (
              <div key={index} className="value-item">
                {value}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="acl-directives">
        <p>Diretivas:</p>

        {dValues && dValues.length > 0 ? (
          <div className="dValues">
            {dValues.map((dValue, index) => (
              <div key={index} className="dValue-item">
                {dValue}
              </div>
            ))}
          </div>
        ) : (
          <span className="value-empty">(nenhuma diretiva associada)</span>
        )}
      </div>
    </div>
  );
};

export default Acl;
