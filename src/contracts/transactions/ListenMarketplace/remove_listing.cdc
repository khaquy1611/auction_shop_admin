
import ListenMarketplace from "../../contracts/ListenMarketplace.cdc"

transaction(listingResourceID: UInt64) {
    let ListenStorefront: &ListenMarketplace.ListenStorefront{ListenMarketplace.ListenStorefrontManager}

    prepare(acct: AuthAccount) {
        self.ListenStorefront = acct.borrow<&ListenMarketplace.ListenStorefront{ListenMarketplace.ListenStorefrontManager}>
        (from: ListenMarketplace.ListenStorefrontStoragePath)
            ?? panic("Missing or mis-typed ListenMarketplace.ListenStorefront")
    }

    execute {
        self.ListenStorefront.removeListing(listingResourceID: listingResourceID)
    }
}