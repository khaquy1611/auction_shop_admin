import {Route, Switch} from "react-router-dom";
import React from "react";
import asyncComponent from "../../util/asyncComponent";

const StatisticsManagement = ({match}) => (
    <Switch>
        <Route path={`${match.url}/total-listen-usd`} component={asyncComponent(() => import('./totalListenUSD'))}/>
        <Route path={`${match.url}/total-nft-sold`} component={asyncComponent(() => import('./totalNFTSold'))}/>
        <Route path={`${match.url}/total-tokens-deposited`} component={asyncComponent(() => import('./totalTokensDeposited'))}/>
        <Route path={`${match.url}/total-tokens-withdraws`} component={asyncComponent(() => import('./totalTokensWithdraws'))}/>
        <Route path={`${match.url}/total-withdraw-amount`} component={asyncComponent(() => import('./totalWithdrawAmount'))}/>
    </Switch>
);

export default StatisticsManagement