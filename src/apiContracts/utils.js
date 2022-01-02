
export const replaceAllTokenAddress = (source) => {
  source = source
    .replaceAll(
      `"../../contracts/dependencies/NonFungibleToken.cdc"`,
      process.env.REACT_APP_NON_FUNGIBLE_TOKEN
    )
    .replaceAll(
      `"../../contracts/dependencies/FungibleToken.cdc"`,
      process.env.REACT_APP_FUNGIBLE_TOKEN
    )
    .replaceAll(`"../../contracts/ListenNFT.cdc"`, process.env.REACT_APP_LISTEN_NFT)
    .replaceAll(`"../../contracts/ListenAuction.cdc"`, process.env.REACT_APP_LISTEN_AUCTION)
    .replaceAll(`"../../contracts/ListenUSD.cdc"`, process.env.REACT_APP_LISTEN_USD)
    .replaceAll(`"../../contracts/ListenMarketplace.cdc"`, process.env.REACT_APP_LISTEN_MARKET_PLACE);
  return source;
};
