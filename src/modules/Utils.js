import Cookies from 'universal-cookie';
import moment from 'moment';
require('dotenv').config()

export const setCookie = (key, value, option) => {
    let cookies = new Cookies();
    cookies.set(key, value, option);
};

export const getCookie = (key) => {
    let cookies = new Cookies();
    return cookies.get(key);
};

export const removeCookie = (key, option) => {
    let cookies = new Cookies();
    cookies.remove(key, option);
};

export function numberWithCommas(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export const formatAmount = (amount) => {
    return `${(parseFloat(amount)
      ?.toFixed(2)
      ?.toString()
      ?.replace(/(\d)(?=(\d{3})+\.)/g, "$1,"))}`
}

export function toDateWithTime(date) {
    return moment(date).format('MMMM Do YYYY, h:mm:ss');
}

export function validateNFTFileType(type) {
    switch (type) {
        case "image/jpeg":
        case "image/png":
        case "image/gif":
        case "image/svg+xml":
        case "audio/mpeg":
        case "video/mp4":
        case "audio/webm":
        case "video/webm":
        case "image/webp":
        case "audio/wav":
        case "video/quicktime":
        case "image/heif":
        case "image/heif-sequence":
        case "image/heic":
        case "image/heic-sequence":
            return true;
        default:
            return false;
    }
}

export function validateImageFileType(type) {
    switch (type) {
        case "image/jpeg":
        case "image/png":
        case "image/gif":
        case "image/svg+xml":
        case "image/heif":
        case "image/heif-sequence":
        case "image/heic":
        case "image/heic-sequence":
            return true;
        default:
            return false;
    }
}


export function getNFTStatus(status) {
    switch (status) {
        case "pending":
            return "PENDING";
        case "approved":
            return "APPROVED";
        default:
            return status;
    }
}

export const AuctionAddress = process.env.REACT_APP_AUCTION_ADDRESS