import {Route, Switch} from "react-router-dom";
import React from "react";
import asyncComponent from "../../util/asyncComponent";

const LogManagement = ({match}) => (
    <Switch>
        <Route path={`${match.url}/user`} component={asyncComponent(() => import('./userLog/index'))}/>
    </Switch>
);

export default LogManagement