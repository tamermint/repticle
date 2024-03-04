import { NearBindgen, call, view, near, UnorderedMap, NearBindgen } from "near-sdk-js"
import { object, string } from "prop-types"

//contract to first create a schema for the attestation service
//schema to have the following :
// --strict attributes
//   :address transaction history(near account primitive)
//   :address (of a smart contract/balance)
//   :near account balance (smart contract or wallet)
//   :near attestation schema serial (NAS-001, NAS-002, NAS-003 etc)
//   :near state root snapshot (state of near at the time attestation was made)
// --non-strict attributes(for example) (type string)
//   :farcaster address, or
//   :cross-chain w3credential provider id, or
//   :KYC-id

class rootAuthSchema {
    static immutableAttributes = {
        AccountID: string,
        Balance: BigInt,
        Time: BigInt,
        /* isRevocable: Boolean, */
        /* history: UnorderedMap,
        Serial: string, */
        BlockHeight: BigInt,
    }

    constructor() {
        this.AccountID = near.predecessorAccountId()
        this.Balance = near.accountBalance()
        this.Time = near.blockTimestamp()
        this.BlockHeight = near.blockHeight()
    }
}

@NearBindgen({})
export class makeSchema {
    static mutableAttributes = {
        immutableAttributes: rootAuthSchema,
        schema: object,
    }
}
