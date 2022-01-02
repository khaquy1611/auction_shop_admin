import {Route, Switch} from "react-router-dom";
import React from "react";
import asyncComponent from "../../util/asyncComponent";

const MarketManagement = ({match}) => (
    <Switch>
        <Route path={`${match.url}/listing`} component={asyncComponent(() => import('./listing'))}/>
        <Route path={`${match.url}/create-listing`} component={asyncComponent(() => import('./createListing'))}/>
    </Switch>
);

export default MarketManagement