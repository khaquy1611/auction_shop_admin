export const cookieOptions = {
    path: '/',
    domain: window.location.host.includes(".pentawork.com") ? '.pentawork.com' : '',
    secure: window.location.protocol === 'https:',
    expires: new Date(Date.now() + (3600 * 1000 * 3))
};
export const API_URL = process.env.REACT_APP_API_URL;
export const TOKEN_KEY = "auction-admin-token";
export const API_KEY = "yx8oWTE9vkWSYs37WxpZiHr6XJwaXWFU";
export const API_URL_USING_API_KEY_CONTAIN = "transactions"   // separate multi by comma