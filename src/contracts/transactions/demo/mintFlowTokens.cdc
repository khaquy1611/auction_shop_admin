// Demo transaction to setup mint flow for deploying contracts to admin account 

import FungibleToken from "../../contracts/dependencies/FungibleToken.cdc" // 0xee82856bf20e2aa6
import FlowToken from "../../contracts/dependencies/FlowToken.cdc" // 0x0ae53cb6e3f42a79

transaction() {
  prepare(signer: AuthAccount) {

    // get reference to flow admin resource
    let flowTokenAdmin = signer.borrow<&FlowToken.Administrator>(from: /storage/flowTokenAdmin) ?? panic("no flow token administrator found in storage")

    // create a new minter
    let minter <- flowTokenAdmin.createNewMinter(allowedAmount: 300.0)

    let tokens <- minter.mintTokens(amount: 100.0)
    let tokens1 <- minter.mintTokens(amount: 100.0)
    let tokens2 <- minter.mintTokens(amount: 100.0)
   
    destroy minter
    // save minter to storage
    
    // borrow recipients
    let admin_account = getAccount(0x01cf0e2f2f715450)
          .getCapability(/public/flowTokenReceiver)
          .borrow<&{FungibleToken.Receiver}>()  ?? panic("Cannot borrow account: 01cf0e2f2f715450 flowTokenReceiver Cap")

    let user_account1 = getAccount(0x179b6b1cb6755e31)
          .getCapability(/public/flowTokenReceiver)
          .borrow<&{FungibleToken.Receiver}>()  ?? panic("Cannot borrow account: 0x179b6b1cb6755e31 flowTokenReceiver Cap")
    
    let user_account2 = getAccount(0xf3fcd2c1a78f5eee)
          .getCapability(/public/flowTokenReceiver)
          .borrow<&{FungibleToken.Receiver}>()  ?? panic("Cannot borrow account: 0xf3fcd2c1a78f5eee flowTokenReceiver Cap")

    admin_account.deposit( from: <- tokens )
    user_account1.deposit( from: <- tokens1 )
    user_account2.deposit( from: <- tokens2 )
  }
}
