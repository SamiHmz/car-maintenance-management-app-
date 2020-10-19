import React, { Component } from "react";

const Input = ({ name, handleChange, lable, error, ...rest }) => {
  return (
    <div className="form-group">
      <label htmlFor={name}>{lable}</label>

      <input
        {...rest}
        name={name}
        onChange={handleChange}
        id={name}
        className="form-control"
      />
      {error && <div className="alert">{error}</div>}
    </div>
  );
};

export default Input;
