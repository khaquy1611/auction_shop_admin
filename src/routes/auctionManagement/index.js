import {Route, Switch} from "react-router-dom";
import React from "react";
import asyncComponent from "../../util/asyncComponent";

const AuctionManagement = ({match}) => (
    <Switch>
        <Route path={`${match.url}/list-auction`} component={asyncComponent(() => import('./listAuction'))}/>
        <Route path={`${match.url}/list-complete-auction`} component={asyncComponent(() => import('./listCompleteAuction'))}/>
        <Route path={`${match.url}/create-auction`} component={asyncComponent(() => import('./createAuction'))}/>
    </Switch>
);

export default AuctionManagement