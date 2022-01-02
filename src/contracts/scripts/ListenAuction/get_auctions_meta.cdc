import ListenAuction from "../../contracts/ListenAuction.cdc"

pub fun main(): [ListenAuction.AuctionMeta] {
    let auctionsMeta : [ListenAuction.AuctionMeta] = []
    for auctionId in ListenAuction.getAuctionIDs() {
        let auction: ListenAuction.AuctionMeta = ListenAuction.getAuctionMeta(auctionID: auctionId)
        if auction.auctionState != ListenAuction.stateToString(ListenAuction.AuctionState.Complete) {
            auctionsMeta.append(auction)
        }
    }     
    return auctionsMeta
}