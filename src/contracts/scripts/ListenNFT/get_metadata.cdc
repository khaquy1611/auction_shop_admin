import NonFungibleToken from "../../contracts/dependencies/NonFungibleToken.cdc"
import ListenNFT from "../../contracts/ListenNFT.cdc"

// This script returns the metadata for an NFT in an account's collection.

pub fun main(address: Address, itemID: UInt64): {String:String} {
    // get the public account object for the token owner
    let account = getAccount(address)

    let collectionRef = account.getCapability(ListenNFT.CollectionPublicPath)
        .borrow<&{ListenNFT.CollectionPublic}>()
        ?? panic("Could not borrow capability from public collection")
 
    let metadata = collectionRef.getListenNFTMetadata(id: itemID)
    return metadata
}