import {Route, Switch} from "react-router-dom";
import React from "react";
import asyncComponent from "../../util/asyncComponent";

const ListenUSDManagement = ({match}) => (
    <Switch>
        <Route path={`${match.url}/`} component={asyncComponent(() => import('./listenUSD'))}/>
    </Switch>
);

export default ListenUSDManagement