import axios from "axios";
import { API_URL } from "../modules/Configs";

export const createListing = (marketPlaceItem) => {
    return axios({
        method: "POST",
        url: API_URL + "/listen-mkp/transactions/create-listing",
        data:
        {
            "arguments": [
                {
                    "type": "Array",
                    "value": [
                        {
                            "type": "UInt64",
                            "value": `${marketPlaceItem.itemId}`,
                        }
                    ]
                }, 
                {
                    "type": "UFix64",
                    "value": `${parseFloat(marketPlaceItem.price).toFixed(1)}`,
                }
            ],
            "code": "string"
        }
        ,
    });
};


export const removeMarketPlaceItem = (id) => {
    return axios({
        method: "POST",
        url: API_URL + "/listen-mkp/transactions/remove-listing",
        data:
        {
            "arguments": [
                {
                    "type": "UInt64",
                    "value": `${id}`,
                }
            ],
            "code": "string"
        }
        ,
    });
}