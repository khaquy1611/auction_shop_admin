import axios from "axios";
import {API_URL} from "../modules/Configs";

export const login = (username, password) => {
    return axios({
        method: "POST",
        url: API_URL + "/admin/auth/login",
        data: {
            username: username,
            password: password
        }
    });
};

export const changePassword = (currentPassword, newPassword) => {
    return axios({
        method: "PUT",
        url: API_URL + "/admin/auth/change-pass",
        data: {
            password_old: currentPassword,
            password: newPassword
        }
    });
};

export const getListAdmin = (page, pageSize) => {
    return axios({
        method: "GET",
        url: API_URL + "/admin/manager/admin-users",
        params: {
            'page-number': page,
            'page-size': pageSize
        }
    });
};

export const createAdmin = (admin) => {
    return axios({
        method: "POST",
        url: API_URL + "/admin/manager/admin-users",
        data: {
            user_name: admin.userName,
            password: admin.password,
            display_name: admin.displayName,
            email: admin.email,
            phone: admin.phone,
            avatar: admin.avatar,
        }
    });
};

export const blockAdmin = (adminId) => {
    return axios({
        method: "POST",
        url: API_URL + "/admin/manager/admin-users/" + adminId + "/block"
    });
};

export const unblockAdmin = (adminId) => {
    return axios({
        method: "POST",
        url: API_URL + "/admin/manager/admin-users/" + adminId + "/unlock"
    });
};

export const resetPassword = (userName, password) => {
    return axios({
        method: "PUT",
        url: API_URL + "/admin/manager/admin-users/reset-admin-pass",
        data: {
            username: userName,
            password: password
        }
    });
};

export const getActions = (page, pageSize) => {
    return axios({
        method: "GET",
        url: API_URL + "/admin/manager/role-actions",
        params: {
            'page-number': page,
            'page-size': pageSize
        }
    });
};

export const createActions = (action) => {
    return axios({
        method: "POST",
        url: API_URL + "/admin/manager/role-actions",
        data: {
            lock: action.lock,
            method: action.method,
            name_action: action.nameAction,
            url: action.url
        }
    });
};

export const getRoles = () => {
    return axios({
        method: "GET",
        url: API_URL + "/admin/manager/role-acls"
    });
};

export const createRole = (role) => {
    return axios({
        method: "POST",
        url: API_URL + "/admin/manager/role-acls",
        data: {
            name_acl: role.nameAcl,
            lock: role.lock
        }
    });
};

export const editRole = (role) => {
    return axios({
        method: "PUT",
        url: API_URL + "/admin/manager/role-acls/" + role.id,
        data: {
            name_acl: role.nameAcl,
            lock: role.lock
        }
    });
}