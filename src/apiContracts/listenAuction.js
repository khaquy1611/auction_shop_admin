// import libraly
import { config, query } from "@onflow/fcl";
import { replaceAllTokenAddress } from "./utils";
import getAuctionMeta from "../contracts/scripts/ListenAuction/get_auction_meta.cdc";
import getAuctionMetaByStatus from "../contracts/scripts/ListenAuction/get_auctions_meta_by_status.cdc";
import getAucionsMeta from "../contracts/scripts/ListenAuction/get_auctions_meta.cdc";
import getAuctions from "../contracts/scripts/ListenAuction/get_auctions.cdc";
import getListing from "../contracts/scripts/ListenMarketplace/read_listing_details.cdc";
import getMarket from "../contracts/scripts/ListenMarketplace/read_marketplace_ids.cdc";
import getMeta from "../contracts/scripts/ListenNFT/get_metadata.cdc";

export const customeGetAucionsMeta = () => {
  return fetch(getAucionsMeta)
    .then((r) => r.text())
    .then(async (text) => {
      const cadence = replaceAllTokenAddress(text);
      config().put("accessNode.api", process.env.REACT_APP_FLOW_ADDRESS);
      const data = await query({
        cadence,
        args: (arg, t) => [],
      });
      return data;
    });
};

export const customeGetAuctionMetaByStatus = (Status, position) => {
  return fetch(getAuctionMetaByStatus)
    .then((r) => r.text())
    .then(async (text) => {
      const cadence = replaceAllTokenAddress(text);
      config().put("accessNode.api", process.env.REACT_APP_FLOW_ADDRESS);
      const data = await query({
        cadence,
        args: (arg, t) => [arg(Status, t.String), arg(position, t.UInt64)],
      });
      return data;
    });
};

export const customeGetAucionMeta = (auctionID) => {
  return fetch(getAuctionMeta)
    .then((r) => r.text())
    .then(async (text) => {
      const cadence = replaceAllTokenAddress(text);
      config().put("accessNode.api", process.env.REACT_APP_FLOW_ADDRESS);
      const data = await query({
        cadence,
        args: (arg, t) => [arg(parseInt(auctionID), t.UInt64)],
      });
      return data;
    });
};

export const customeGetAucions = () => {
  return fetch(getAuctions)
    .then((r) => r.text())
    .then(async (text) => {
      const cadence = replaceAllTokenAddress(text);
      config().put("accessNode.api", process.env.REACT_APP_FLOW_ADDRESS);
      const data = await query({
        cadence,
        args: (arg, t) => [],
      });
      return data;
    });
};


export const customGetListing = (Address, NFTid) => {
  return fetch(getListing)
    .then((r) => r.text())
    .then(async (text) => {
      const cadence = replaceAllTokenAddress(text);
      config().put("accessNode.api", process.env.REACT_APP_FLOW_ADDRESS);
      const data = await query({
        cadence,
        args: (arg, t) => [arg(Address, t.Address), arg(NFTid, t.UInt64)],
      });
      return data;
    });
};

// read_marketplace_ids.cdc
export const customGetMarket = (Address) => {
  return fetch(getMarket)
    .then((r) => r.text())
    .then(async (text) => {
      const cadence = replaceAllTokenAddress(text);
      config().put("accessNode.api", process.env.REACT_APP_FLOW_ADDRESS);
      const data = await query({
        cadence,
        args: (arg, t) => [arg(Address, t.Address)],
      });
      return data;
    });
};

export const customGetMeta = (Address, NFTid) => {  
  return fetch(getMeta)
    .then((r) => r.text())
    .then(async (text) => {
      const cadence = replaceAllTokenAddress(text);
      config().put("accessNode.api", process.env.REACT_APP_FLOW_ADDRESS);
      const data = await query({
        cadence,
        args: (arg, t) => [arg(Address, t.Address), arg(NFTid, t.UInt64)],
      });
      return data;
    });
};