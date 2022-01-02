import React, {memo, useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import URLSearchParams from 'url-search-params'
import {Redirect, Route, Switch, useHistory, useLocation, useRouteMatch} from "react-router-dom";
import {ConfigProvider} from 'antd';
import {IntlProvider} from "react-intl";

import AppLocale from "../../lngProvider";
import MainApp from "./MainApp";
import SignIn from "../SignIn";
import {setInitUrl, userSignOut} from "../../appRedux/actions";
import {onLayoutTypeChange, onNavStyleChange, setThemeType} from "../../appRedux/actions";
import {NotificationContainer} from "react-notifications";

import {
    LAYOUT_TYPE_BOXED,
    LAYOUT_TYPE_FRAMED,
    LAYOUT_TYPE_FULL,
    THEME_TYPE_DARK
} from "../../constants/ThemeSetting";
import {emitter} from "../../modules/Emitter";

const RestrictedRoute = ({component: Component, location, authUser, ...rest}) =>
    <Route
        {...rest}
        render={props =>
            authUser
                ? <Component {...props} />
                : <Redirect
                    to={{
                        pathname: '/signin',
                        state: {from: location}
                    }}
                />}
    />;

const setLayoutType = (layoutType) => {
    if (layoutType === LAYOUT_TYPE_FULL) {
        document.body.classList.remove('boxed-layout');
        document.body.classList.remove('framed-layout');
        document.body.classList.add('full-layout');
    } else if (layoutType === LAYOUT_TYPE_BOXED) {
        document.body.classList.remove('full-layout');
        document.body.classList.remove('framed-layout');
        document.body.classList.add('boxed-layout');
    } else if (layoutType === LAYOUT_TYPE_FRAMED) {
        document.body.classList.remove('boxed-layout');
        document.body.classList.remove('full-layout');
        document.body.classList.add('framed-layout');
    }
};

const setNavStyle = (navStyle) => {
    document.body.classList.remove('full-scroll');
    document.body.classList.remove('horizontal-layout');
};

let styleSheetLink = document.createElement('link');
styleSheetLink.type = 'text/css';
styleSheetLink.rel = 'stylesheet';
document.body.appendChild(styleSheetLink);

const App = () => {
    const locale = useSelector(({settings}) => settings.locale);
    const navStyle = useSelector(({settings}) => settings.navStyle);
    const layoutType = useSelector(({settings}) => settings.layoutType);
    const themeColor = useSelector(({settings}) => settings.themeColor);
    const themeType = useSelector(({settings}) => settings.themeType);
    const isDirectionRTL = useSelector(({settings}) => settings.isDirectionRTL);

    const dispatch = useDispatch();
    const {authUser, initURL} = useSelector(({auth}) => auth);

    const location = useLocation();
    const history = useHistory();
    const match = useRouteMatch();

    useEffect(() => {
        if (isDirectionRTL) {
            document.documentElement.classList.add('rtl');
            document.documentElement.setAttribute('data-direction', 'rtl')
        } else {
            document.documentElement.classList.remove('rtl');
            document.documentElement.setAttribute('data-direction', 'ltr')
        }

        if (themeColor) {
            styleSheetLink.href = `/css/${themeColor}.min.css`;
        }
    }, [themeColor, isDirectionRTL]);

    useEffect(() => {
        if (themeType === THEME_TYPE_DARK) {
            document.body.classList.add('dark-theme');
            styleSheetLink.href = "/css/dark_theme.min.css";
        } else if (document.body.classList.contains('dark-theme')) {
            document.body.classList.remove('dark-theme');
            styleSheetLink.href = "";
        }
    }, [themeType]);

    useEffect(() => {
        if (locale)
            document.documentElement.lang = locale.locale;
    }, [locale]);

    useEffect(() => {
        if (initURL === '') {
            dispatch(setInitUrl(location.pathname));
        }
        const params = new URLSearchParams(location.search);

        if (params.has("theme")) {
            dispatch(setThemeType(params.get('theme')));
        }
        if (params.has("nav-style")) {
            dispatch(onNavStyleChange(params.get('nav-style')));
        }
        if (params.has("layout-type")) {
            dispatch(onLayoutTypeChange(params.get('layout-type')));
        }
    }, [location.search, dispatch, initURL, location.pathname]);

    useEffect(() => {
        setLayoutType(layoutType);
        setNavStyle(navStyle);
    }, [layoutType, navStyle]);

    useEffect(() => {
        if (location.pathname === '/') {
            if (authUser === null) {
                history.push('/signin');
            } else if (initURL === '' || initURL === '/' || initURL === '/signin') {
                history.push('/dashboard');
            } else {
                history.push(initURL);
            }
        }
    }, [authUser, initURL, location, history]);

    const currentAppLocale = AppLocale[locale.locale];

    emitter.on("EXPIRED_TOKEN", () => {
        dispatch(userSignOut());
    });

    return (
        <ConfigProvider locale={currentAppLocale.antd} direction={isDirectionRTL ? 'rtl' : 'ltr'}>
            <IntlProvider
                locale={currentAppLocale.locale}
                messages={currentAppLocale.messages}>

                <Switch>
                    <Route exact path='/signin' component={SignIn}/>
                    <RestrictedRoute path={`${match.url}`} authUser={authUser} location={location}
                                     component={MainApp}/>
                </Switch>
                <NotificationContainer/>
            </IntlProvider>
        </ConfigProvider>
    )
};

export default memo(App);
