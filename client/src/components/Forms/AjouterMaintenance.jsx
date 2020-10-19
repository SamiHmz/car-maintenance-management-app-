import React, { Component } from "react";
import Joi from "joi-browser";
import Form from "../reusable/Form";
import _ from "lodash";
import { getMaintenances } from "../../services/maintenanceService";
import {
  addVehiculesMaintenance,
  getOneMaintenanceVehicule,
  updateVehiculesMaintenance,
} from "../../services/VehiculeMaintenanceService";
import { toast } from "react-toastify";

class AjouterMaintenance extends Form {
  state = {
    data: {
      matricule: "",
      maintenance_id: "",
      frequence_km: "",
      interval: "",
      unit: "",
    },
    maintenances: [],
    errors: {},
  };

  mapVehiculeMaintenance = (VehiculeMaintenance) => {
    return {
      matricule: VehiculeMaintenance.vehicule_id,
      maintenance_id: VehiculeMaintenance.maintenance_id,
      frequence_km: VehiculeMaintenance.frequence_km,
      interval: VehiculeMaintenance.interval,
      unit: VehiculeMaintenance.unit,
    };
  };

  schema = {
    matricule: Joi.string().required().label("Matricule"),
    maintenance_id: Joi.string().required().label("maintenance"),
    frequence_km: Joi.number().min(500).label("Frequence Km"),
    interval: Joi.number().required().label("Intevbal Temps"),
    unit: Joi.string().required().label("Unité"),
  };

  async componentDidMount() {
    try {
      const { data: maintenances } = await getMaintenances();
      this.setState({ maintenances });
    } catch (error) {
      console.log(error);
    }
    console.log(this.validate());
    const { id } = this.props.match.params;
    if (id) {
      try {
        const { data: maintenaneVehicule } = await getOneMaintenanceVehicule(
          id
        );
        const data = this.mapVehiculeMaintenance(maintenaneVehicule);
        this.setState({ data });
      } catch (error) {
        window.location = "/not-found";
      }
    }
  }

  doSubmit = async () => {
    try {
      const { id } = this.props.match.params;
      if (!id) {
        await addVehiculesMaintenance(this.state.data);
      } else {
        await updateVehiculesMaintenance(this.state.data, id);
      }
      window.location = "/maintenance";
    } catch (error) {
      toast.error(error.response.data);
    }
  };
  unité = ["jour", "semaine", "mois", "annee"];

  render() {
    const title = this.props.match.params.id ? "Modifier" : "Ajouter";
    return (
      <div className="page-content">
        <h1>{title} Maintenance</h1>
        <div className="form-container">
          <form onSubmit={this.handleSubmit}>
            {this.renderInput("matricule", "Matricule")}
            {this.renderSelect(
              "maintenance_id",
              "Maintenance  ",
              this.state.maintenances
            )}
            {this.renderInput("frequence_km", "Frequence Km")}
            {this.renderSelect("unit", "Unité ", this.unité)}
            {this.renderInput("interval", "Interval Temps")}
            <button className="btn btn-military" disabled={this.validate}>
              {title === "Modifier" ? "Enregistrer" : "Ajouter"}
            </button>
          </form>
        </div>
      </div>
    );
  }
}

export default AjouterMaintenance;
