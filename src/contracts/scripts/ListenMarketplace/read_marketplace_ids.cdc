import ListenMarketplace from "../../contracts/ListenMarketplace.cdc"

// This script returns an array of all the nft uuids for sale through a ListenStorefront

pub fun main(account: Address): [UInt64] {
    let ListenStorefrontRef = getAccount(account)
        .getCapability<&ListenMarketplace.ListenStorefront{ListenMarketplace.ListenStorefrontPublic}>(
            ListenMarketplace.ListenStorefrontPublicPath
        )
        .borrow()
        ?? panic("Could not borrow public ListenStorefront from address")
    
    return ListenStorefrontRef.getListingIDs()
}