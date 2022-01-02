import { Route, Switch } from "react-router-dom";
import React from "react";
import asyncComponent from "../../util/asyncComponent";
const UserManagement = ({ match }) => (
  <Switch>
    <Route
      path={`${match.url}/list-users`}
      component={asyncComponent(() => import("./listUser"))}
    />
  </Switch>
);

export default UserManagement;
