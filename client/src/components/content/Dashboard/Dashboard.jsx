import React, { Component } from "react";
import Chart from "react-apexcharts";
import "./dashbord.css";
import car from "../../../img/car.svg";
import money from "../../../img/money.svg";
import fuel from "../../../img/fuel.svg";
import { getDashboardData } from "../../../services/dashboardService";
import Carburant from "../Carburant";
class Dashboard extends Component {
  state = {
    nb_vehicule: "",
    volume_carburant: "",
    total: "",
    cout_total: [],
    maintenance: [],
    carburant: [],
    status_vehicules: [],
    suivi_model: [],
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
  mapPietOption = (labels, title) => {
    return {
      chart: {
        width: 380,
        type: "donut",
      },
      labels: labels,
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
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
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

  async componentDidMount() {
    try {
      const { data } = await getDashboardData();
      const {
        nb_vehicule,
        total,
        volume_carburant,
        cout_total,
        carburant,
        maintenance,
        suivi_model,
      } = data;

      this.setState({
        nb_vehicule,
        total,
        volume_carburant,
        cout_total,
        carburant,
        maintenance,
        suivi_model,
      });
    } catch (error) {}
  }

  mapSuiviModel = (list) => {
    return list.map((item) => {
      return (
        <React.Fragment key={item.model}>
          <tr className="date">
            <td colSpan="7"></td>
          </tr>
          <tr>
            <td>{item.marque}</td>
            <td>{item.model}</td>
            <td>{item.nb_problem === null ? 0 : item.nb_problem}</td>
            <td>{item.cout_carburant === null ? 0 : item.cout_carburant}DA</td>
            <td>
              {item.volume_caburant === null ? 0 : item.volume_caburant} L
            </td>
            <td>
              {item.cout_maintenance === null ? 0 : item.cout_maintenance}Da
            </td>
            <td>{item.nb_mission === null ? 0 : item.nb_mission}</td>
          </tr>
        </React.Fragment>
      );
    });
  };

  render() {
    const suivi_model = this.mapSuiviModel(this.state.suivi_model);
    return (
      <div className="page-content">
        <h1 class=" dark">Dashboard</h1>
        <div id="dashboard">
          <div id="dash-head">
            <span className="indicator">
              <div className="text">
                <span className="number">{this.state.nb_vehicule}</span>
                <span className="head">Nombre De Vehicule</span>
              </div>
              <img src={car} alt="car-pic" />
            </span>

            <span className="indicator">
              <div className="text">
                <span className="number">{this.state.total} Da</span>
                <span className="head">Cout Total</span>
              </div>
              <img src={money} alt="car-pic" />
            </span>

            <span className="indicator">
              <div className="text">
                <span className="number">{this.state.volume_carburant} L</span>
                <span className="head">Consomation Du Carburant</span>
              </div>
              <img src={fuel} alt="car-pic" />
            </span>
          </div>
          <div className="char-back full-width">
            <Chart
              options={this.mapBarOption(["#ffa600"], "Cout Total En DA")}
              series={this.mapSeries("Cout Total En DA", this.state.cout_total)}
              type="area"
              height="300px"
            />
          </div>
          <div className="chart-group">
            <div className="char-back ">
              <Chart
                options={this.mapBarOption(["#00E396"], "Cout du carburant")}
                series={this.mapSeries("Cout Carburant", this.state.carburant)}
                type="line"
              />
            </div>
            <div className="char-back ">
              <Chart
                options={this.mapPietOption(
                  ["Active", "En panne", "Pas active"],
                  "Status des vehicule"
                )}
                series={[5, 2, 1]}
                type="donut"
              />
            </div>
          </div>
          <div className="char-back full-width">
            <Chart
              options={this.mapBarOption(["#008FFB"], "Cout du maintenance")}
              series={this.mapSeries(
                "Cout maintenance En DA",
                this.state.carburant
              )}
              type="bar"
              height="300px"
            />
          </div>
          <div className="list">
            <span id="suivi">Suivi Par Model</span>
            <table>
              <thead>
                <tr>
                  <th>Marque</th>
                  <th>Model</th>
                  <th>Nombre de problem</th>
                  <th>Cout Carburant</th>
                  <th>Carburant consomè</th>
                  <th>Cout Maintenance</th>
                  <th>Nombre mission</th>
                </tr>
              </thead>
              <tbody>{suivi_model}</tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}
export default Dashboard;
