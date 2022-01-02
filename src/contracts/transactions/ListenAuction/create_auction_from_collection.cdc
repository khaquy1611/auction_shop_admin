// This Transaction template creates an auction for each NFT in a collection that all share the same startTime, duration and starting price.

import NonFungibleToken from "../../contracts/dependencies/NonFungibleToken.cdc"
import ListenNFT from "../../contracts/ListenNFT.cdc"
import ListenAuction from "../../contracts/ListenAuction.cdc"

transaction( startTime: UFix64, duration: UFix64, startingPrice: UFix64, bidStep: UFix64, position: UInt64 ) {

    prepare(acct: AuthAccount) {
        // Auction starts x seconds from now...... 
        // for convenince when testing remove in production and pass in startTime as unix starttime
        let startAt = ListenAuction.now() + startTime 

        let collectionRef = acct.borrow<&ListenNFT.Collection>(from: ListenNFT.CollectionStoragePath) // currently no support for dynamic storage paths
            ?? panic("Could not borrow a reference to the owner's collection")

        let admin = acct.borrow<&ListenAuction.Admin>(from: ListenAuction.AdminStoragePath)!
        
        // Create an Auction for each NFT in the collection.
        for id in collectionRef.getIDs() {
            let auctionPrizeCollection <- ListenNFT.createEmptyCollection() as! @ListenNFT.Collection
            let prizeNFT <- collectionRef.withdraw(withdrawID: id) as! @ListenNFT.NFT
            auctionPrizeCollection.deposit(token: <- prizeNFT)
        
            admin.createAuction( startTime: startAt, duration: duration, startingPrice: startingPrice, bidStep: bidStep, position: position, nftCollection: <- auctionPrizeCollection )
        }
    }
}
