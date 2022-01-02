import ListenAuction from "../../contracts/ListenAuction.cdc"

pub fun main(auctionState: String, position: UInt64): [ListenAuction.AuctionMeta] { 
    let auctionsMeta : [ListenAuction.AuctionMeta] = []
    for auctionId in ListenAuction.getAuctionIDs() {
        let auction: ListenAuction.AuctionMeta = ListenAuction.getAuctionMeta(auctionID: auctionId)
        if auction.position == 0  {
            if (auction.auctionState ==  auctionState) {
                auctionsMeta.append(auction)
            }
        } else {
            if (auction.auctionState ==  auctionState)  && (auction.position == position) {
                auctionsMeta.append(auction)
            }
        }
    }     
    return auctionsMeta
}