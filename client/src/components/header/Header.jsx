import React, { Component } from "react";
import "./Header.css";
import profilepic from "./profile-pic.png";
import { logout } from "../../services/authService";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
class Header extends Component {
  state = {
    toggle: false,
  };

  logOut = () => {
    toast.success("Logging Out");
    logout();
    setTimeout(() => (window.location = "/login"), 2000);
  };

  handleChange = (e) => {
    this.props.handleSearch(e.target.value);
  };

  // handletoggleChevron = () => {
  //   const { toggle } = { ...this.state };
  //   this.setState({ toggle: !toggle });
  // };

  render() {
    // const editUrl = `utilisateurs/edit/${this.props.userId}`;
    // const shevron =
    //   this.state.toggle === true ? (
    //     <span className="edit">
    //       <Link to={editUrl}>
    //         <h5 onClick={this.handletoggleChevron}>Modifier</h5>
    //       </Link>
    //       <h5 onClick={this.logOut}>Déconnexion</h5>
    //     </span>
    //   ) : null;

    return (
      <div id="header" className="light">
        <i className="fas fa-search"></i>
        <input
          type="text"
          placeholder="Recherche ..."
          onChange={this.handleChange}
        />
        <div className="menu">
          <span id="notification"></span>
          <img src={profilepic} alt="profile-picture" className="profile-pic" />
          <h5 onClick={this.logOut}>Déconnexion</h5>
        </div>
      </div>
    );
  }
}

export default Header;
