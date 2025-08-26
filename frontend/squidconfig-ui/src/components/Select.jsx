import React from "react";
import "./Select.css";

const Select = ({ label, options, value, onChange }) => {
  return (
    <div id="filter-select">
      {label && <label>{label}</label>}
      <select value={value} onChange={onChange}>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
