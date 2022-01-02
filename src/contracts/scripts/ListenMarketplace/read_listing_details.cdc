import ListenMarketplace from "../../contracts/ListenMarketplace.cdc"

// This script returns the details for a listing within a ListenStorefront

pub fun main(account: Address, listingResourceID: UInt64): ListenMarketplace.ListingDetails {
    let ListenStorefrontRef = getAccount(account)
        .getCapability<&ListenMarketplace.ListenStorefront{ListenMarketplace.ListenStorefrontPublic}>
        (ListenMarketplace.ListenStorefrontPublicPath).borrow()
        ?? panic("Could not borrow public ListenStorefront from address")

    let listing = ListenStorefrontRef.borrowListing(listingResourceID: listingResourceID)
        ?? panic("No item with that ID")
    
    return listing.getDetails()
}