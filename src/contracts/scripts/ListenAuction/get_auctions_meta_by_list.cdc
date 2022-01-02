import ListenAuction from "../../contracts/ListenAuction.cdc"

pub fun main(auctions: [UInt64]): [ListenAuction.AuctionMeta] {
    let auctionsMeta : [ListenAuction.AuctionMeta] = []
    for auctionId in auctions {
        if ListenAuction.getAuctionIDs().contains(auctionId) {
            let auction: ListenAuction.AuctionMeta = ListenAuction.getAuctionMeta(auctionID: auctionId)
            if auction.auctionState != ListenAuction.stateToString(ListenAuction.AuctionState.Complete) {
                auctionsMeta.append(auction)
            }
        }
    }     
    return auctionsMeta
}