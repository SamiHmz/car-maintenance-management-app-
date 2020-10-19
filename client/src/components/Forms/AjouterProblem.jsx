import React, { Component } from "react";
import Form from "../reusable/Form";
import Joi from "joi-browser";
import { toast } from "react-toastify";
import _ from "lodash";
import {
  addProblem,
  getOneProblem,
  updateProblem,
} from "../../services/problemService";
class AjouterProblem extends Form {
  state = {
    data: {
      matricule: "",
      nom: "",
      description: "",
      etat: "",
      date: "",
    },
    errors: {},
  };

  schema = {
    matricule: Joi.string().required().label("Matricule"),
    nom: Joi.string().required().label("Problem"),
    etat: Joi.string().required().label("Etat"),
    description: Joi.string().label("Description"),
    date: Joi.string().required().label("Date"),
  };

  mapProblem = (problem) => {
    return {
      matricule: problem.vehicule_id,
      nom: problem.nom,
      description: problem.description,
      etat: problem.etat,
      date: problem.date,
    };
  };
  doSubmit = async () => {
    const { id } = this.props.match.params;
    const { data } = this.state;

    try {
      if (!id) {
        await addProblem(data);
      } else {
        await updateProblem(data, id);
      }
      window.location = "/problem";
    } catch (error) {
      toast.error(error.response.data);
    }
    console.log("submit handled");
  };

  async componentDidMount() {
    const { id } = this.props.match.params;

    if (id) {
      try {
        const { data: problem } = await getOneProblem(id);
        const data = this.mapProblem(problem);
        this.setState({ data });
      } catch (error) {
        window.location = "/not-found";
      }
    }
  }

  etats = ["En panne", "Reparè", "En cours de reparation"];
  render() {
    return (
      <div className="page-content">
        <h1>Ajouter Problem</h1>
        <div className="form-container">
          <form onSubmit={this.handleSubmit}>
            {this.renderInput("matricule", "Matricul Vehicule")}
            {this.renderInput("nom", "Problem")}
            {this.renderSelect("etat", "Etat ", this.etats)}
            {this.renderInput("description", "Description")}
            {this.renderInput("date", "Date", "datetime-local")}
            <button className="btn btn-military" disabled={this.validate()}>
              Ajouter
            </button>
          </form>
        </div>
      </div>
    );
  }
}

export default AjouterProblem;
