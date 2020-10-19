import React, { Component } from "react";
import Joi from "joi-browser";
import _ from "lodash";
import { toast } from "react-toastify";
import { getRegions } from "../../services/regionService";
import { createUser, updateUser, getUser } from "../../services/usersService";
import Form from "../reusable/Form";

class AjouterUtilisateur extends Form {
  state = {
    data: {
      email: "",
      pass: "",
      region_id: "",
      caserne_id: "",
      role: "",
    },
    regions: [],
    casernes: [],
    errors: {},
  };

  roles = ["admin", "user"];

  schema = {
    email: Joi.string().email().required().label("Email"),
    pass: Joi.string().required().label("Password"),
    region_id: Joi.string().required().label("Region"),
    caserne_id: Joi.string().required().label("Model"),
    role: Joi.string().required().label("Role"),
  };

  mapUser = (user) => {
    return {
      email: user.email,
      pass: "default",
      region_id: user.Caserne.region_id,
      caserne_id: user.Caserne.id,
      role: user.role,
    };
  };
  async componentDidMount() {
    /**** get regions ***/
    try {
      const { data: regions } = await getRegions();
      this.setState({ regions });
    } catch (error) {
      console.log(error);
    }

    const { id } = this.props.match.params;
    console.log(id);

    if (id) {
      try {
        const { data: user } = await getUser(id);
        const data = this.mapUser(user);
        this.setState({ data });
      } catch (error) {
        window.location = "/not-found";
      }
    }
  }

  doSubmit = async () => {
    // call the sever
    try {
      const { id } = this.props.match.params;
      const { data } = this.state;
      const omited = _.omit(data, ["region_id"]);

      if (!id) {
        await createUser(omited);
      } else {
        await updateUser(omited, id);
      }
      window.location = "/utilisateurs";
    } catch (error) {
      toast.error(error.response.data);
      console.log(error);
    }
  };

  render() {
    const title = this.props.match.params.id ? "Modifier" : "Ajouter";
    return (
      <div className="page-content">
        <h1>{title} Utilisateur</h1>
        <div className="form-container">
          <form onSubmit={this.handleSubmit}>
            {this.renderInput("email", "Email")}
            {this.renderInput("pass", "Passwrod", "password")}
            {this.renderSelect("region_id", "Region", this.state.regions)}
            {this.renderSelect("caserne_id", "Caserne", this.state.casernes)}
            {this.renderSelect("role", "Role", this.roles)}
            <button className="btn btn-military" disabled={this.validate()}>
              {title === "Modifier" ? "Enregistrer" : "Ajouter"}
            </button>
          </form>
        </div>
      </div>
    );
  }
}

export default AjouterUtilisateur;
