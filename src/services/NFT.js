import axios from "axios";
import { API_URL } from "../modules/Configs";

export const createNFT = (nft) => {
  return axios({
    method: "POST",
    url: API_URL + "/admin/manager/nft/items",
    data: nft,
  });
};

export const getNFTTypes = () => {
  return axios({
    method: "GET",
    url: API_URL + "/admin/manager/nft/types",
  });
};

export const getNFTs = (
  page,
  pageSize,
  orderTime,
  mostLike,
  nftTypeId,
  nftName
) => {
  return axios({
    method: "GET",
    url: API_URL + "/admin/manager/nft/items/filter",
    params: {
      "page-number": page,
      "page-size": pageSize,
      "order-time": orderTime,
      "most-like": mostLike,
      "nft-type-id": nftTypeId,
      "item-name": nftName,
    },
  });
};


export const getNFT = (nftId) => {
    return axios({
        method: "GET",
        url: API_URL + "/admin/manager/nft/items/" + nftId,
    });
}

export const getNFTsBlockChain = (type, value) => {
  return axios({
    method: "POST",
    url: API_URL + "/listen-nft/scripts/get-collection-meta",
    data: {
      "arguments": [
        {
          type: type,
          value: value,
        },
      ],
      "code": 'hello'
    },
  });
};

export const approveNFT = (nftId) => {
  return axios({
    method: "PUT",
    url: API_URL + "/admin/manager/nft/items/" + nftId + "/approved?from-edition=0&to-edition=0&size-edition=0"
  });
};

export const approveMultiNFT = (nftId, fromEdition, toEdition, editionSize) => {
  return axios({
    method: "PUT",
    url: API_URL + "/admin/manager/nft/items/" + nftId + "/approved?from-edition=" + fromEdition + "&to-edition=" + toEdition + "&size-edition=" + editionSize
  });
};
