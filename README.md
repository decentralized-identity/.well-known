### Please DO NOT contact IANA regarding registration of well known URIs associated with these specifications.

# Well-Known DID Configuration

This specification defines a way for a website to prove that its DID is verifiably linked to that website. Well-Known DID configuration builds on and is an extension to the core [DID specification](https://www.w3.org/TR/did-1.0/). Furthermore, it  establishes the `/.well-known/did-configuration.json` URI pattern, which is [IANA registered](https://www.iana.org/assignments/well-known-uris/well-known-uris.xhtml).

> Note: The examples in this spec mostly make use of the [did:web Method specification](https://w3c-ccg.github.io/did-method-web/). However, this specification works with any DID method supporting the `services` property in the [DID document](https://www.w3.org/TR/did-1.0/#services) (e.g. did:jwk and [did:key](https://w3c-ccg.github.io/did-key-spec/) don't support this, [did:web](https://w3c-ccg.github.io/did-method-web/) and [did:iota](https://docs.iota.org/developer/iota-identity/references/iota-did-method-spec) do support it)

## What this solves

The problem that was unsolved in the [DID core specification]() as well as in the [did:web Method specification](https://w3c-ccg.github.io/did-method-web/) is verifiably proving that a DID belongs to a website and vice versa. To be more specific this specification links an [origin](https://datatracker.ietf.org/doc/html/rfc6454) with a DID. This means a DID cannot be linked to any website URL with path segments for example, only to the website [origin](https://datatracker.ietf.org/doc/html/rfc6454).

This specification makes this possible by building on the `LinkedDomains` service of the [DID document](https://www.w3.org/TR/did-1.0/#services). The `serviceEndpoint` field contains the website [origin](https://datatracker.ietf.org/doc/html/rfc6454), which in turn hosts the `/.well-known/did-configuration.json`. The `did-configuration.json` file then holds a [Verifiable Credential](https://www.w3.org/TR/vc-data-model/) (VC) claiming the [origin](https://datatracker.ietf.org/doc/html/rfc6454). This [Verifiable Credential](https://www.w3.org/TR/vc-data-model/) must be signed with key material from the original [DID document](https://www.w3.org/TR/did-1.0/#services) which contains the `LinkedDomains` service. 

> Note: The DID document can be hosted at the [IANA registered](https://www.iana.org/assignments/well-known-uris/well-known-uris.xhtml) well-known endpoint of the same origin, `/.well-known/did.json`, but this is specific to the [did:web Method specification](https://w3c-ccg.github.io/did-method-web/). The DID configuration however, works with any did method supporting the DID document services and these DID documents can be hosted anywhere, not necessarily at `/.well-known/did.json`.


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

### Known implementations

| implementer  | did.json                                                   | did-configuration.json                                                   | date last checked |
| ------------ | ---------------------------------------------------------- | ------------------------------------------------------------------------ | ----------------- |
| dif          | [X](https://identity.foundation/.well-known/did.json)      | [X](https://identity.foundation/.well-known/did-configuration.json)      | 12-10-20          |
| transmute    | [X](https://www.transmute.industries/.well-known/did.json) | [X](https://www.transmute.industries/.well-known/did-configuration.json) | 12-10-20          |
| mattr global | [X](https://mattr.global/.well-known/did.json)             |                                                                          | 12-10-20          |
| trinsic      | [X](https://trinsic.id/.well-known/did.json)               | [X](https://trinsic.id/.well-known/did-configuration.json)               | 12-15-20          |
