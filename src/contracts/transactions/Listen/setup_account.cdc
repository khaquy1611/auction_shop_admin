import FungibleToken from "../../contracts/dependencies/FungibleToken.cdc"
import NonFungibleToken from "../../contracts/dependencies/NonFungibleToken.cdc"
import ListenUSD from "../../contracts/ListenUSD.cdc"
import ListenNFT from "../../contracts/ListenNFT.cdc"
import ListenMarketplace from "../../contracts/ListenMarketplace.cdc"

// Transaction to setup all required resources for ListenUSD & Listen Auction & Marketplace

transaction { 

    prepare(signer: AuthAccount) {

        if signer.borrow<&ListenUSD.Vault>(from: ListenUSD.VaultStoragePath) == nil {
            signer.save(<-ListenUSD.createEmptyVault(), to: ListenUSD.VaultStoragePath)

            signer.link<&{FungibleToken.Receiver}>(
                ListenUSD.ReceiverPublicPath,
                target: ListenUSD.VaultStoragePath
            )

            signer.link<&{FungibleToken.Balance}>(
                ListenUSD.BalancePublicPath,
                target: ListenUSD.VaultStoragePath
            )
        }

        if signer.borrow<&ListenNFT.Collection>(from: ListenNFT.CollectionStoragePath) == nil {
            signer.save(<- ListenNFT.createEmptyCollection(), to: ListenNFT.CollectionStoragePath)

            signer.link<&{NonFungibleToken.CollectionPublic, ListenNFT.CollectionPublic}>(
                ListenNFT.CollectionPublicPath,
                target: ListenNFT.CollectionStoragePath
            )

        }

        if signer.borrow<&ListenMarketplace.ListenStorefront>(from: ListenMarketplace.ListenStorefrontStoragePath) == nil { 
            signer.save(<-ListenMarketplace.createListenStorefront(), to: ListenMarketplace.ListenStorefrontStoragePath)

            signer.link<&ListenMarketplace.ListenStorefront{ListenMarketplace.ListenStorefrontPublic}>(
                ListenMarketplace.ListenStorefrontPublicPath, 
                target: ListenMarketplace.ListenStorefrontStoragePath
            )
        }
  
    }
}