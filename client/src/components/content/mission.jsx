import React, { Component } from "react";
import date from "date-and-time";
import car from "./car-img.png";
import { Link } from "react-router-dom";
import { getMissions, deleteMission } from "../../services/missionService";
import Dots from "../reusable/dots/dots";

class Mission extends Component {
  state = {
    missions: [],
  };

  filtred = [];

  async componentDidMount() {
    try {
      const { data: missions } = await getMissions();
      this.setState({ missions });
    } catch (errors) {
      console.log(errors);
    }
  }
  componentDidUpdate(prevProp) {
    const { searchValue } = { ...this.props };
    if (
      searchValue.toLowerCase() &&
      prevProp.searchValue !== searchValue.toLowerCase()
    ) {
      this.filtred = this.state.missions.filter((item) =>
        item.matricule.toLowerCase().startsWith(searchValue.toLowerCase())
      );
    }
  }

  deleteMission = async (id) => {
    const oldMission = [...this.state.missions];
    try {
      const missions = oldMission.filter((item) => item.id !== id);
      this.setState({ missions });
      await deleteMission(id);
    } catch (error) {
      console.log(error);
      this.setState({ vehicule: oldMission });
    }
  };

  renderMission = (list) => {
    const pattern = date.compile("dddd, MMM DD YYYY");
    return list.map((item) => {
      return (
        <React.Fragment key={item.id}>
          <tr className="date" style={{ height: "20px" }}>
            <td colSpan="6"></td>
          </tr>
          <tr>
            <td>
              <div className="car-info">
                <img src={car} alt="car img" />
                <div>
                  <h4>
                    {item.nom_model} {item.marque_nom} [{item.matricule}]
                  </h4>
                  <h5 className="light">
                    {item.status} - {item.categorie}
                  </h5>
                </div>
              </div>
            </td>
            <td>{date.format(new Date(item.date_entrer), pattern)}</td>
            <td>{date.format(new Date(item.date_sortie), pattern)}</td>
            <td>{item.distance} Km</td>
            <td>{item.vitesse} Km/H</td>
            <td>
              <Dots id={item.id} url="mission" onDelete={this.deleteMission} />
            </td>
          </tr>
        </React.Fragment>
      );
    });
  };

  render() {
    const missions =
      this.props.searchValue === ""
        ? this.renderMission(this.state.missions)
        : this.renderMission(this.filtred);
    return (
      <div className="page-content">
        <div className="first-element">
          <h1 className=" dark">Missions</h1>
          <div>
            <span className="btn btn-dark">
              <span>Importer List</span>
              <i className="fas fa-share-square"></i>
            </span>
            <Link to="/mission/ajouterMission">
              <span className="btn btn-military">
                <span>Ajouter Mission</span>
                <i className="fas fa-plus"></i>
              </span>
            </Link>
          </div>
        </div>
        <div className="list">
          <table>
            <thead>
              <tr>
                <th>Véhicule</th>
                <th>Date Sortie</th>
                <th>Date Entrer</th>
                <th>Distance</th>
                <th>Vitesse</th>
              </tr>
            </thead>
            <tbody>{missions}</tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default Mission;
