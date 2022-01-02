import FungibleToken from "../../contracts/dependencies/FungibleToken.cdc"
import NonFungibleToken from "../../contracts/dependencies/NonFungibleToken.cdc"
import ListenNFT from "../../contracts/ListenNFT.cdc"
import ListenUSD from "../../contracts/ListenUSD.cdc"
import ListenMarketplace from "../../contracts/ListenMarketplace.cdc"

transaction(listingResourceID: UInt64, ListenStorefrontAddress: Address) {
    let paymentVault: @FungibleToken.Vault
    let ListenNFTCollection: &ListenNFT.Collection{NonFungibleToken.Receiver}
    let ListenStorefront: &ListenMarketplace.ListenStorefront{ListenMarketplace.ListenStorefrontPublic}
    let listing: &ListenMarketplace.Listing{ListenMarketplace.ListingPublic}

    prepare(acct: AuthAccount) {
        self.ListenStorefront = getAccount(ListenStorefrontAddress)
            .getCapability<&ListenMarketplace.ListenStorefront{ListenMarketplace.ListenStorefrontPublic}>(
                ListenMarketplace.ListenStorefrontPublicPath
            )
            .borrow()
            ?? panic("Could not borrow ListenStorefront from provided address")

        self.listing = self.ListenStorefront.borrowListing(listingResourceID: listingResourceID)
                    ?? panic("No Offer with that ID in ListenStorefront")
        let price = self.listing.getDetails().salePrice

        let ListenUSDVault = acct.borrow<&ListenUSD.Vault>(from: ListenUSD.VaultStoragePath)
            ?? panic("Cannot borrow ListenUSD vault from acct storage")

        self.paymentVault <- ListenUSDVault.withdraw(amount: price)

        self.ListenNFTCollection = acct.borrow<&ListenNFT.Collection{NonFungibleToken.Receiver}>(
            from: /storage/ListenNFTCollection
        ) ?? panic("Cannot borrow NFT collection receiver from account")
    }

    execute {
        let items <- self.listing.purchase(
            payment: <-self.paymentVault
        )

        for id in items.getIDs() {
            self.ListenNFTCollection.deposit(
                token: <- items.withdraw( withdrawID: id )
            )
        }

        assert(items.getIDs().length == 0, message: "Error when withdrawing purchased nfts")
        destroy items

        /* //-
        error: Execution failed:
        computation limited exceeded: 100
        */
        // Be kind and recycle
        self.ListenStorefront.cleanup(listingResourceID: listingResourceID)
    }

    //- Post to check item is in collection?
}
 