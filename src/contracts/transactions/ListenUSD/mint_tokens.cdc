import FungibleToken from "../../contracts/dependencies/FungibleToken.cdc"
import ListenUSD from "../../contracts/ListenUSD.cdc"

transaction(recipient: Address, amount: UFix64) {
    let tokenAdmin: &ListenUSD.Administrator
    let tokenReceiver: &{FungibleToken.Receiver}

    prepare(signer: AuthAccount) {
        self.tokenAdmin = signer
        .borrow<&ListenUSD.Administrator>(from: ListenUSD.AdminStoragePath)
        ?? panic("Signer is not the token admin")

        self.tokenReceiver = getAccount(recipient)
        .getCapability(ListenUSD.ReceiverPublicPath)
        .borrow<&{FungibleToken.Receiver}>()
        ?? panic("Unable to borrow receiver reference")
    }

    execute {
        let minter <- self.tokenAdmin.createNewMinter(allowedAmount: amount)
        let mintedVault <- minter.mintTokens(amount: amount)

        self.tokenReceiver.deposit(from: <-mintedVault)

        destroy minter
    }
}
