#### [View on GitHub](https://github.com/decentralized-identity/well-known-did-configuraton)

This repo contains proposals and links to proposals for `.well-known` uris related to DIDs, Hubs and Agents. See IETF [RFC5785](https://tools.ietf.org/html/rfc5785) for more details on Defining Well-Known Uniform Resource Identifiers.

### Please DO NOT contact IANA regarding registration of well known URIs associated with these specifications.

## .well-known/did-configuration.json

- [Spec](https://identity.foundation/well-known-did-configuration/resources/did-configuration/)
- [Example](https://identity.foundation/.well-known/did-configuration.json)

Contact: public-credentials@w3.org 

## `.well-known/did.json`

- [Spec](https://github.com/w3c-ccg/did-method-web)
- [Example](https://identity.foundation/.well-known/did.json)

Contact: public-credentials@w3.org 

## DID Working Group Repositories

- [W3C Decentralized Identifier Specification v1.0](https://github.com/w3c/did-core)
- [Home page of the Decentralized Identifier Working Group](https://github.com/w3c/did-wg)
- [Specs and documentation for all DID-related /.well-known resources](https://github.com/decentralized-identity/well-known-did-configuration)
- [W3C Decentralized Characteristics Rubric v1.0](https://github.com/w3c/did-rubric)
- [Decentralized Identifier Use Cases v1.0](https://github.com/w3c/did-use-cases)
- [W3C DID Test Suite and Implementation Report](https://github.com/w3c/did-test-suite)

### Known published DID documents

|implementer|did.json|did-configuration.json|date last checked (m-d-y)|
|---|---|---|---|
|dif| [X](https://identity.foundation/.well-known/did.json) |[X](https://identity.foundation/.well-known/did-configuration.json) |10-09-25|
|mattr global| [X](https://mattr.global/.well-known/did.json) | |10-09-25|
|trinsic| |[X](https://trinsic.id/.well-known/did-configuration.json) |10-09-20|

### Known reference implementations

|implementer|implementation|git repository|date last checked (m-d-y)|
|---|---|---|---|
|dif| [verification](https://check.identinet.io/) | https://github.com/identinet/check |10-09-25|
|Impierce Technologies| resolving, JSON validation of multiple did methods | https://github.com/impierce/did-manager |10-09-25|
|Impierce Technologies| verification | https://github.com/impierce/identity-wallet/tree/dev/identity-wallet/src/state/did |10-09-25|
|Impierce Technologies| DID document creation | https://github.com/impierce/ssi-agent/blob/beta/agent_identity/src/state.rs |10-09-25|
