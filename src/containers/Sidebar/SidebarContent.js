import React from "react";
import { Menu } from "antd";
import { Link } from "react-router-dom";

import CustomScrollbars from "util/CustomScrollbars";
import SidebarLogo from "./SidebarLogo";
import UserProfile from "./UserProfile";
import AppsNavigation from "./AppsNavigation";
import {
  NAV_STYLE_NO_HEADER_EXPANDED_SIDEBAR,
  NAV_STYLE_NO_HEADER_MINI_SIDEBAR,
  THEME_TYPE_LITE,
} from "../../constants/ThemeSetting";
import IntlMessages from "../../util/IntlMessages";
import { useSelector } from "react-redux";

const SubMenu = Menu.SubMenu;

const SidebarContent = ({ sidebarCollapsed, setSidebarCollapsed }) => {
  const { navStyle, themeType } = useSelector(({ settings }) => settings);
  const pathname = useSelector(({ common }) => common.pathname);

  const getNoHeaderClass = (navStyle) => {
    if (
      navStyle === NAV_STYLE_NO_HEADER_MINI_SIDEBAR ||
      navStyle === NAV_STYLE_NO_HEADER_EXPANDED_SIDEBAR
    ) {
      return "gx-no-header-notifications";
    }
    return "";
  };
  const getNavStyleSubMenuClass = (navStyle) => {
    if (navStyle === NAV_STYLE_NO_HEADER_MINI_SIDEBAR) {
      return "gx-no-header-submenu-popup";
    }
    return "";
  };

  const selectedKeys = pathname.substr(1);
  const defaultOpenKeys = selectedKeys.split("/")[1];

  return (
    <>
      <SidebarLogo
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
      />
      <div className="gx-sidebar-content">
        <div
          className={`gx-sidebar-notifications ${getNoHeaderClass(navStyle)}`}
        >
          <UserProfile />
          <AppsNavigation />
        </div>
        <CustomScrollbars className="gx-layout-sider-scrollbar">
          <Menu
            defaultOpenKeys={[defaultOpenKeys]}
            selectedKeys={[selectedKeys]}
            theme={themeType === THEME_TYPE_LITE ? "lite" : "dark"}
            mode="inline"
          >
            <Menu.Item key="sidebar.dashboard">
              <Link to="/">
                <img
                  alt=""
                  src="/assets/images/icons/dashboard.png"
                  className="img-icon-sidebar no-sub"
                />
                <span className="sidebar-text">
                  <IntlMessages id="sidebar.dashboard" />
                </span>
              </Link>
            </Menu.Item>

            <SubMenu
              key="usersManagement"
              popupClassName={getNavStyleSubMenuClass(navStyle)}
              title={
                <span>
                  {" "}
                  <img
                    alt=""
                    src="/assets/images/icons/user-group.png"
                    className="img-icon-sidebar"
                  />
                  <span className="sidebar-text">
                    <IntlMessages id="sidebar.users.management" />
                  </span>
                </span>
              }
            >
              <Menu.Item key="sidebar.users.list.user">
                <Link to="/user-management/list-users">
                  <span>
                    <IntlMessages id="sidebar.users.list.user" />
                  </span>
                </Link>
              </Menu.Item>
            </SubMenu>

            <SubMenu
              key="nftManagement"
              popupClassName={getNavStyleSubMenuClass(navStyle)}
              title={
                <span>
                  {" "}
                  <img
                    alt=""
                    src="/assets/images/icons/nft.png"
                    className="img-icon-sidebar"
                  />
                  <span className="sidebar-text">
                    <IntlMessages id="sidebar.nft.management" />
                  </span>
                </span>
              }
            >
              <Menu.Item key="sidebar.nft.type">
                <Link to="/nft/type">
                  <span>
                    <IntlMessages id="sidebar.nft.type" />
                  </span>
                </Link>
              </Menu.Item>
              <Menu.Item key="sidebar.nft.create.nft">
                <Link to="/nft/create">
                  <span>
                    <IntlMessages id="sidebar.nft.create.nft" />
                  </span>
                </Link>
              </Menu.Item>
              <Menu.Item key="sidebar.nft.list.nft">
                <Link to="/nft/list">
                  <span>
                    <IntlMessages id="sidebar.nft.list.nft" />
                  </span>
                </Link>
              </Menu.Item>
              <Menu.Item key="sidebar.nft.list.temp.nft">
                <Link to="/nft/listTemp">
                  <span>
                    <IntlMessages id="sidebar.nft.list.temp.nft" />
                  </span>
                </Link>
              </Menu.Item>
              {/* <Menu.Item key="sidebar.nft.delete.nft">
                <Link to="/">
                  <span>
                    <IntlMessages id="sidebar.nft.delete.nft" />
                  </span>
                </Link>
              </Menu.Item>
              <Menu.Item key="sidebar.nft.transfer.nft">
                <Link to="/">
                  <span>
                    <IntlMessages id="sidebar.nft.transfer.nft" />
                  </span>
                </Link>
              </Menu.Item>
              <Menu.Item key="sidebar.nft.collections">
                <Link to="/">
                  <span>
                    <IntlMessages id="sidebar.nft.collections" />
                  </span>
                </Link>
              </Menu.Item> */}
            </SubMenu>

            <SubMenu
              key="auctionManagement"
              popupClassName={getNavStyleSubMenuClass(navStyle)}
              title={
                <span>
                  {" "}
                  <img
                    alt=""
                    src="/assets/images/icons/auction.png"
                    className="img-icon-sidebar"
                  />
                  <span className="sidebar-text">
                    <IntlMessages id="sidebar.auction.management" />
                  </span>
                </span>
              }
            >
              <Menu.Item key="sidebar.auction.create.auction">
                <Link to="/auction/create-auction">
                  <span>
                    <IntlMessages id="sidebar.auction.create.auction" />
                  </span>
                </Link>
              </Menu.Item>
              <Menu.Item key="sidebar.auction.list.auction">
                <Link to="/auction/list-auction">
                  <span>
                    <IntlMessages id="sidebar.auction.list.auction" />
                  </span>
                </Link>
              </Menu.Item>
              <Menu.Item key="sidebar.auction.list.completed.auction">
                <Link to="/auction/list-complete-auction">
                  <span>
                    <IntlMessages id="sidebar.auction.list.completed.auction" />
                  </span>
                </Link>
              </Menu.Item>
            </SubMenu>

            <SubMenu
              key="marketplaceManagement"
              popupClassName={getNavStyleSubMenuClass(navStyle)}
              title={
                <span>
                  {" "}
                  <img
                    alt=""
                    src="/assets/images/icons/market.png"
                    className="img-icon-sidebar"
                  />
                  <span className="sidebar-text">
                    <IntlMessages id="sidebar.marketplace.management" />
                  </span>
                </span>
              }
            >
              <Menu.Item key="sidebar.marketplace.create.listing">
                <Link to="/market/create-listing">
                  <span>
                    <IntlMessages id="sidebar.marketplace.create.listing" />
                  </span>
                </Link>
              </Menu.Item>
              <Menu.Item key="sidebar.marketplace.listing">
                <Link to="/market/listing">
                  <span>
                    <IntlMessages id="sidebar.marketplace.listing" />
                  </span>
                </Link>
              </Menu.Item>
            </SubMenu>

            <Menu.Item
              key="listenUSDManagement">
              <Link to="/listen-usd">
                <img alt="" src="/assets/images/icons/usd.png" className="img-icon-sidebar no-sub"/>
                <span className="sidebar-text">
                  <IntlMessages id="sidebar.listen.usd.management" />
                </span>
              </Link>
            </Menu.Item>

            <SubMenu
              key="adminManagement"
              popupClassName={getNavStyleSubMenuClass(navStyle)}
              title={
                <span>
                  {" "}
                  <img
                    alt=""
                    src="/assets/images/icons/user.png"
                    className="img-icon-sidebar"
                  />
                  <span className="sidebar-text">
                    <IntlMessages id="sidebar.admin.management" />
                  </span>
                </span>
              }
            >
              <Menu.Item key="sidebar.admin.list.admin.account">
                <Link to="/admin/list-admin">
                  <span>
                    <IntlMessages id="sidebar.admin.list.admin.account" />
                  </span>
                </Link>
              </Menu.Item>
              <Menu.Item key="sidebar.admin.acl">
                <Link to="/admin/manage-acl">
                  <span>
                    <IntlMessages id="sidebar.admin.acl" />
                  </span>
                </Link>
              </Menu.Item>
            </SubMenu>

            <SubMenu
              key="logManagement"
              popupClassName={getNavStyleSubMenuClass(navStyle)}
              title={
                <span>
                  {" "}
                  <img
                    alt=""
                    src="/assets/images/icons/log.png"
                    className="img-icon-sidebar"
                  />
                  <span className="sidebar-text">
                    <IntlMessages id="sidebar.log.management" />
                  </span>
                </span>
              }
            >
              <Menu.Item key="sidebar.log.access.log">
                <Link to="/">
                  <span>
                    <IntlMessages id="sidebar.log.access.log" />
                  </span>
                </Link>
              </Menu.Item>
              <Menu.Item key="sidebar.log.email.log">
                <Link to="/">
                  <span>
                    <IntlMessages id="sidebar.log.email.log" />
                  </span>
                </Link>
              </Menu.Item>
              <Menu.Item key="sidebar.log.user.log">
                <Link to="/log-management/user">
                  <span>
                    <IntlMessages id="sidebar.log.user.log" />
                  </span>
                </Link>
              </Menu.Item>
            </SubMenu>

            <SubMenu
              key="settingManagement"
              popupClassName={getNavStyleSubMenuClass(navStyle)}
              title={
                <span>
                  {" "}
                  <img
                    alt=""
                    src="/assets/images/icons/setting.png"
                    className="img-icon-sidebar"
                  />
                  <span className="sidebar-text">
                    <IntlMessages id="sidebar.setting.management" />
                  </span>
                </span>
              }
            >
              <Menu.Item key="sidebar.setting.list.wallet">
                <Link to="/">
                  <span>
                    <IntlMessages id="sidebar.setting.list.wallet" />
                  </span>
                </Link>
              </Menu.Item>
              <Menu.Item key="sidebar.setting.api.key">
                <Link to="/settings/api-key">
                  <span>
                    <IntlMessages id="sidebar.setting.api.key" />
                  </span>
                </Link>
              </Menu.Item>
              <Menu.Item key="sidebar.setting.fiat.security">
                <Link to="/">
                  <span>
                    <IntlMessages id="sidebar.setting.fiat.security" />
                  </span>
                </Link>
              </Menu.Item>
              <Menu.Item key="sidebar.setting.email.api">
                <Link to="/">
                  <span>
                    <IntlMessages id="sidebar.setting.email.api" />
                  </span>
                </Link>
              </Menu.Item>
              <Menu.Item key="sidebar.setting.email.marketing">
                <Link to="/">
                  <span>
                    <IntlMessages id="sidebar.setting.email.marketing" />
                  </span>
                </Link>
              </Menu.Item>
              <Menu.Item key="sidebar.setting.tax.setty">
                <Link to="/">
                  <span>
                    <IntlMessages id="sidebar.setting.tax.setty" />
                  </span>
                </Link>
              </Menu.Item>
              <Menu.Item key="sidebar.setting.exoloy.setty">
                <Link to="/">
                  <span>
                    <IntlMessages id="sidebar.setting.exoloy.setty" />
                  </span>
                </Link>
              </Menu.Item>
              <Menu.Item key="sidebar.setting.coinbase.api">
                <Link to="/">
                  <span>
                    <IntlMessages id="sidebar.setting.coinbase.api" />
                  </span>
                </Link>
              </Menu.Item>
              <Menu.Item key="sidebar.setting.aws.api">
                <Link to="/">
                  <span>
                    <IntlMessages id="sidebar.setting.aws.api" />
                  </span>
                </Link>
              </Menu.Item>
              <Menu.Item key="sidebar.setting.firebase.api">
                <Link to="/">
                  <span>
                    <IntlMessages id="sidebar.setting.firebase.api" />
                  </span>
                </Link>
              </Menu.Item>
            </SubMenu>

            <SubMenu
              key="backupManagement"
              popupClassName={getNavStyleSubMenuClass(navStyle)}
              title={
                <span>
                  {" "}
                  <img
                    alt=""
                    src="/assets/images/icons/backup.png"
                    className="img-icon-sidebar backup"
                  />
                  <span className="sidebar-text">
                    <IntlMessages id="sidebar.backup.management" />
                  </span>
                </span>
              }
            >
              <Menu.Item key="sidebar.backup.create.backup">
                <Link to="/">
                  <span>
                    <IntlMessages id="sidebar.backup.create.backup" />
                  </span>
                </Link>
              </Menu.Item>
              <Menu.Item key="sidebar.backup.schedule.backup">
                <Link to="/">
                  <span>
                    <IntlMessages id="sidebar.backup.schedule.backup" />
                  </span>
                </Link>
              </Menu.Item>
            </SubMenu>

            <SubMenu
              key="databaseManagement"
              popupClassName={getNavStyleSubMenuClass(navStyle)}
              title={
                <span>
                  {" "}
                  <img
                    alt=""
                    src="/assets/images/icons/database.png"
                    className="img-icon-sidebar db"
                  />
                  <span className="sidebar-text">
                    <IntlMessages id="sidebar.database.management" />
                  </span>
                </span>
              }
            >
              <Menu.Item key="sidebar.database.info">
                <Link to="/">
                  <span>
                    <IntlMessages id="sidebar.database.info" />
                  </span>
                </Link>
              </Menu.Item>
            </SubMenu>

            <SubMenu
              key="emailManagement"
              popupClassName={getNavStyleSubMenuClass(navStyle)}
              title={
                <span>
                  {" "}
                  <img
                    alt=""
                    src="/assets/images/icons/email.png"
                    className="img-icon-sidebar email"
                  />
                  <span className="sidebar-text">
                    <IntlMessages id="sidebar.email.management" />
                  </span>
                </span>
              }
            >
              <Menu.Item key="sidebar.email.marketing">
                <Link to="/">
                  <span>
                    <IntlMessages id="sidebar.email.marketing" />
                  </span>
                </Link>
              </Menu.Item>
              <Menu.Item key="sidebar.email.send.notification">
                <Link to="/">
                  <span>
                    <IntlMessages id="sidebar.email.send.notification" />
                  </span>
                </Link>
              </Menu.Item>
              <Menu.Item key="sidebar.email.subscribers">
                <Link to="/">
                  <span>
                    <IntlMessages id="sidebar.email.subscribers" />
                  </span>
                </Link>
              </Menu.Item>
              <Menu.Item key="sidebar.email.list.email">
                <Link to="/">
                  <span>
                    <IntlMessages id="sidebar.email.list.email" />
                  </span>
                </Link>
              </Menu.Item>
            </SubMenu>

            <SubMenu
              key="statisticsManagement"
              popupClassName={getNavStyleSubMenuClass(navStyle)}
              title={
                <span>
                  {" "}
                  <img
                    alt=""
                    src="/assets/images/icons/statistics.png"
                    className="img-icon-sidebar"
                  />
                  <span className="sidebar-text">
                    <IntlMessages id="sidebar.statistics.management" />
                  </span>
                </span>
              }
            >
              <Menu.Item key="sidebar.statistics.total.tokens.deposited">
                <Link to="/statistics/total-tokens-deposited">
                  <span>
                    <IntlMessages id="sidebar.statistics.total.tokens.deposited" />
                  </span>
                </Link>
              </Menu.Item>
              <Menu.Item key="sidebar.statistics.total.tokens.withdrawals">
                <Link to="/statistics/total-tokens-withdraws">
                  <span>
                    <IntlMessages id="sidebar.statistics.total.tokens.withdrawals" />
                  </span>
                </Link>
              </Menu.Item>
              <Menu.Item key="sidebar.statistics.total.listen.usd">
                <Link to="/statistics/total-listen-usd">
                  <span>
                    <IntlMessages id="sidebar.statistics.total.listen.usd" />
                  </span>
                </Link>
              </Menu.Item>
              <Menu.Item key="sidebar.statistics.total.nft.sold">
                <Link to="/statistics/total-nft-sold">
                  <span>
                    <IntlMessages id="sidebar.statistics.total.nft.sold" />
                  </span>
                </Link>
              </Menu.Item>
              <Menu.Item key="sidebar.statistics.total.withdrawals">
                <Link to="/statistics/total-withdraw-amount">
                  <span>
                    <IntlMessages id="sidebar.statistics.total.withdrawals" />
                  </span>
                </Link>
              </Menu.Item>
            </SubMenu>

            <Menu.Item key="sidebar.wallet.management">
              <Link to="/wallet-management">
                <img
                  alt=""
                  src="/assets/images/icons/wallet.png"
                  className="img-icon-sidebar no-sub"
                />
                <span className="sidebar-text">
                  <IntlMessages id="sidebar.wallet.management" />
                </span>
              </Link>
            </Menu.Item>
          </Menu>
        </CustomScrollbars>
      </div>
    </>
  );
};

export default React.memo(SidebarContent);
