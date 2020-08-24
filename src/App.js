import React, { Component } from "react";
import { Route, Switch, withRouter, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import asyncComponents from "./hoc/asyncComponent/aysncComponent";

import Layout from "./hoc/Layout/Layout";
import BurgerBuilder from "./containers/BurgerBuilder/BurgerBuilder";
import Logout from "./containers/Auth/Logout/Logout";
import * as actions from "./store/actions/index";

const asyncCheckout = asyncComponents(() => {
  return import("./containers/Checkout/Checkout");
});
const asyncOrders = asyncComponents(() => {
  return import("./containers/Orders/Orders");
});
const asyncAuth = asyncComponents(() => {
  return import("./containers/Auth/Auth");
});

class App extends Component {
  state = {
    authChecked: false,
  };
  componentDidMount() {
    this.props.onTryAutoSignup();
    this.setState({
      authChecked: true,
    });
  }

  render() {
    let routes = null;
    if (this.state.authChecked) {
      routes = (
        <Switch>
          <Route path="/auth" component={asyncAuth} />
          <Route path="/" exact component={BurgerBuilder} />
          <Redirect to="/" />
        </Switch>
      );
    }

    if (this.state.authChecked && this.props.isAuthenticated) {
      routes = (
        <Switch>
          <Route path="/auth" component={asyncAuth} />
          <Route path="/checkout" component={asyncCheckout} />
          <Route path="/orders" component={asyncOrders} />
          <Route path="/logout" component={Logout} />
          <Route path="/" exact component={BurgerBuilder} />
          <Redirect to="/" />
        </Switch>
      );
    }

    return (
      <div>
        <Layout>{routes}</Layout>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.token !== null,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onTryAutoSignup: () => dispatch(actions.authCheckState()),
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
