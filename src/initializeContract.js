import { NearBindgen, call, view, near } from "near-sdk-js";

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