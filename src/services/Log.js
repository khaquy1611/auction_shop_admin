import axios from "axios";
import { API_URL } from "../modules/Configs";

export const getUserLogs = (filter, pageNumber, pageSize) => {
    return axios({
        method: "POST",
        url: API_URL + "/admin/manager/get-logs?page-number=" + pageNumber + "&page-size=" + pageSize,
        data: filter
    });
};
