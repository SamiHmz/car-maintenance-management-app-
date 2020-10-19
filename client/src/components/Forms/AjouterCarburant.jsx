import React, { Component } from "react";
import Form from "../reusable/Form";
import Joi from "joi-browser";
import { toast } from "react-toastify";
import {
  addCarburant,
  getOneCaburant,
  updateCaburant,
} from "../../services/carburantService";

class AjouterCarburant extends Form {
  state = {
    data: {
      matricule: "",
      volume: "",
      cout: "",
      date: "",
    },
    errors: {},
  };

  mapCarburant = (carburant) => {
    return {
      matricule: carburant.vehicule_id,
      volume: carburant.volume,
      cout: carburant.cout,
      date: carburant.date,
    };
  };
  schema = {
    matricule: Joi.string().required().label("Matricule"),
    volume: Joi.number().required().min(1).label("Volume"),
    cout: Joi.number().required().min(1).label("cout"),
    date: Joi.string().required().label("Date"),
  };

  async componentDidMount() {
    const { id } = this.props.match.params;
    if (id) {
      try {
        const { data: carburant } = await getOneCaburant(id);
        const data = this.mapCarburant(carburant);
        this.setState({ data });
      } catch (error) {
        toast.error(error.response.data);
      }
    }
  }

  doSubmit = async () => {
    try {
      const { id } = this.props.match.params;
      const { data } = this.state;
      if (!id) {
        await addCarburant(data);
      } else {
        await updateCaburant(id, data);
      }
      window.location = "/carburant";
    } catch (error) {
      toast.error(error.response.data);
    }
  };

  unité = ["jour", "semaine", "Mois", "année"];

  render() {
    const title = this.props.match.params.id ? "Modifier" : "Ajouter";
    return (
      <div className="page-content">
        <h1>{title} Carburant</h1>
        <div className="form-container">
          <form onSubmit={this.handleSubmit}>
            {this.renderInput("matricule", "Matricule")}
            {this.renderInput("volume", "Volume")}
            {this.renderInput("cout", "Cout", "text")}
            {this.renderInput("date", "Date", "datetime-local")}
            <button className="btn btn-military" disabled={this.validate()}>
              {title === "Modifier" ? "Enregistrer" : "Ajouter"}
            </button>
          </form>
        </div>
      </div>
    );
  }
}

export default AjouterCarburant;
