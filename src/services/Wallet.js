import axios from "axios";
import {API_URL} from "../modules/Configs";

export const getWalletGroup = () => {
    return axios({
        method: "GET",
        url: API_URL + "/wallet/group"
    });
};

export const createWalletGroup = (walletGroup) => {
    return axios({
        method: "POST",
        url: API_URL + "/admin/manager/wallet/group",
        data: {
            is_fiat: walletGroup.isFiat,
            order_position: Number(walletGroup.orderPosition),
            wallet_group_name: walletGroup.walletGroupName
        }
    });
};

export const editWalletGroup = (walletGroup) => {
    return axios({
        method: "PUT",
        url: API_URL + "/admin/manager/wallet/group/" + walletGroup.id,
        data: {
            is_fiat: walletGroup.walletGroupIsFiat,
            order_position: Number(walletGroup.walletGroupOrderPosition),
            wallet_group_name: walletGroup.walletGroupName
        }
    });
}

export const deleteWalletGroup = (walletGroupId) => {
    return axios({
        method: "DELETE",
        url: API_URL + "/admin/manager/wallet/group/" + walletGroupId,
    });
}

export const createWalletBase = (walletBase) => {
    return axios({
        method: "POST",
        url: API_URL + "/admin/manager/wallet/group/" + walletBase.walletGroupId + "/wallet-base",
        data: {
            order_position: walletBase.orderPosition,
            wallet_group_id: walletBase.walletGroupId,
            wallet_image: walletBase.walletImage,
            wallet_name: walletBase.walletName,
            wallet_type: walletBase.walletType,
            wallet_url: walletBase.walletUrl
        }
    });
};

export const editWalletBase = (walletBase) => {
    return axios({
        method: "PUT",
        url: API_URL + "/admin/manager/wallet/group/" + walletBase.walletGroupId + "/wallet-base/" + walletBase.id,
        data: {
            order_position: Number(walletBase.walletOrderPosition),
            wallet_group_id: walletBase.walletGroupId,
            wallet_image: walletBase.walletImage,
            wallet_name: walletBase.walletName,
            wallet_type: walletBase.walletType,
            wallet_url: walletBase.walletUrl
        }
    });
}

export const deleteWalletBase = (walletGroupId, walletBaseId) => {
    return axios({
        method: "DELETE",
        url: API_URL + "/admin/manager/wallet/group/" + walletGroupId + "/wallet-base/" + walletBaseId
    });
}