import axios from "axios";
import { API_URL } from "../modules/Configs";

export const getListUser = (page, pageSize) => {
  return axios({
    method: "GET",
    url: API_URL + "/admin/manager/users",
    params: {
      "page-number": page,
      "page-size": pageSize,
    },
  });
};

export const getProfileUser = (idUser) => {
  return axios({
    method: "GET",
    url: API_URL + `/admin/manager/users/${idUser}`,
  });
};

export const deleteUser = (idUser) => {
  return axios({
    method: "DELETE",
    url: API_URL + `/admin/manager/users/${idUser}`,
  });
};
