import { NearBindgen, call, view, near, UnorderedMap, Vector, NearBindgen } from "near-sdk-js"
import { object, string } from "prop-types"
import { Ecdsa, PrivateKey, Signature } from "starkbank-ecdsa"

//contract to first create a schema for the attestation service
//schema to have the following :
// --strict attributes
//   :address transaction history(near account primitive)
//   :address (of a smart contract/balance)
//   :near account balance (smart contract or wallet)
//   :near attestation schema serial (NAF-001, NAF-002, NAF-003 etc)
//   :near state root snapshot (state of near at the time attestation was made)
// --non-strict attributes(for example) (type string)
//   :farcaster address, or
//   :cross-chain w3credential provider id, or
//   :KYC-id

const EMPTY_NAFID = 0 //referring to an empty NAFId

const NO_EXPIRE = 0 //referring to attestation with no expiry

@NearBindgen({})
export class rootAuthSchema {
    static Attestation = {
        NAFId: string, //a unique id for the attestation schema
        AccountID: string, //accountid attesting
        RecipientID: string, //accountid of the attestation receiver
        Balance: BigInt, //balance of the attester's account
        Time: BigInt, //timestamp of the attestation
        ExpirationTime: BigInt, //time when attestation expires
        RevocationTime: BigInt, //time when the attestation was revoked
        isRevocable: Boolean, //whether this can be revoked or not
        history: string, //tx history hash of the account doing the attestation
        BlockHeight: BigInt, //attestation checkpoint
        Data: string, //custom data
    }

    @call({})
    return_account_id() {
        accountID = near.signerAccountPk()
        return accountID
    }

    @call({})
    make_signature() {
        let pubkey = this.return_account_id()
        let privateKey = PrivateKey.fromPem(pubkey)
        Signature = Ecdsa.sign(Attestation, privateKey)
        return Signature
    }
}
