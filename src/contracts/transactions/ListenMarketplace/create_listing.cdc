import FungibleToken from "../../contracts/dependencies/FungibleToken.cdc"
import NonFungibleToken from "../../contracts/dependencies/NonFungibleToken.cdc"
import ListenNFT from "../../contracts/ListenNFT.cdc"
import ListenUSD from "../../contracts/ListenUSD.cdc"
import ListenMarketplace from "../../contracts/ListenMarketplace.cdc"

transaction(saleItemIDs: [UInt64], salePrice: UFix64) {
    let listenNFTProvider: Capability<&{NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>
    let sellerReceiverCap: Capability<&{FungibleToken.Receiver}>

    let ListenStorefront: &ListenMarketplace.ListenStorefront

    prepare(acct: AuthAccount) {
        // We need a provider capability, but one is not provided by default so we create one if needed.
        let ListenNFTCollectionProviderPrivatePath = /private/ListenNFTCollectionProviderForListenStorefront

        // check account has appropriate nft provider capability
        if !acct.getCapability<&ListenNFT.Collection{NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>(ListenNFTCollectionProviderPrivatePath).check() {
            acct.link<&ListenNFT.Collection{NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>(ListenNFTCollectionProviderPrivatePath, target: ListenNFT.CollectionStoragePath)
        }
    
        self.sellerReceiverCap = acct.getCapability<&{FungibleToken.Receiver}>(ListenUSD.ReceiverPublicPath)
        assert(self.sellerReceiverCap.borrow() != nil, message: "Missing or mis-typed ListenUSD receiver")

        self.listenNFTProvider = acct.getCapability<&{NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>(ListenNFTCollectionProviderPrivatePath)
        assert(self.listenNFTProvider.borrow() != nil, message: "Missing or mis-typed ListenNFT.Collection provider")

        self.ListenStorefront = acct.borrow<&ListenMarketplace.ListenStorefront>(from: ListenMarketplace.ListenStorefrontStoragePath)
            ?? panic("Missing or mis-typed ListenMarketplace.ListenStorefront")
    }

    execute {
        self.ListenStorefront.createListing(
            nftProviderCapability: self.listenNFTProvider,
            nftType: Type<@ListenNFT.NFT>(),
            nftIDs: saleItemIDs,
            salePaymentVaultType: Type<@ListenUSD.Vault>(),
            ftReceiverCap: self.sellerReceiverCap,
            salePrice: salePrice
        )
    }
}
