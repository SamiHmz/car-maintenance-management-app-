import React, { Component } from "react";
import car from "./car-img.png";
import { Link } from "react-router-dom";
import date from "date-and-time";
import {
  getVehiculesMaintenance,
  deleteVehiculesMaintenance,
} from "../../services/VehiculeMaintenanceService";
import Dots from "../reusable/dots/dots";

class Maintenance extends Component {
  state = {
    vehiculeMAintenance: [],
  };

  filtred = [];

  async componentDidMount() {
    try {
      const { data: vehiculeMAintenance } = await getVehiculesMaintenance();
      this.setState({ vehiculeMAintenance });
    } catch (error) {
      console.log(error);
    }
  }

  componentDidUpdate(prevProp) {
    const { searchValue } = { ...this.props };
    if (
      searchValue.toLowerCase() &&
      prevProp.searchValue !== searchValue.toLowerCase()
    ) {
      this.filtred = this.state.vehiculeMAintenance.filter((item) =>
        item.matricule.toLowerCase().startsWith(searchValue.toLowerCase())
      );
    }
  }

  deleteVehiculesMaintenance = async (id) => {
    const oldVehiculeMaintenacne = [...this.state.vehiculeMAintenance];
    try {
      const vehiculeMAintenance = oldVehiculeMaintenacne.filter(
        (item) => item.id !== id
      );

      this.setState({ vehiculeMAintenance });
      await deleteVehiculesMaintenance(id);
    } catch (error) {
      console.log(error);
      this.setState({ vehiculeMAintenance: oldVehiculeMaintenacne });
    }
  };

  renderMaintenance = (list) => {
    const pattern = date.compile("dddd, MMM DD YYYY");
    return list.map((item) => {
      return (
        <React.Fragment key={item.id}>
          <tr className="date">
            <td colSpan="5">
              {date.format(new Date(item.date_planification), pattern)}
            </td>
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
            <td>{item.nom}</td>
            <td>{item.frequence_km}</td>
            <td>{item.cout} DA</td>
            <td>
              <Dots
                id={item.id}
                url="maintenance"
                onDelete={this.deleteVehiculesMaintenance}
              />
            </td>
          </tr>
        </React.Fragment>
      );
    });
  };
  render() {
    const vehiculeMAintenance =
      this.props.searchValue === ""
        ? this.renderMaintenance(this.state.vehiculeMAintenance)
        : this.renderMaintenance(this.filtred);
    return (
      <div className="page-content">
        <div className="first-element">
          <h1 className=" dark">Maintenance</h1>
          <div>
            <span className="btn btn-dark">
              <span>Importer List</span>
              <i className="fas fa-share-square"></i>
            </span>
            <Link to="/maintenance/ajoutermaintenace">
              <span className="btn btn-military">
                <span>Ajouter Maintenance</span>
                <i className="fas fa-plus"></i>
              </span>
            </Link>
          </div>
        </div>
        <div>
          <table>
            <thead>
              <tr>
                <th>Véhicule</th>
                <th>Service</th>
                <th>Frequence Km</th>
                <th>Cout</th>
                <th></th>
              </tr>
            </thead>
            <tbody>{vehiculeMAintenance}</tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default Maintenance;
