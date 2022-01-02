import React, {useEffect} from "react";
import {Layout} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {footerText} from "../../util/config";
import Topbar from "../Topbar/index";
import App from "../../routes/index";
// import Customizer from "../Customizer";
import {useRouteMatch} from "react-router-dom";
import {updateWindowWidth} from "../../appRedux/actions";
import AppSidebar from "./AppSidebar";
import {
    NAV_STYLE_DRAWER, NAV_STYLE_FIXED,
    NAV_STYLE_MINI_SIDEBAR,
} from "../../constants/ThemeSetting";

const {Content, Footer} = Layout;

const getContainerClass = (navStyle) => {
    return '';
};

const getNavStyles = (navStyle) => {
    switch (navStyle) {
        case NAV_STYLE_FIXED :
            return <Topbar/>;
        case NAV_STYLE_DRAWER :
            return <Topbar/>;
        case NAV_STYLE_MINI_SIDEBAR :
            return <Topbar/>;
        default :
            return null;
    }
};

const MainApp = () => {
    const {navStyle} = useSelector(({settings}) => settings);
    const match = useRouteMatch();
    const dispatch = useDispatch();

    useEffect(() => {
        window.addEventListener('resize', () => {
            dispatch(updateWindowWidth(window.innerWidth));
        })
    }, [dispatch]);

    return (
        <Layout className="gx-app-layout">
            <AppSidebar navStyle={navStyle}/>
            <Layout>
                {getNavStyles(navStyle)}
                <Content className={`gx-layout-content ${getContainerClass(navStyle)} `}>
                    <App match={match}/>
                    <Footer>
                        <div className="gx-layout-footer-content">
                            {footerText}
                        </div>
                    </Footer>
                </Content>
            </Layout>
            {/*<Customizer/>*/}
        </Layout>
    )
};
export default MainApp;

