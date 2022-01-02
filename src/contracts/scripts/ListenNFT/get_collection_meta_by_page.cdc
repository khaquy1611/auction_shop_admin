import NonFungibleToken from "../../contracts/dependencies/NonFungibleToken.cdc"
import ListenNFT from "../../contracts/ListenNFT.cdc"

pub fun main(account: Address, pageNumber: UInt64, pageSize: UInt64): [{String:String}] {
    let collectionRef = getAccount(account)
        .getCapability(ListenNFT.CollectionPublicPath)
        .borrow<&{ListenNFT.CollectionPublic, NonFungibleToken.CollectionPublic}>()
        ?? panic("Could not borrow capability from public collection")

    var total : UInt64 = UInt64(collectionRef!.getIDs().length)

    var nftsMeta : [{String:String}] = []
    var id : UInt64 =  pageSize *  pageNumber
    var maxId : UInt64 = total > (pageNumber + 1) * pageSize ? (pageNumber + 1) * pageSize : total

    while id < maxId {
        id = id + 1
        if collectionRef!.getIDs().contains(id) {
            var index = collectionRef!.getIDs()[id]
            var nftMetadata: {String:String} = collectionRef.getListenNFTMetadata(id: index)
            nftMetadata.insert(key:"nftId", index.toString())
            nftsMeta.append(nftMetadata)
        }
    }
    
    return nftsMeta  
}