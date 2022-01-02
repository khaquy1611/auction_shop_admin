import React from "react";
import {Route, Switch} from "react-router-dom";

import DashBoard from "./dashboard";
import NftManagement from "./nftManagement";
import AuctionManagement from "./auctionManagement";
import MarketManagement from "./marketManagement";
import SettingsManagement from "./settingsManagement";
import StatisticsManagement from "./statisticsManagement";
import WalletManagement from "./walletManagement";
import MyAccount from "./myAccount";
import AdminManagement from "./adminManagement";
import UserManagement from "./userManagement";
import LogManagement from "./logManagement";
import ListenUSDManagement from "./listenUSD";

const Routes = ({match}) => (
    <div className="gx-main-content-wrapper">
        <Switch>
            <Route path={`${match.url}dashboard`} component={DashBoard}/>
            <Route path={`${match.url}nft`} component={NftManagement}/>
            <Route path={`${match.url}auction`} component={AuctionManagement}/>
            <Route path={`${match.url}market`} component={MarketManagement}/>
            <Route path={`${match.url}settings`} component={SettingsManagement}/>
            <Route path={`${match.url}statistics`} component={StatisticsManagement}/>
            <Route path={`${match.url}wallet-management`} component={WalletManagement}/>
            <Route path={`${match.url}my-account`} component={MyAccount}/>
            <Route path={`${match.url}admin`} component={AdminManagement}/>
            <Route path={`${match.url}user-management`} component={UserManagement}/>
            <Route path={`${match.url}log-management`} component={LogManagement}/>
            <Route path={`${match.url}listen-usd`} component={ListenUSDManagement}/>
        </Switch>
    </div>
);

export default Routes;
