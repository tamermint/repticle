//In order to make a new schema, you need to first adhere to certain rules
// 1. Make Schemas easy to read and understand
// 2. Make sure Schema names are descriptive
// 3. Make sure to reuse Schemas (if already available in the registry)
// 4. When using external providers, make sure to check whether they are supported!

import { createHash } from "crypto-browserify"
import { NearBindgen, call, view, initialize, near, LookupMap, NearBindgen } from "near-sdk-js"

//Build the schema object as per the rules

/* let NAF_Registry = new LookupMap("naf_r") //global variable to store the schemas */

@NearBindgen({})
export class attestationRegistry {
    constructor() {
        this.nafregistry = new LookupMap("naf_r")
    }

    schema = {
        name: schemaName, //name of the schema
        nafID: nafID, //uid of the schema
        attributes: attributes, //what all fields to be added
    }

    @call({})
    createSchema(name, attributes) {
        //take in these three params and then generate nafID, and get strict attributes
    }

    @call({})
    addSchema(schema) {
        accountID = near.signerAccountId()
        this.nafregistry.set(accountId, schema)
    }

    @view({})
    viewSchema() {
        return this.nafregistry.get(accountID)
    }
}

//Add in custom attributes
//Build your schema
//register your schema
