import FungibleToken from "../../contracts/dependencies/FungibleToken.cdc"
import ListenUSD from "../../contracts/ListenUSD.cdc"

// This transaction is a template for a transaction that
// could be used by anyone to burn tokens 

transaction(amount: UFix64) {

    // The Vault resource that holds the tokens that are being transferred
    let burnVault: @FungibleToken.Vault

    prepare(signer: AuthAccount) {

        // Get a reference to the signer's stored vault
        let vaultRef = signer.borrow<&ListenUSD.Vault>(from: ListenUSD.VaultStoragePath)
			?? panic("Could not borrow reference to the owner's Vault!")

        // Withdraw tokens from the signer's stored vault
        self.burnVault <- vaultRef.withdraw(amount: amount)
    }

    execute {

        // Burn the withdrawn tokens 
        destroy self.burnVault
    }
}
