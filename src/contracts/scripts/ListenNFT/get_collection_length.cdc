import NonFungibleToken from "../../contracts/dependencies/NonFungibleToken.cdc"
import ListenNFT from "../../contracts/ListenNFT.cdc"


// This script returns the size of an account's ListenNFT collection.

pub fun main(address: Address): Int {
    // get the public account object for the token owner
    let account = getAccount(address)

    let collectionRef = account.getCapability(ListenNFT.CollectionPublicPath)
        .borrow<&{NonFungibleToken.CollectionPublic}>()
        ?? panic("Could not borrow capability from public collection")
    
    return collectionRef.getIDs().length
}