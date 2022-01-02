// This Transaction template creates a single auction for a single NFT.

import NonFungibleToken from "../../contracts/dependencies/NonFungibleToken.cdc"
import ListenNFT from "../../contracts/ListenNFT.cdc"
import ListenAuction from "../../contracts/ListenAuction.cdc"

transaction( startTime: UFix64, duration: UFix64, startingPrice: UFix64, bidStep: UFix64, position: UInt64, tokenID: UInt64) {

    prepare(acct: AuthAccount) {
        // Auction starts x seconds from now...... 
        // for convenince when testing remove in production and pass in startTime as unix starttime
        let startAt = ListenAuction.now() + startTime 

        let collectionRef = acct.borrow<&ListenNFT.Collection>(from: ListenNFT.CollectionStoragePath)
            ?? panic("Could not borrow a reference to the owner's collection")

        let auctionPrizeCollection <- ListenNFT.createEmptyCollection() as! @ListenNFT.Collection
        let prizeNFT <- collectionRef.withdraw(withdrawID: tokenID) as! @ListenNFT.NFT // as! @NonFungibleToken.NFT
        auctionPrizeCollection.deposit(token: <- prizeNFT)
        
        let admin = acct.borrow<&ListenAuction.Admin>(from: ListenAuction.AdminStoragePath)!
        admin.createAuction( startTime: startAt, duration: duration, startingPrice: startingPrice, bidStep: bidStep, position: position, nftCollection: <- auctionPrizeCollection )
    }
}