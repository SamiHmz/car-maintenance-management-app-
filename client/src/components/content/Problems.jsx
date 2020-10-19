import React, { Component } from "react";
import car from "./car-img.png";
import { Link } from "react-router-dom";
import date from "date-and-time";
import { getProblems, deleteProblem } from "../../services/problemService";
import Dots from "../reusable/dots/dots";
class Problems extends Component {
  state = {
    problems: [],
  };

  filtred = [];

  async componentDidMount() {
    try {
      const { data: problems } = await getProblems();
      this.setState({ problems });
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
      this.filtred = this.state.problems.filter((item) =>
        item.matricule.toLowerCase().startsWith(searchValue.toLowerCase())
      );
    }
  }
  deleteProblem = async (id) => {
    const oldProblems = [...this.state.problems];
    try {
      const problems = oldProblems.filter((item) => item.problem_id !== id);
      console.log(this.state.problems);
      this.setState({ problems });
      console.log(this.state.problems);
      await deleteProblem(id);
    } catch (error) {
      console.log(error);
      this.setState({ problems: oldProblems });
    }
  };

  renderProblems = (list) => {
    const pattern = date.compile("dddd, MMM DD YYYY");
    return list.map((item) => {
      return (
        <React.Fragment key={item.problem_id}>
          <tr className="date">
            <td colSpan="5">{date.format(new Date(item.date), pattern)}</td>
          </tr>
          <tr>
            <td>
              <div className="car-info">
                <img src={car} alt="car img" />
                <div>
                  <span>
                    {item.nom_model} {item.marque_nom} [{item.matricule}]
                  </span>
                  <span className="light">
                    {item.etat} - {item.categorie}
                  </span>
                </div>
              </div>
            </td>
            <td>{item.nom}</td>
            <td>{item.description}</td>
            <td>{item.etat}</td>
            <td>
              <Dots
                id={item.problem_id}
                onDelete={this.deleteProblem}
                url="problem"
              />
            </td>
          </tr>
        </React.Fragment>
      );
    });
  };

  render() {
    const problems =
      this.props.searchValue === ""
        ? this.renderProblems(this.state.problems)
        : this.renderProblems(this.filtred);

    return (
      <div className="page-content">
        <div className="first-element">
          <h1 className=" dark">Problems</h1>
          <div>
            <span className="btn btn-dark">
              <span>Importer List</span>
              <i className="fas fa-share-square"></i>
            </span>
            <Link to="/problem/ajouterProblem">
              <span className="btn btn-military">
                <span>Ajouter Problem</span>
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
                <th>Problem</th>
                <th>Description</th>
                <th>Etat</th>
              </tr>
            </thead>
            <tbody>{problems}</tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default Problems;
