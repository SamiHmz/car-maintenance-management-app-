import Form from "../reusable/Form";
import React, { Component } from "react";
import Joi from "joi-browser";
import { toast } from "react-toastify";

import {
  updateMission,
  addMission,
  getOneMission,
} from "../../services/missionService";
import Mission from "../content/mission";
class AjouterMission extends Form {
  state = {
    data: {
      matricule: "",
      distance: "",
      vitesse: "",
      date_entrer: "",
      date_sortie: "",
    },
    errors: {},
  };

  mapMission = (mission) => {
    return {
      matricule: mission.vehicule_id,
      distance: mission.distance,
      vitesse: mission.vitesse,
      date_entrer: mission.date_entrer,
      date_sortie: mission.date_sortie,
    };
  };

  schema = {
    matricule: Joi.string().required().label("Matricule"),
    distance: Joi.number().required().min(1).label("Distance"),
    vitesse: Joi.number().required().min(1).label("Vitesse"),
    date_entrer: Joi.string().required().label("Date Entrer"),
    date_sortie: Joi.string().required().label("Date Sortie"),
  };

  async componentDidMount() {
    const { id } = this.props.match.params;
    if (id) {
      try {
        const { data: mission } = await getOneMission(id);
        const data = this.mapMission(mission);
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
        await addMission(data);
      } else {
        await updateMission(data, id);
      }
      window.location = "/mission";
    } catch (error) {
      toast.error(error.response.data);
    }
  };

  render() {
    const title = this.props.match.params.id ? "Modifier" : "Ajouter";

    return (
      <div className="page-content">
        <h1> {title} Mission</h1>
        <div className="form-container">
          <form onSubmit={this.handleSubmit}>
            {this.renderInput("matricule", "Matricule")}
            {this.renderInput("distance", "Distance")}
            {this.renderInput("vitesse", "Vitesse")}
            {this.renderInput("date_entrer", "Date Entrer", "datetime-local")}
            {this.renderInput("date_sortie", "Date Sortie", "datetime-local")}
            <button className="btn btn-military" disabled={this.validate()}>
              {title === "Modifier" ? "Enregistrer" : "Ajouter"}
            </button>
          </form>
        </div>
      </div>
    );
  }
}

export default AjouterMission;
