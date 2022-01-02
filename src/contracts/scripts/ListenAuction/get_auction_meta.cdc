import ListenAuction from "../../contracts/ListenAuction.cdc"

pub fun main(auctionID: UInt64): ListenAuction.AuctionMeta {
    
    return ListenAuction.getAuctionMeta(auctionID: auctionID)
}