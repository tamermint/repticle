import { NearBindgen, call, view, near, UnorderedMap, Vector, NearBindgen } from "near-sdk-js"
import { object, string } from "prop-types"
import { Ecdsa, PrivateKey, Signature } from "starkbank-ecdsa"

//contract to first create an attestation object
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

@NearBindgen({ requireInit: true })
export class rootAuthSchema {
    static Attestation = {
        AccountID: string, //accountid attesting
        Schema: object, //the schema
        RecipientID: string, //accountid of the attestation receiver
        Balance: BigInt, //balance of the attester's account
        Time: BigInt, //timestamp of the attestation
        ExpirationTime: BigInt, //time when attestation expires
        RevocationTime: BigInt, //time when the attestation was revoked
        isRevocable: Boolean, //whether this can be revoked or not
        BlockHeight: BigInt, //attestation checkpoint
    }

    static EMPTY_NAFID = 0

    static NO_EXPIRE = 0
}
