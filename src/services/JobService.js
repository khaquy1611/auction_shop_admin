import axios from "axios";
import { API_URL } from "../modules/Configs";
import { NotificationManager } from "react-notifications";
import IntlMessages from "../util/IntlMessages";
import { JOB_STATUS } from "../constants/utils"

export const checkJobId = (jobId) => {
  return axios({
    method: "GET",
    url: API_URL + "/jobs/" + jobId,
  });
};


export const handleCheckJobId = (jobId, onSuccess, onError) => {
  checkJobId(jobId).then((res) => {
    if (res?.data?.status === JOB_STATUS.ERROR) {
      onError()
      NotificationManager.error(<IntlMessages id="failed" />, "");
    }
    if (res?.data.status === JOB_STATUS.ACCEPTED) {
      NotificationManager.success(<IntlMessages id="waiting" />, "");
      const interval = setInterval(() => {
        checkJobId(jobId).then((res) => {
          if (res?.data?.status === JOB_STATUS.COMPLETE) {
            clearInterval(interval);
            NotificationManager.success(<IntlMessages id="success" />, "");
            onSuccess()
          }
          if (res?.data?.status === JOB_STATUS.ERROR) {
            clearInterval(interval);
            onError()
            NotificationManager.error(<IntlMessages id="failed" />, "");
          }
        });
      }, 3000);
      setTimeout(() => {
        clearInterval(interval);
      }, 30000);
    }
  })
}