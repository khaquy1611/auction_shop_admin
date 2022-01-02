import NonFungibleToken from "../../contracts/dependencies/NonFungibleToken.cdc"
import ListenNFT from "../../contracts/ListenNFT.cdc"

pub fun main(account: Address, nfts: [UInt64]): [{String:String}] {
    let collectionRef = getAccount(account)
        .getCapability(ListenNFT.CollectionPublicPath)
        .borrow<&{ListenNFT.CollectionPublic, NonFungibleToken.CollectionPublic}>()
        ?? panic("Could not borrow capability from public collection")

    var nftsMeta : [{String:String}] = []
    
    for id in nfts {
        if collectionRef!.getIDs().contains(id) {
            var nftMetadata: {String:String} = collectionRef.getListenNFTMetadata(id: id)
            nftMetadata.insert(key:"nftId", id.toString())
            nftsMeta.append(nftMetadata)
        }
    }
    return nftsMeta  
}