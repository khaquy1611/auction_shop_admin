import FungibleToken from "../../contracts/dependencies/FungibleToken.cdc"
import ListenUSD from "../../contracts/ListenUSD.cdc"

// This transaction is a template for a transaction
// to add a Vault resource to their account
// so that they can use the ListenUSD

transaction {

    prepare(signer: AuthAccount) {

        if signer.borrow<&ListenUSD.Vault>(from: ListenUSD.VaultStoragePath) == nil {
            // Create a new ListenUSD Vault and put it in storage
            signer.save(<-ListenUSD.createEmptyVault(), to: ListenUSD.VaultStoragePath)

            // Create a public capability to the Vault that only exposes
            // the deposit function through the Receiver interface
            signer.link<&{FungibleToken.Receiver}>(
                ListenUSD.ReceiverPublicPath,
                target: ListenUSD.VaultStoragePath
            )

            // Create a public capability to the Vault that only exposes
            // the balance field through the Balance interface
            signer.link<&{FungibleToken.Balance}>(
                ListenUSD.BalancePublicPath,
                target: ListenUSD.VaultStoragePath
            )
        }
    }
}
