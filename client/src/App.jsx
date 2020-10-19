import React, { Component, Fragment } from "react";
import Container from "./components/container/Container";
import { Route, Switch, Redirect } from "react-router-dom";
import Login from "./components/Forms/Login/Login";
import NotFound from "./components/content/NotFound";
import jwtDecode from "jwt-decode";

class App extends Component {
  state = {
    user: {
      id: "",
      role: "",
    },
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
      <Fragment>
        <Switch>
          {this.state.user.id !== "" && (
            <Redirect exact from="/login" to="/dashboard"></Redirect>
          )}
          <Route path="/login" component={Login} />
          <Route path="/mission" component={Container} />
          <Route path="/dashboard" component={Container} />
          <Route path="/vehicules" component={Container} />
          <Route path="/maintenance" component={Container} />
          <Route path="/carburant" component={Container} />
          <Route path="/utilisateurs" component={Container} />
          <Route path="/problem" component={Container} />
          <Route path="/not-Found" component={NotFound} />
          <Redirect exact from="/" to="/Login"></Redirect>
          <Redirect to="/not-Found"></Redirect>
        </Switch>
      </Fragment>
    );
  }
}

export default App;
