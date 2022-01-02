import ListenUSD from "../../contracts/ListenUSD.cdc"

// This script returns the total amount of ListenUSD currently in existence.

pub fun main(): UFix64 {

    let supply = ListenUSD.totalSupply

    log(supply)

    return supply
}
