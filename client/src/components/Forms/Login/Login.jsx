import React, { Component } from "react";
import Joi from "joi-browser";
import { Link } from "react-router-dom";
import Form from "../../reusable/Form";
import { login } from "../../../services/authService";
import logo from "../../../img/logo.png";
import "./Login.css";
import { ToastContainer, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
class Login extends Form {
  state = {
    data: {
      email: "gs_hamaizi@esi.dz",
      pass: "123456$Hh",
    },
    errors: {},
  };

  schema = {
    email: Joi.string().email().required().label("Email"),
    pass: Joi.string().required().label("Password"),
  };

  doSubmit = async () => {
    try {
      const { data } = this.state;
      await login(data.email, data.pass);
      window.location = "/dashboard";
    } catch (error) {
      if (error.response && error.response.status === 400) {
        const { errors } = { ...this.state };
        toast.error(error.response.data);
        this.setState({ errors });
      }
    }
  };

  render() {
    return (
      <div id="Login">
        <ToastContainer />
        <img src={logo} alt="logo img" id="logo" />

        <div className="form-container">
          <h1 className="dark">Se Connecter</h1>
          <form onSubmit={this.handleSubmit}>
            {this.renderInput("email", "Email")}
            {this.renderInput("pass", "Password", "password")}
            {/* <Link to="/dashboard"> */}
            <button className="btn btn-military">Se connecter</button>
            {/* </Link> */}
          </form>
          <h2 className="military">mot de passe oublié?</h2>
        </div>
      </div>
    );
  }
}

export default Login;
