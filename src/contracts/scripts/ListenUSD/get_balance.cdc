import FungibleToken from "../../contracts/dependencies/FungibleToken.cdc"
import ListenUSD from "../../contracts/ListenUSD.cdc"

// This script returns an account's ListenUSD balance.

pub fun main(address: Address): UFix64 {
    let account = getAccount(address)
    
    let vaultRef = account.getCapability(ListenUSD.BalancePublicPath).borrow<&{FungibleToken.Balance}>()
        ?? panic("Could not borrow Balance reference to the Vault")

    return vaultRef.balance
}