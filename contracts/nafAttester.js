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

import { LookupMap, NearBindgen, call, initialize, near, view } from "near-sdk-js"
import { attestationRegistry } from "./nafRegistry"
import { rootAuthSchema } from "./nafAuthority"

@NearBindgen({ requireInit: true })
export class Attester {
    constructor() {
        this.AttestationRegistry = new LookupMap() //to store all the attestations
    }

    @initialize({})
    init({}) {
        //initialized the attestation parametres
        this.AccountID = near.signerAccountId()
        this.Schema = attestationRegistry.getSchema(this.AccountID)
        // this.RecipientId = get from front end
        // this.Balance = near.accountBalance() can be done via browser api
        this.Time = near.blockTimestamp()
        this.ExpirationTime = near.epochHeight() * 4
        this.blockHeight = near.blockHeight() //attestation checkpoint
    }

    @call({})
    attestationRequest() {
        //first get the nafId of the schema you want to use
        let attestationObject = new rootAuthSchema.Attestation()
        attestationObject.Schema = this.Schema
        attestationObject.Time = this.Time
        attestationObject.ExpirationTime = this.ExpirationTime
        attestationObject.blockHeight = this.blockHeight
        return attestationObject
    }

    @call({})
    storeAttestation({ attestationObject }) {
        let accountId = near.signerAccountId()
        this.AttestationRegistry.set(accountId, attestationObject)
    }

    @view({})
    retrieveAttestation({ account_id }) {
        return this.AttestationRegistry.get(account_id)
    }

    @call({})
    revokeAttestation({ accountId }) {
        this.AttestationRegistry.remove({ accountId })
    }
}
