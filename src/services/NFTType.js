import axios from "axios";
import { API_URL } from "../modules/Configs";

export const createNFTType = (nftType) => {
    return axios({
        method: "POST",
        url: API_URL + "/admin/manager/nft/types",
        data: nftType,
    });
};

export const updateNFTType = (nftType) => {
    return axios({
        method: "PUT",
        url: API_URL + "/admin/manager/nft/types/" + nftType.id,
        data: nftType,
    });
};

export const deleteNFTType = (id) => {
    return axios({
        method: "DELETE",
        url: API_URL + "/admin/manager/nft/types/" + id,
    });
};

export const getNFTType = (id) => {
    return axios({
        method: "GET",
        url: API_URL + "/admin/manager/nft/types/" + id,
    });
};
