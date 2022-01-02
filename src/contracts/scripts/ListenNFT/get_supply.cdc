import NonFungibleToken from "../../contracts/dependencies/NonFungibleToken.cdc"
import ListenNFT from "../../contracts/ListenNFT.cdc"


// This transaction returns a UInt64 

pub fun main(): UInt64 {
    return ListenNFT.totalSupply
}
