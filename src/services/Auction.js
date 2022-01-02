import axios from "axios";
import { toNumber, toString } from "lodash-es";
import { string } from "prop-types";
import { API_URL } from "../modules/Configs";
import { API_KEY } from "../modules/Configs";

export const getAuctions = (page, pageSize) => {
  return axios({
    method: "GET",
    url: API_URL + "/admin/manager/auctions",
    params: {
      "page-number": page,
      "page-size": pageSize,
    },
  });
};

export const getAuction = (auctionId) => {
  return axios({
    method: "GET",
    url: API_URL + "/admin/manager/auctions/" + auctionId,
  });
};

// beginTime: 1637308800
// bidStep: "5"
// endTime: 1637308800
// itemId: 0
// minimumPrice: "10"

// export const createAuction = (auction) => {
//     return axios({
//         method: "POST",
//         url: API_URL + "/admin/manager/auctions",
//         data: {
//             item_id: toNumber(auction.itemId),
//             minimum_price: parseFloat(auction.minimumPrice),
//             bid_step: parseFloat(auction.bidStep),
//             begin_time: parseFloat(auction.beginTime),
//             end_time: parseFloat(auction.endTime),
//         }
//     });
// };
const config = {
  headers: {
    "Content-type": "application/json",
    Authorization: `Bearer yx8oWTE9vkWSYs37WxpZiHr6XJwaXWFU`,
  },
};

export const createAuction = (auction, isCreateMulti) => {
  let body;
  let url = API_URL
  if (isCreateMulti) {
    url += "/listen-auction/transactions/create-auction-from-ids"
    const ids = []

    auction.itemIds.forEach(id => {
      ids.push(
        {
          "type": "UInt64",
          "value": `${id}`
        }
      )
    });
    body = {
      "arguments": [
        {"type":"UFix64","value": `${auction.beginTime}.0`},
        {"type":"UFix64","value": `${auction.endTime}.0`},
        {"type":"UFix64","value": `${auction.minimumPrice}.0`},
        {
          "type": "UFix64",
          "value": `${auction.bidStep}.0`,
        },
        {
          "type": "UInt64",
          "value": `${auction.position}`,
        },
        {
          "type": "Array",
          "value": ids
        }
      ],
      "code": "string"
    }
  } else {
    url += "/listen-auction/transactions/create-auction"
    body = {
      "arguments": [
        {"type":"UFix64","value": `${auction.beginTime}.0`},
        {"type":"UFix64","value": `${auction.endTime}.0`},
        {"type":"UFix64","value": `${auction.minimumPrice}.0`},
        {
          "type": "UFix64",
          "value": `${auction.bidStep}.0`,
        },
        {
          "type": "UInt64",
          "value": `${auction.position}`,
        },
        {
          "type": "UInt64",
          "value": `${auction.itemId}`,
        }
      ],
      "code": "string"
    }
  } 

  return axios({
    method: "POST",
    url: url,
    data: body
  });
};

export const getAuctionsMetaStatus = (type, value) => {
  return axios({
    method: "POST",
    url: API_URL + "/listen-auction/scripts/get-auctions-meta-by-status",
    data: {
      arguments: [
        {
          type: type,
          value: value,
        },
      ],
      code: "hello",
    },
  });
};


export const settleAuction = (autionId) => {
  const url = API_URL + "/listen-auction/transactions/settle-auction"
  console.log("axios ", axios);
  return axios({
    method: "POST",
    url: url,
    data: {
      "arguments": [
        {
          "type": "UInt64",
          "value": `${autionId}`,
        },
      ],
      code: "string",
    },
  });
}

export const removeAuction = (autionId) => {
  const url = API_URL + "/listen-auction/transactions/remove-auction"
  console.log("axios ", axios);
  return axios({
    method: "POST",
    url: url,
    data: {
      "arguments": [
        {
          "type": "UInt64",
          "value": `${autionId}`,
        },
      ],
      code: "string",
    },
  });
}