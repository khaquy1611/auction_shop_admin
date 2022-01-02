import ListenAuction from "../../contracts/ListenAuction.cdc"

pub fun main(): [UInt64] {
    return ListenAuction.getAuctionIDs()
}