import React, { Component } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import jwtDecode from "jwt-decode";
import SideBare from "../sideBare/SideBare";
import Header from "../header/Header";
import Dashboard from "../content/Dashboard/Dashboard";
import ListVehicule from "../content/ListVehicule";
import FicheTechnique from "../content/FicheTechnique/FicheTechnique";
import Maintenance from "../content/Maintenance";
import Carburant from "../content/Carburant";
import Problems from "../content/Problems";
import ListUtilisateurs from "../content/ListUtilisateurs";
import NotFound from "../content/NotFound";
import AjouterVehicule from "../Forms/AjouterVehicule";
import AjouterMaintenance from "../Forms/AjouterMaintenance";
import AjouterCarburant from "../Forms/AjouterCarburant";
import AjouterProblem from "../Forms/AjouterProblem";
import AjouterUtilisateur from "../Forms/AjouterUtilisateur";
import Mission from "../content/mission";
import AjouterMission from "../Forms/AjouterMission";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./container.css";

class Container extends Component {
  state = {
    searchValue: "",
    user: {
      id: "",
      role: "",
    },
  };

  handleSearch = (value) => {
    this.setState({ searchValue: value });
  };

  componentDidMount() {
    const token = localStorage.getItem("token");
    if (token !== null) {
      const user = jwtDecode(token);
      this.setState({ user });
    }
  }

  render() {
    return (
      <React.Fragment>
        {this.state.user.role !== "" ? (
          <div id="container">
            <ToastContainer />
            <SideBare user={this.state.user} />
            <div id="main-content">
              <Header
                handleSearch={this.handleSearch}
                userId={this.state.user.id}
              />
              <Switch>
                {this.state.user.role === "user" && (
                  <React.Fragment>
                    <Route
                      path="/mission/ajouterMission"
                      component={AjouterMission}
                    />
                    <Route
                      path="/mission/edit/:id"
                      component={AjouterMission}
                    />
                    <Route
                      exact
                      path="/mission"
                      render={(props) => (
                        <Mission searchValue={this.state.searchValue} />
                      )}
                    />
                    <Route path="/dashboard" component={Dashboard} />
                    <Route
                      path="/vehicules/ajouterVehicule"
                      component={AjouterVehicule}
                    />
                    <Route
                      path="/vehicules/fiche/:id"
                      component={FicheTechnique}
                    />
                    <Route
                      path="/vehicules/edit/:id"
                      component={AjouterVehicule}
                    />
                    <Route
                      exact
                      path="/vehicules"
                      render={(props) => (
                        <ListVehicule searchValue={this.state.searchValue} />
                      )}
                    />
                    <Route
                      path="/maintenance/ajoutermaintenace"
                      component={AjouterMaintenance}
                    />
                    <Route
                      path="/maintenance/edit/:id"
                      component={AjouterMaintenance}
                    />
                    <Route
                      exact
                      path="/maintenance"
                      render={(props) => (
                        <Maintenance searchValue={this.state.searchValue} />
                      )}
                    />
                    <Route
                      path="/carburant/ajouterCarburant"
                      component={AjouterCarburant}
                    />
                    <Route
                      path="/carburant/edit/:id"
                      component={AjouterCarburant}
                    />
                    <Route
                      exact
                      path="/carburant"
                      render={(props) => (
                        <Carburant searchValue={this.state.searchValue} />
                      )}
                    />
                    <Route
                      path="/problem/ajouterProblem"
                      component={AjouterProblem}
                    />
                    <Route
                      path="/problem/edit/:id"
                      component={AjouterProblem}
                    />
                    <Route
                      exact
                      path="/problem"
                      render={(props) => (
                        <Problems searchValue={this.state.searchValue} />
                      )}
                    />
                  </React.Fragment>
                )}
                {this.state.user.role === "admin" && (
                  <React.Fragment>
                    <Route
                      path="/utilisateurs/ajouterUtilisateur"
                      component={AjouterUtilisateur}
                    />
                    <Route
                      path="/utilisateurs/edit/:id"
                      component={AjouterUtilisateur}
                    />

                    <Route
                      exact
                      path="/utilisateurs"
                      render={(props) => (
                        <ListUtilisateurs
                          searchValue={this.state.searchValue}
                        />
                      )}
                    />
                  </React.Fragment>
                )}

                <Route path="/not-Found" component={NotFound} />
                <Redirect exact from="/" to="/dashboard"></Redirect>
                <Redirect to="/not-Found"></Redirect>
              </Switch>
            </div>
          </div>
        ) : (
          <h1>You Are Not Allowed to see this page</h1>
        )}
      </React.Fragment>
    );
  }
}

export default Container;
