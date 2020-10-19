import React, { Component } from "react";
import Chart from "react-apexcharts";
import car from "../car-img.png";
import "./FicheTechnique.css";
import { getfiche } from "../../../services/vehiculeService";
import { toast } from "react-toastify";
import money from "../../../img/money.svg";
import fuel from "../../../img/fuel.svg";
import maintenance from "../../../img/maintenance.svg";
import error from "../../../img/error.svg";
import Carburant from "../Carburant";
class FicheTechnique extends Component {
  state = {
    infoGeneral: {
      marque: "",
      model: "",
      matricule: "",
      kilometrage: "",
      status: "",
      year: "",
      categorie: "",
      region: "",
    },
    nb_panne: "",
    cout_total: "",
    cout_carburant: "",
    cout_maintenance: "",
    cout_carburant_mois: [],
    cout_maintenance_mois: [],
    cout_total_mois: [],
  };

  async componentDidMount() {
    const { id } = this.props.match.params;
    try {
      const { data } = await getfiche(id);
      const {
        infoGeneral,
        nb_panne,
        cout_total,
        cout_carburant,
        cout_maintenance,
        cout_carburant_mois,
        cout_maintenance_mois,
        cout_total_mois,
      } = this.mapinfo(data);

      this.setState({
        infoGeneral,
        nb_panne,
        cout_total,
        cout_carburant,
        cout_maintenance,
        cout_carburant_mois,
        cout_maintenance_mois,
        cout_total_mois,
      });
    } catch (error) {
      console.log(error);
    }
  }

  mapBarOption = (color, title) => {
    return {
      chart: {
        id: "basic-bar",
      },
      xaxis: {
        categories: [
          "janv.",
          "févr.",
          "mars",
          "avr.",
          "mai",
          "juin",
          "juill.",
          "août",
          "sept.",
          "oct.",
          "nov.",
          "déc.",
        ],
      },
      colors: color,
      title: {
        text: title,
        align: "left",
        margin: 10,
        offsetX: 0,
        offsetY: 0,
        floating: false,
        style: {
          fontSize: "14px",
          fontWeight: "bold",
          fontFamily: undefined,
          color: "#263238",
        },
      },
    };
  };

  mapSeries = (name, data) => {
    return [
      {
        name: name,
        data: data,
      },
    ];
  };

  mapBarOption = (color, title) => {
    return {
      chart: {
        id: "basic-bar",
      },
      xaxis: {
        categories: [
          "janv.",
          "févr.",
          "mars",
          "avr.",
          "mai",
          "juin",
          "juill.",
          "août",
          "sept.",
          "oct.",
          "nov.",
          "déc.",
        ],
      },
      colors: color,
      title: {
        text: title,
        align: "left",
        margin: 10,
        offsetX: 0,
        offsetY: 0,
        floating: false,
        style: {
          fontSize: "14px",
          fontWeight: "bold",
          fontFamily: undefined,
          color: "#263238",
        },
      },
    };
  };

  mapinfo = (data) => {
    const { infoGeneral: info } = data;
    return {
      infoGeneral: {
        marque: info.Model.Marque.nom,
        model: info.Model.nom,
        matricule: info.matricule,
        kilometrage: info.kilometrage,
        status: info.status,
        year: info.year,
        categorie: info.Categorie.nom,
        region: info.User.Caserne.Region.nom,
      },
      nb_panne: data.nb_panne,
      cout_total: data.cout_total,
      cout_carburant: data.cout_total,
      cout_maintenance: data.cout_maintenance,
      cout_carburant_mois: data.cout_carburant_mois,
      cout_maintenance_mois: data.cout_maintenance_mois,
      cout_total_mois: data.cout_total_mois,
    };
  };

  renderInfo = (info) => {
    return (
      <div className="info">
        <img src={car} alt="car img" />

        <div className="col">
          <span>
            <span className="military">Marque</span> : {info.marque}{" "}
          </span>
          <span>
            <span className="military">Model</span>: {info.model}
          </span>
          <span>
            <span className="military">Categorie</span> : {info.categorie}
          </span>
          <span>
            <span className="military">matricule</span> :{info.matricule}
          </span>
        </div>

        <div className="col">
          <span>
            <span className="military">Region</span>: {info.region}
          </span>
          <span>
            <span className="military">Annèe</span>: {info.year}
          </span>
          <span>
            <span className="military">kilometrage</span> : {info.kilometrage}
          </span>
          <span>
            <span className="military">Status</span> : {info.status}
          </span>
        </div>
      </div>
    );
  };

  render() {
    const infoGeneral = this.renderInfo(this.state.infoGeneral);
    return (
      <div className="page-content">
        <h1 className=" dark">Fiche Technique</h1>
        <div id="basic-info">
          {infoGeneral}
          <div className="indicateur-container">
            <span className="indicateur">
              <div>
                <span className="primary">{this.state.nb_panne}</span>
                <span className="second">Nombre de panne</span>
              </div>
              <img src={error} alt="voiture" />
            </span>
            <span className="indicateur">
              <div>
                <span className="primary">{this.state.cout_carburant} DA</span>
                <span className="second">Cout de Carburant</span>
              </div>
              <img src={fuel} alt="voiture" />
            </span>
            <span className="indicateur">
              <div>
                <span className="primary">
                  {this.state.cout_maintenance} DA
                </span>
                <span className="second">Cout de Maintenance</span>
              </div>
              <img src={maintenance} alt="voiture" />
            </span>
            <span className="indicateur">
              <div>
                <span className="primary">{this.state.cout_total} DA</span>
                <span className="second">Cout Total</span>
              </div>
              <img src={money} alt="voiture" />
            </span>
          </div>
          <div className="char-back full-width">
            <Chart
              options={this.mapBarOption(["#ffa600"], "Cout Total En DA")}
              series={this.mapSeries(
                "Cout Total En DA",
                this.state.cout_total_mois
              )}
              type="area"
              height="300px"
            />
          </div>
          <div className="chart-group">
            <div className="char-back ">
              <Chart
                options={this.mapBarOption(["#00E396"], "Cout du carburant")}
                series={this.mapSeries(
                  "Cout Carburant",
                  this.state.cout_carburant_mois
                )}
                type="bar"
              />
            </div>
            <div className="char-back ">
              <Chart
                options={this.mapBarOption(["#00E396"], "Cout du Maintenance")}
                series={this.mapSeries(
                  "Cout Maintenance",
                  this.state.cout_maintenance_mois
                )}
                type="bar"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default FicheTechnique;
