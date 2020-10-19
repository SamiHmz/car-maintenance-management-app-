import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./dots.css";

class Dots extends Component {
  state = {
    isDots: true,
    displayDelete: "none",
  };

  handleToggelDots = () => {
    const { isDots } = { ...this.state };
    this.setState({ isDots: !isDots });
  };

  handleToggleDelete = () => {
    const displayDelete = this.state.displayDelete === "none" ? "" : "none";
    this.setState({ displayDelete });
  };
  handelDelete = (e) => {
    e.stopPropagation();
    this.props.onDelete(this.props.id);
  };

  render() {
    const editUrl = `/${this.props.url}/edit/${this.props.id}`;
    if (this.state.isDots === true)
      return (
        <i
          className="fas fa-ellipsis-v light"
          onClick={this.handleToggelDots}
        ></i>
      );
    else
      return (
        <React.Fragment>
          <i
            className="fas fa-ellipsis-v light"
            onClick={this.handleToggelDots}
          ></i>
          <span className="box-dialogue">
            <i class="fas fa-times" onClick={this.handleToggelDots}></i>
            <div class="options">
              <span onClick={this.handleToggleDelete}>Supprimer</span>
              <Link to={editUrl}>Modifier</Link>
            </div>
          </span>
          <div
            id="confirmeDelete"
            style={{ display: this.state.displayDelete }}
          >
            <div class="container">
              <h3>Supprimer</h3>
              <h5>voulez vous vraiment supprimer ?</h5>
              <div>
                <span onClick={this.handelDelete} className="btn btn-dark">
                  oui
                </span>
                <span
                  onClick={this.handleToggelDots}
                  className="btn btn-military"
                >
                  non
                </span>
              </div>
            </div>
          </div>
        </React.Fragment>
      );
  }
}

export default Dots;
