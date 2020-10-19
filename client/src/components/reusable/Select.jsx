import React from "react";
const Select = ({ id, name, label, error, handleChange, options }) => {
  let mapOption = "";

  if (typeof options[0] === "object") {
    mapOption = options.map((option) => (
      <option value={option.id}>{option.nom}</option>
    ));
  } else {
    mapOption = options.map((option) => (
      <option value={option}>{option}</option>
    ));
  }

  return (
    <div className="form-group">
      <label htmlFor={id}>{label}</label>
      <select
        className="form-control"
        name={name}
        id={id}
        onChange={handleChange}
      >
        <option value="" />
        {mapOption}
      </select>
      {error && <div className="alert">{error}</div>}
    </div>
  );
};

export default Select;
