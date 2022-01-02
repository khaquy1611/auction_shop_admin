import NonFungibleToken from "../../contracts/dependencies/NonFungibleToken.cdc"
import ListenNFT from "../../contracts/ListenNFT.cdc"

// This script uses the NFTMinter resource to mint a new NFT
// It must be run with the account that has the minter resource
// stored in /storage/NFTMinter

transaction(recipient: Address, metadata: {String:String}, ipfsPin: String, fromEdition: UInt64, toEdition: UInt64, editionSize: UInt64) {
    
    // local variable for storing the minter reference
    let minter: &ListenNFT.NFTMinter

    prepare(signer: AuthAccount) {
        pre {
            fromEdition <= toEdition : "From must be less than to edition" 
            toEdition <= editionSize : "To edition must be less than edition size"
        }

        // borrow a reference to the NFTMinter resource in storage
        self.minter = signer.borrow<&ListenNFT.NFTMinter>(from: ListenNFT.MinterStoragePath)
            ?? panic("Could not borrow a reference to the NFT minter")
    }

    execute {
        // Borrow the recipient's public NFT collection reference
        let receiver = getAccount(recipient)
            .getCapability(ListenNFT.CollectionPublicPath)
            .borrow<&{NonFungibleToken.CollectionPublic}>()
            ?? panic("Could not get receiver reference to the NFT Collection")

        // add edition info to metadata
        metadata["editionSize"] = editionSize.toString() 
        var edition = fromEdition
        while edition <= toEdition {
            metadata["edition"] = edition.toString() 
            // Mint the NFT and deposit it to the recipient's collection
            self.minter.mintNFT(recipient: receiver, metadata: metadata, ipfsPin: ipfsPin)
            edition = edition + 1
        }
    }
}
