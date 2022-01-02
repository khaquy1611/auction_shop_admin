import {Route, Switch} from "react-router-dom";
import React from "react";
import asyncComponent from "../../util/asyncComponent";

const StatisticsManagement = ({match}) => (
    <Switch>
        <Route path={`${match.url}/api-key`} component={asyncComponent(() => import('./apiKey'))}/>
    </Switch>
);

export default StatisticsManagement