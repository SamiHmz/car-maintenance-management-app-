import React, { Component } from "react";
import Joi from "joi-browser";
import Input from "./input";
import Select from "./Select";
import { getmodels } from "../../services/modelService";
import { getCategories } from "../../services/categorieService";
import { getCasernes } from "../../services/caserneService";
import { checkValidState } from "../../services/usefullFunctionService";
import "./Form.css";
class Form extends Component {
  state = {
    data: {},
    errors: {},
  };
  /********************** validate form submit *********************/
  validate = () => {
    if (checkValidState(this.state.data)) {
      return false;
    }

    const abortEarly = { abortEarly: false };
    const errors = {};
    const { error } = Joi.validate(this.state.data, this.schema, abortEarly);

    if (error == null) return;
    else {
      for (let item of error.details) {
        errors[item.path[0]] = item.message;
      }
      return errors;
    }
  };
  /********************** validate Field *********************/

  validateField = ({ id, value }) => {
    /*********field you want to validate*******/
    const obj = { [id]: value };
    /****** subSchema****/
    const schema = { [id]: this.schema[id] };
    /********** we donot abort early because we just want that one eror displayed *******/
    const { error } = Joi.validate(obj, schema);
    // if (error === null) console.log(error);
    // else console.log(error.details[0].message);
    return error ? error.details[0].message : null;
  };

  /**********************  handle form submit  *********************/

  handleSubmit = (e) => {
    e.preventDefault();
    const errors = this.validate();
    this.setState({ errors: errors || {} });
    this.doSubmit();
  };

  /********************************* handle change ********************************/
  handleChange = async ({ target: input }) => {
    const errors = this.state.errors;
    const errorMessage = this.validateField(input);
    /**********if errorMessage defined then set the error state to that message else delete the property from the state*********/
    if (errorMessage) errors[input.name] = errorMessage;
    else delete errors[input.name];
    const data = { ...this.state.data };
    data[input.id] = input.value;
    this.setState({ data, errors });

    /************ seting the models dpend on the marque selected*******/
    if (input.id === "marque_id") {
      try {
        const { data: models } = await getmodels(input.value);
        this.setState({ models });
      } catch (error) {
        console.log(error.response);
      }
    }
    /************ seting the caserne depend on the marque selected*******/
    if (input.id === "region_id") {
      try {
        const { data: casernes } = await getCasernes(input.value);
        this.setState({ casernes });
      } catch (error) {
        console.log(error.response);
      }
    }
  };

  /****************************Submit Button ************************************/

  renderButton = (label) => {
    return (
      <button
        disabled={Object.keys(this.state.errors).length === 0 ? false : true}
        className="btn btn-primary"
      >
        {label}
      </button>
    );
  };

  /************************  Extracting Input *******************************************/
  renderInput = (name, label, type = "text") => {
    const { data, errors } = this.state;

    return (
      <Input
        type={type}
        handleChange={this.handleChange}
        name={name}
        value={data[name]}
        lable={label}
        error={errors[name]}
      />
    );
  };
  /****************************** Extracting select**************************************/
  renderSelect = (name, label, options) => {
    const { data, errors } = this.state;
    return (
      <Select
        handleChange={this.handleChange}
        name={name}
        id={name}
        value={data[name]}
        label={label}
        error={errors[name]}
        options={options}
      />
    );
  };
}

export default Form;
