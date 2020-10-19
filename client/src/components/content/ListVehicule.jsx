import React, { Component } from "react";
import { Link } from "react-router-dom";
import car from "./car-img.png";
import { getVehicules, deleteVehicule } from "../../services/vehiculeService";
import Dots from "../reusable/dots/dots";
import { toast } from "react-toastify";
class ListVehicule extends Component {
  state = {
    vehicules: [],
    isDots: true,
  };

  filtred = [];

  async componentDidMount() {
    try {
      const { data: vehicules } = await getVehicules();
      this.setState({ vehicules });
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
      this.filtred = this.state.vehicules.filter((item) =>
        item.matricule.toLowerCase().startsWith(searchValue.toLowerCase())
      );
    }
  }

  deleteVehicule = async (id) => {
    const oldVehicules = [...this.state.vehicules];
    try {
      const vehicules = oldVehicules.filter((item) => item.matricule !== id);
      this.setState({ vehicules });
      await deleteVehicule(id);
    } catch (error) {
      console.log(error);
      this.setState({ vehicule: oldVehicules });
    }
  };

  renderVehicule = (list) => {
    return list.map((item) => {
      return (
        <div key={item.matricule} id="list-vehicule-item">
          <div>
            <h4>
              {item.Model.Marque.nom} {item.Model.nom} [{item.matricule}]
            </h4>
            <Dots
              id={item.matricule}
              onDelete={this.deleteVehicule}
              url="vehicules"
            />
          </div>
          <div id="car">
            <img src={car} alt="car-img" />
            <div id="car-infos">
              <div>
                <h5>
                  <span>Categorie:</span>
                  {item.Categorie.nom}
                </h5>
                <h5>
                  <span>Status :</span> {item.status}
                </h5>
                <h5>
                  <span>Kilometrage :</span> {item.kilometrage}
                </h5>
              </div>
              <div>
                <h5>
                  <span>Region :</span> {item.User.Caserne.Region.nom}
                </h5>
                <h5>
                  <span>Caserne :</span> {item.User.Caserne.nom}
                </h5>

                <h5>
                  <span>Annèe :</span> {item.year}
                </h5>
              </div>
            </div>
          </div>
          <Link to={`/vehicules/fiche/${item.matricule}`}>
            Plus de details ...
          </Link>
        </div>
      );
    });
  };
  render() {
    const vehicules =
      this.props.searchValue === ""
        ? this.renderVehicule(this.state.vehicules)
        : this.renderVehicule(this.filtred);

    return (
      <div className="page-content">
        <div className="first-element">
          <h1 className=" dark">Liste Vehicules</h1>
          <div>
            <span className="btn btn-dark">
              <span>Importer List</span>
              <i className="fas fa-share-square"></i>
            </span>
            <Link to="/vehicules/ajouterVehicule">
              <span className="btn btn-military">
                <span>Ajouter Véhicule</span>
                <i className="fas fa-plus"></i>
              </span>
            </Link>
          </div>
        </div>
        <div id="list-vehicule">{vehicules}</div>
      </div>
    );
  }
}
export default ListVehicule;
