import React from "react";
import {useDispatch} from "react-redux";
import {Avatar, Popover} from "antd";
import {userSignOut} from "appRedux/actions/Auth";
import IntlMessages from "../../util/IntlMessages";
import {Link} from "react-router-dom";

const UserInfo = () => {

    const dispatch = useDispatch();

    const userMenuOptions = (
        <ul className="gx-user-popover">
            <li>
                <Link to="/my-account">
                    <IntlMessages id="userInfo.myAccount"/>
                </Link>
            </li>
            <li onClick={() => dispatch(userSignOut())}>
                <IntlMessages id="userInfo.logout"/>
            </li>
        </ul>
    );

    return (
        <Popover overlayClassName="gx-popover-horizantal" placement="bottomRight" content={userMenuOptions}
                 trigger="click">
            <Avatar src={"https://via.placeholder.com/150"}
                    className="gx-avatar gx-pointer" alt=""/>
        </Popover>
    )

}

export default UserInfo;
