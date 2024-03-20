//to check whether the attestation was made by a valid near account
//simple to check - whether the account.near made this attestation or not
//if not, revoke it

import { NearBindgen, call, view } from "near-sdk-js"
import { Attester } from "./nafAttester"
import { rootAuthSchema } from "./nafAuthority"

@NearBindgen({ requireInit: true })
export class verifier {
    @view({})
    nafRegistryCheck({ accountId }) {
        //check whether nafID exists or not
        let invalid_nafID = new rootAuthSchema.EMPTY_NAFID()
        if (!Attester.retrieveAttestation({ accountId })) {
            window.alert(`No Attestation found for this account, nafID: ${invalid_nafID}`)
        } else return retrieveAttestation({ accountId })
    }
    @call({})
    nafOwnerCheck({ accountId, attestation }) {
        if (this.attestation.accountId !== accountId) {
            revokeAttestation({ accountId })
            window.alert(`Attestation ${attestation} for account id ${accountId} has been removed!`)
        } else window.alert(`Attestation ${attestation} for account ${accountId} is verified!`)
    }
}
