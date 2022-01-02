import NonFungibleToken from "../../contracts/dependencies/NonFungibleToken.cdc"
import ListenNFT from "../../contracts/ListenNFT.cdc"

transaction {

    prepare(acct: AuthAccount) {
        // Return early if the account already has a collection
        let collection = acct.borrow<&ListenNFT.Collection>(from: ListenNFT.CollectionStoragePath) 

        if collection == nil {
            // create a new empty collection
            // save it to the account
            acct.save(<- ListenNFT.createEmptyCollection(), to: ListenNFT.CollectionStoragePath)
        }

        // create a public capability for the collection
        acct.link<&{NonFungibleToken.CollectionPublic, ListenNFT.CollectionPublic}>(
            ListenNFT.CollectionPublicPath,
            target: ListenNFT.CollectionStoragePath
        )

        log("saved and linked collection ")
    }
}
 