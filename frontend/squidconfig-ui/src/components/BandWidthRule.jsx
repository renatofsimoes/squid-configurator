import React from "react";
import "./BandWidthRule.css";
import Button from "./Button";

const BandWidthRule = ({
  poolId,
  lines = [],
  onDeletePool,
  onDeleteDelayPools,
}) => {
  const isDelayPoolsGroup = poolId === "delay_pools";

  return (
    <div className="bw-rule">
      <div className="bw-rule-top">
        <h2>{isDelayPoolsGroup ? "delay_pools" : `Pool ${poolId}`}</h2>
        <div className="bw-rule-buttons">
          {isDelayPoolsGroup ? (
            <Button
              className="delete-bw-pool-btn"
              iClass="fa-solid fa-trash-alt"
              onClick={onDeleteDelayPools}
            />
          ) : (
            <Button
              className="delete-bw-pool-btn"
              iClass="fa-solid fa-trash-alt"
              onClick={onDeletePool}
            />
          )}
        </div>
      </div>

      <p className="bwrt">Regras:</p>
      <div className="bw-rule-lines">
        {lines.map((l, i) => (
          <div key={i} className="bw-line">
            <code>{l.rawLine}</code>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BandWidthRule;
