import React, { Component } from "react";
import Form from "../reusable/Form";
import Joi from "joi-browser";
import _ from "lodash";
import { toast } from "react-toastify";
import { getMarques } from "../../services/marqueService";
import { getCategories } from "../../services/categorieService";
import {
  addVehicule,
  getOneVehicule,
  updateVehicule,
} from "../../services/vehiculeService";
class AjouterVehicule extends Form {
  state = {
    data: {
      matricule: "",
      marque_id: "",
      model_id: "",
      kilometrage: "",
      status: "",
      year: "",
      categorie_id: "",
    },
    marques: [],
    models: [],
    categories: [],
    errors: {},
  };

  schema = {
    matricule: Joi.string().required().label("Matricule"),
    marque_id: Joi.string().required().label("Marque"),
    model_id: Joi.string().required().label("Model"),
    kilometrage: Joi.number().required().label("Kilometrage"),
    status: Joi.string().required().label("Status"),
    year: Joi.number().required().min(1900).max(2020).label("annèe"),
    categorie_id: Joi.string().required().label("categorie"),
  };

  mapVehicule = (vehicule) => {
    return {
      matricule: vehicule.matricule,
      marque_id: vehicule.Model.marque_id,
      model_id: vehicule.model_id,
      kilometrage: vehicule.kilometrage,
      status: vehicule.status,
      year: vehicule.year,
      categorie_id: vehicule.categorie_id,
    };
  };

  async componentDidMount() {
    /**** get marques ***/
    try {
      const { data: marques } = await getMarques();
      this.setState({ marques });
    } catch (error) {
      console.log(error);
    }

    const { id } = this.props.match.params;

    if (id) {
      try {
        const { data: vehicule } = await getOneVehicule(id);
        const data = this.mapVehicule(vehicule);
        this.setState({ data });
      } catch (error) {
        window.location = "/not-found";
      }
    }

    /**** get categories ***/

    try {
      const { data: categories } = await getCategories();
      this.setState({ categories });
    } catch (error) {
      console.log(error);
    }
  }

  categories = ["Sami Hamaizi", "Amir Hamaizi", "Wiam Hamaizi", "Reda Hamaizi"];
  status = ["Active", "En panne", "Pas active"];

  doSubmit = async () => {
    // call the sever
    try {
      const { id } = this.props.match.params;
      const { data } = this.state;
      const omited = _.omit(data, ["marque_id"]);

      if (!id) {
        await addVehicule(omited);
      } else {
        await updateVehicule(omited);
      }
      window.location = "/vehicules";
    } catch (error) {
      toast.error(error.response.data);
    }
  };

  render() {
    const title = this.props.match.params.id ? "Modifier" : "Ajouter";
    return (
      <div className="page-content">
        <h1>{title} Vehicule</h1>
        <div className="form-container">
          <form onSubmit={this.handleSubmit}>
            {this.renderInput("matricule", "Matricule")}
            {this.renderInput("kilometrage", "Kilometrage")}
            {this.renderSelect("marque_id", "Marque", this.state.marques)}
            {this.renderSelect("model_id", "Model", this.state.models)}
            {this.renderSelect(
              "categorie_id",
              "Categorie",
              this.state.categories
            )}
            {this.renderSelect("status", "Status", this.status)}
            {this.renderInput("year", "Annèe")}
            <button className="btn btn-military" disabled={this.validate()}>
              {title === "Modifier" ? "Enregistrer" : "Ajouter"}
            </button>
          </form>
        </div>
      </div>
    );
  }
}

export default AjouterVehicule;
