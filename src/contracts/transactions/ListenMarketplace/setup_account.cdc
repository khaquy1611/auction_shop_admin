import ListenMarketplace from "../../contracts/ListenMarketplace.cdc"

// This transaction installs the ListenStorefront ressource in an account.

transaction {
    prepare(acct: AuthAccount) {

        // If the account doesn't already have a ListenStorefront
        if acct.borrow<&ListenMarketplace.ListenStorefront>(from: ListenMarketplace.ListenStorefrontStoragePath) == nil {

            // Create a new empty .ListenStorefront
            let ListenStorefront <- ListenMarketplace.createListenStorefront() // as! @ListenMarketplace.ListenStorefront
            
            // save it to the account
            acct.save(<-ListenStorefront, to: ListenMarketplace.ListenStorefrontStoragePath)

            // create a public capability for the .ListenStorefront
            acct.link<&ListenMarketplace.ListenStorefront{ListenMarketplace.ListenStorefrontPublic}>(ListenMarketplace.ListenStorefrontPublicPath, target: ListenMarketplace.ListenStorefrontStoragePath)
        }
    }
}
