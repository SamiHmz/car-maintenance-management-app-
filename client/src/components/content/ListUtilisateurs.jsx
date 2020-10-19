import React, { Component } from "react";
import { Link } from "react-router-dom";
import { getUsers, deleteUser } from "../../services/usersService";
import Dots from "../reusable/dots/dots";
class ListUtilisateurs extends Component {
  state = {
    users: [],
  };

  filtred = [];

  async componentDidMount() {
    try {
      const { data: users } = await getUsers();
      this.setState({ users });
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
      this.filtred = this.state.users.filter((item) =>
        item.email.startsWith(searchValue)
      );
    }
  }
  deleteUser = async (id) => {
    const oldUsers = [...this.state.users];
    try {
      const users = oldUsers.filter((item) => item.id !== id);
      this.setState({ users });
      await deleteUser(id);
    } catch (error) {
      console.log(error);
      this.setState({ users: oldUsers });
    }
  };

  renderUsers = (list) => {
    return list.map((item) => {
      return (
        <tr key={item.id}>
          <td>{item.email}</td>
          <td>{item.Caserne.Region.nom}</td>
          <td>{item.Caserne.nom}</td>
          <td>{item.role}</td>
          <td>
            <Dots id={item.id} url="utilisateurs" onDelete={this.deleteUser} />
          </td>
        </tr>
      );
    });
  };
  render() {
    const renderUsers =
      this.props.searchValue === ""
        ? this.renderUsers(this.state.users)
        : this.renderUsers(this.filtred);
    return (
      <div className="page-content">
        <div className="first-element">
          <h1 className=" dark">List Utilisateurs</h1>
          <div>
            <Link to="/utilisateurs/ajouterUtilisateur">
              <span className="btn btn-military">
                <span>Ajouter Utilisateur</span>
                <i className="fas fa-plus"></i>
              </span>
            </Link>
          </div>
        </div>
        <div>
          <table>
            <thead>
              <tr>
                <th>Email</th>
                <th>Region</th>
                <th>Caserne</th>
                <th>Role</th>
                <th></th>
              </tr>
            </thead>
            <tbody>{renderUsers}</tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default ListUtilisateurs;
