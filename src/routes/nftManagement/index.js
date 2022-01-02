import {Route, Switch} from "react-router-dom";
import React from "react";
import asyncComponent from "../../util/asyncComponent";

const NftManagement = ({match}) => (
    <Switch>
        <Route path={`${match.url}/list`} component={asyncComponent(() => import('./listNFT'))}/>
        <Route path={`${match.url}/type`} component={asyncComponent(() => import('./NFTType'))}/>
        <Route path={`${match.url}/create`} component={asyncComponent(() => import('./createNFT'))}/>
        <Route path={`${match.url}/detail/:id`} component={asyncComponent(() => import('./detailNFT'))}/>
        <Route path={`${match.url}/listTemp`} component={asyncComponent(() => import('./tempNFT'))}/>
    </Switch>
);

export default NftManagement