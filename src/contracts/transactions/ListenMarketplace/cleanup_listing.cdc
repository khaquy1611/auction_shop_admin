import ListenMarketplace from "../../contracts/ListenMarketplace.cdc"

transaction(listingResourceID: UInt64, ListenStorefrontAddress: Address) {
    let ListenStorefront: &ListenMarketplace.ListenStorefront{ListenMarketplace.ListenStorefrontPublic}

    prepare(acct: AuthAccount) {
        self.ListenStorefront = getAccount(ListenStorefrontAddress)
            .getCapability<&ListenMarketplace.ListenStorefront{ListenMarketplace.ListenStorefrontPublic}>(
                ListenMarketplace.ListenStorefrontPublicPath
            )
            .borrow()
            ?? panic("Could not borrow ListenStorefront from provided address")
    }

    execute {
        // Be kind and recycle
        self.ListenStorefront.cleanup(listingResourceID: listingResourceID)
    }
}
