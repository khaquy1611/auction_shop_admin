import {Route, Switch} from "react-router-dom";
import React from "react";
import asyncComponent from "../../util/asyncComponent";

const AdminManagement = ({match}) => (
    <Switch>
        <Route path={`${match.url}/list-admin`} component={asyncComponent(() => import('./listAdmin'))}/>
        <Route path={`${match.url}/manage-acl`} component={asyncComponent(() => import('./manageAcl'))}/>
    </Switch>
);

export default AdminManagement