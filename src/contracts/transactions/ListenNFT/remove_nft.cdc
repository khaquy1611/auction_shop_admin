import NonFungibleToken from "../../contracts/dependencies/NonFungibleToken.cdc"
import ListenNFT from "../../contracts/ListenNFT.cdc"

// This transaction is for transferring and NFT from
// one account to another

transaction(withdrawID: UInt64) {
    prepare(acct: AuthAccount) {
        // borrow a reference to the signer's NFT collection
        let collectionRef = acct.borrow<&ListenNFT.Collection>(from: ListenNFT.CollectionStoragePath)
            ?? panic("Could not borrow a reference to the owner's collection")
        // withdraw the NFT from the owner's collection
        let nft <- collectionRef.withdraw(withdrawID: withdrawID)
        // Remove the NFT
        destroy(nft)
    }
}