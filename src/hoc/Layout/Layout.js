import React, { useState } from "react";

import classes from "./Layout.module.css";
import Toolbar from "../../components/Navigation/Toolbar/Toolbar";
import SideDrawer from "../../components/Navigation/SideDrawer/SideDrawer";
import { connect } from "react-redux";

import Aux from "../Auxx/Auxilliary";

const Layout = (props) => {
  const [ showSideDrawer, setSideDrawer ] = useState(false)
  

  const SideDrawerClosedHandler = () => {
    setSideDrawer(false)
  };
  const SideDrawerToggleHandler = () => {
    setSideDrawer(!showSideDrawer);
  };
  
    return (
      <Aux>
        <Toolbar
          drawerToggleClicked={SideDrawerToggleHandler}
          isAuth={props.isAuthenticated}
        />
        <SideDrawer
          open={showSideDrawer}
          closed={SideDrawerClosedHandler}
          isAuth={props.isAuthenticated}
        />
        <main className={classes.Content}>{props.children}</main>
      </Aux>
    );
  
}
const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.token !== null,
  };
};
export default connect(mapStateToProps)(Layout);
