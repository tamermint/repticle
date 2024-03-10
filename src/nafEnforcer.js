//script to make attestations
//also enforce attestations (checks whether attestation is valid)
//reputation determination in another script

/* //from the near blockchain:
//I.generate attestation
    //1.refer to the schema registry
    //2. use the attestation object
//II.generate ecdsa signature
    //3.put the attestation in a transaction
    //4.use a signed transaction --- eliminate starkbank ecdsa?
//III.send the transaction to the near blockchain
    //5.wait for receipt and generate receipt as confirmation */

import { NearBindgen, initialize, near } from "near-sdk-js"
import { attestationRegistry } from "./nafRegistry"
import { rootAuthSchema } from "./nafAuthority"
import { WalletConnection } from "near-api-js"

@NearBindgen({})
export class Enforcer {
    @initialize({})
    init({}) {
        //initialized the attestation parametres
        this.Schema = attestationRegistry.schema.nafID
        this.AccountID = near.predecessorAccountId()
        this.RecipientID = "vewake.testnet"
        this.Balance = near.accountBalance()
        this.Time = near.blockTimestamp()
        this.ExpirationTime = near.blockHeight()
        this.RevocationTime = near.storageRemove()
        this.isRevocable = false
    }

    @call({})
    attestationRequest(nafId) {
        //first get the nafId of the schema you want to use
        let schema = attestationRegistry.getSchema(near.signerAccountId())
        let attestation = new rootAuthSchema.Attestation()
        let signature = rootAuthSchema.make_signature(attestation)
    }
}
