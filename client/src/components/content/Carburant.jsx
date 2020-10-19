import React, { Component } from "react";
import car from "./car-img.png";
import { getCaburant, deleteCaburant } from "../../services/carburantService";
import { Link } from "react-router-dom";
import Dots from "../reusable/dots/dots";
import date from "date-and-time";

class Carburant extends Component {
  state = {
    listCarburant: [],
  };

  filtred = [];

  async componentDidMount() {
    try {
      const { data: listCarburant } = await getCaburant();
      this.setState({ listCarburant });
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
      this.filtred = this.state.listCarburant.filter((item) =>
        item.matricule.toLowerCase().startsWith(searchValue.toLowerCase())
      );
    }
  }

  deleteCaburant = async (id) => {
    const oldListCarubrant = [...this.state.listCarburant];
    try {
      const listCarburant = oldListCarubrant.filter((item) => item.id !== id);
      this.setState({ listCarburant });
      await deleteCaburant(id);
    } catch (error) {
      console.log(error);
      this.setState({ vehicule: oldListCarubrant });
    }
  };

  renderCarburant = (list) => {
    const pattern = date.compile("dddd, MMM DD YYYY");
    return list.map((item) => {
      return (
        <React.Fragment>
          <tr class="date">
            <td colSpan="5">{date.format(new Date(item.date), pattern)}</td>
          </tr>
          <tr>
            <td>
              <div class="car-info">
                <img src={car} alt="car img" />
                <div>
                  <h4>
                    {item.nom_model} {item.marque_nom} [{item.matricule}]
                  </h4>
                  <h5 class="light">
                    {" "}
                    {item.status} - {item.categorie}
                  </h5>
                </div>
              </div>
            </td>
            <td>{date.format(new Date(item.date), "HH:mm")}</td>
            <td>{item.volume} L</td>
            <td>{item.cout} DA</td>
            <td>
              <Dots
                id={item.id}
                onDelete={this.deleteCaburant}
                url="carburant"
              />
            </td>
          </tr>
        </React.Fragment>
      );
    });
  };

  render() {
    const carburant =
      this.props.searchValue === ""
        ? this.renderCarburant(this.state.listCarburant)
        : this.renderCarburant(this.filtred);
    return (
      <div className="page-content">
        <div className="first-element">
          <h1 className=" dark">Carburant</h1>
          <div>
            <span className="btn btn-dark">
              <span>Importer List</span>
              <i className="fas fa-share-square"></i>
            </span>
            <Link to="/carburant/ajouterCarburant">
              <span className="btn btn-military">
                <span>Ajouter Carburant</span>
                <i class="fas fa-plus"></i>
              </span>
            </Link>
          </div>
        </div>
        <div class="list">
          <table>
            <thead>
              <tr>
                <th>Véhicule</th>
                <th>Heure</th>
                <th>volume</th>
                <th>Cout</th>
                <th></th>
              </tr>
            </thead>
            <tbody>{carburant}</tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default Carburant;
