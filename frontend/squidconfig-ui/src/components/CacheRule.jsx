import React from "react";
import "./CacheRule.css";
import Button from "./Button";

const CacheRule = ({ rule, onEdit, onDelete }) => {
  const params = Array.isArray(rule.params) ? rule.params : [rule.params];

  return (
    <div className="cache-rule">
      <div className="cache-rule-content">
        <div className="cache-rule-top">
          <h2>{rule.type}</h2>

          <div className="cache-rule-buttons">
            <Button
              className="edit-cache-rule-btn"
              iClass="fa-solid fa-pen"
              onClick={() => onEdit(rule)}
            />
            <Button
              className="delete-cache-rule-btn"
              iClass="fa-solid fa-trash-alt"
              onClick={() => onDelete(rule)}
            />
          </div>
        </div>

        <div className="cache-rule-bottom">
          <p>Parâmetros:</p>
          <div className="cache-rule-params">
            {params && params.length > 0 ? (
              params.map((p, index) => (
                <div key={index} className="cache-rule-param-item">
                  {p}
                </div>
              ))
            ) : (
              <span className="value-empty">(nenhum parâmetro informado)</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CacheRule;
