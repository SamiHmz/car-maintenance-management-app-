import React, { Component } from "react";
import "./SideBare.css";
import logo from "../../img/Logo_png.png";
import { Link } from "react-router-dom";
class SideBare extends Component {
  state = {
    classes: ["light", "light", "light", "light", "light", "light"],
  };

  handleToggle(index) {
    console.log(index);
    const classes = [...this.state.classes];
    for (let i = 0; i < classes.length; i++) {
      classes[i] = i === index ? "military" : "light";
    }
    this.setState({ classes });
    console.log(this.state.classes);
  }
  render() {
    const { classes } = this.state;
    return (
      <div id="side-bare" className="light">
        <Link to="/dashboard">
          <img src={logo} alt="logo-image" className="logo" />
        </Link>
        <div id="menu">
          {this.props.user.role === "user" && (
            <React.Fragment>
              <Link to="/dashboard">
                <div
                  className={`item ${classes[0]}`}
                  onClick={() => {
                    return this.handleToggle(0);
                  }}
                >
                  <span className="icon">
                    <i className="fas fa-tachometer-alt"></i>
                  </span>
                  <h5>Dashboard</h5>
                </div>
              </Link>
              <Link to="/vehicules">
                <div
                  className={`item ${classes[1]}`}
                  onClick={() => {
                    return this.handleToggle(1);
                  }}
                >
                  <span className="icon">
                    <i className="fas fa-car"></i>
                  </span>
                  <h5>Véhicule</h5>
                </div>
              </Link>
              <Link to="/mission">
                <div
                  className={`item ${classes[2]}`}
                  onClick={() => {
                    return this.handleToggle(2);
                  }}
                >
                  <span className="icon">
                    <i class="fas fa-flag"></i>{" "}
                  </span>
                  <h5>Missions</h5>
                </div>
              </Link>
              <Link to="/maintenance">
                <div
                  className={`item ${classes[3]}`}
                  onClick={() => {
                    return this.handleToggle(3);
                  }}
                >
                  <span className="icon">
                    <i className="fas fa-cog"></i>
                  </span>
                  <h5>Maintenance</h5>
                </div>
              </Link>
              <Link to="/carburant">
                <div
                  className={`item ${classes[4]}`}
                  onClick={() => {
                    return this.handleToggle(4);
                  }}
                >
                  <span className="icon">
                    <i className="fas fa-gas-pump"></i>
                  </span>
                  <h5>Carburant</h5>
                </div>
              </Link>

              <Link to="/problem">
                <div
                  className={`item ${classes[5]}`}
                  onClick={() => {
                    return this.handleToggle(5);
                  }}
                >
                  <span className="icon">
                    <i className="fas fa-exclamation-triangle"></i>
                  </span>
                  <h5>Problemes</h5>
                </div>
              </Link>
            </React.Fragment>
          )}
          {this.props.user.role === "admin" && (
            <Link to="/utilisateurs">
              <div className="item">
                <span className="icon">
                  <i className="fas fa-users"></i>
                </span>
                <h5>Utilisateurs</h5>
              </div>
            </Link>
          )}
        </div>
      </div>
    );
  }
}

export default SideBare;
