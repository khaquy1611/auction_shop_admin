import axios from "axios";
import { TOKEN_KEY, API_URL, API_KEY, API_URL_USING_API_KEY_CONTAIN} from "../modules/Configs";
import { getCookie } from "../modules/Utils";
import { cookieOptions } from "../modules/Configs";
import { emitter } from "../modules/Emitter";
import { NotificationManager } from "react-notifications";
import IntlMessages from "../util/IntlMessages";

axios.interceptors.request.use(
  function (config) {
    let isUsingApiKey = false

    let requestApiUrlElements = config.url.split("/")
    let usingApiKeyUrls = API_URL_USING_API_KEY_CONTAIN.split(",")

    usingApiKeyUrls.forEach(item => {
      if (requestApiUrlElements.includes(item)) {
        isUsingApiKey = true
      }
    });

    if (isUsingApiKey) {
      config.headers.Authorization = API_KEY;
    } else {
      const token = getCookie(TOKEN_KEY, cookieOptions);
      if (token) {
        config.headers.Authorization = token;
      }
    }

    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    if (error.response) {
      if (error.response.status === 401) {
        emitter.emit("EXPIRED_TOKEN");
      } else if (error.response.status === 403) {
        emitter.emit("EXPIRED_TOKEN");
      } else {
        if (String(error.response.status).startsWith("4")) {
          NotificationManager.warning(error.response.data.error, "");
        } else if (String(error.response.status).startsWith("5")) {
          NotificationManager.error(error.response.data.error, "");
        }
      }
    }
    if (error.toString() === "Error: Network Error") {
      NotificationManager.error(<IntlMessages id="network.error" />, "");
    }
    return Promise.reject(error);
  }
);
