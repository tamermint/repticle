//In order to make a new schema, you need to first adhere to certain rules
// 1. Make Schemas easy to read and understand
// 2. Make sure Schema names are descriptive
// 3. Make sure to reuse Schemas (if already available in the registry)
// 4. When using external providers, make sure to check whether they are supported!

import { NearBindgen, call, view, near, NearBindgen, UnorderedMap } from "near-sdk-js"
import { object, string } from "prop-types"
import { Ecdsa, PrivateKey, Signature } from "starkbank-ecdsa"
import { v4 as uuidv4 } from "uuid"

//Build the schema object as per the rules

/* let NAF_Registry = new LookupMap("naf_r") //global variable to store the schemas */

class Schema {
    constructor(name, nafID, attributes) {
        this.name = name //name of the schema
        this.nafID = nafID //uid of the schema
        this.attributes = attributes //what all fields to be added
        this.signature = signature //you're adding your signature to the schema
    }
}
@NearBindgen({ requireInit: true })
export class attestationRegistry {
    constructor() {
        this.nafregistry = new UnorderedMap("naf_r")
    }
    static Attestation = {
        Schema: Schema, //the schema
        AccountID: string, //accountid attesting
        RecipientID: string, //accountid of the attestation receiver
        Balance: BigInt, //balance of the attester's account
        Time: BigInt, //timestamp of the attestation
        ExpirationTime: BigInt, //time when attestation expires
        RevocationTime: BigInt, //time when the attestation was revoked
        isRevocable: Boolean, //whether this can be revoked or not
        BlockHeight: BigInt, //attestation checkpoint
    }

    @call({})
    return_account_id() {
        accountID = near.signerAccountPk()
        return accountID
    }

    @call({})
    make_signature(Attestation) {
        let pubkey = this.return_account_id()
        let privateKey = PrivateKey.fromPem(pubkey)
        Signature = Ecdsa.sign(Attestation, privateKey)
        return Signature
    }

    @call({})
    createSchema(name, nafID, attributes, signature) {
        //take in these params and then generate nafID, and get strict attributes
        //get the name from front end
        name = "newSchema"
        //get attributes from front end (need to parse it into JS)
        attributes = JSON.stringify({
            iLike: true,
            certAuthority: "no",
        })
        //checking if a schema with same name and attributes already exists
        const schemaArray = this.nafregistry.toArray()
        for (let i = 0; i < schemaArray.length; i++) {
            if (
                schemaArray.indexOf(schemaArray[name] !== -1) &&
                schemaArray.indexOf(schemaArray[attributes] !== -1)
            ) {
                throw Error("Schema already exists! Please search the registry and reuse Schema")
            } else {
                //generate nafID
                nafID = uuidv4()
                signature = this.make_signature(near.signerAccountPk())
                //call the class constructor outside of Bindgen
                return new Schema(name, nafID, attributes, signature)
            }
        }
    }

    @call({})
    addSchema(schema) {
        accountID = near.signerAccountId()
        this.nafregistry.set(accountID, schema)
    }

    @view({})
    getSchema(accountID) {
        return this.nafregistry.get(accountID)
    }

    @view({})
    viewRegistry() {
        const schemaArray = this.nafregistry.toArray()
        for (let accountID of schemaArray) {
            console.log(`${accountID}: ${accountID.schema}`)
        }
    }
}
