
# DID-to-Domain Linkage

The ability to bridge between existing systems and systems based on Decentralized Identifiers is an important undertaking that can aid in bootstrapping adoption and usefuless of DIDs in the market. One clear area where DIDs could benefit from being linked with legacy systems is proving an Internet domain and DID share the same controlling entity.

The easiest means for many with a Web presence to link their Internet domains to external systems is via publication of proving data somewhere under their domain they control. An ideal mechanism for deterministic, inferential lookup of such data is the existing Well-Known URI convention: https://tools.ietf.org/html/rfc5785.

## Functional Intent

We seek to expose verifiable data at a Well-Known URI endpoint that proves the controller of a domain/subdomain and a DID (or DIDs) is the same entity.

## Well-Known URI: `/.well-known/did-configuration`

In an effort to mirror existing Well-Known URIs, specifically, ones most closely related to the intent of exposing identity configuration data, such as `/.well-known/openid-configuration`, we propose the use of `/.well-known/did-configuration`.

### Resource Data Format

The format of the resource located at `/.well-known/did-configuration` shall be a JSON object, constructed as follows:

```js
{
  "typ": "jwt",
  "iat": 1565117957841,
  "claims": {
    "did:btcr:123...": {
      "jwt": BASE_64_ENCODED_JWT
    },
    "did:ethr:456...": {
      "jwt": BASE_64_ENCODED_JWT
    },
    "did:sov:789...": {
      "jwt": BASE_64_ENCODED_JWT
    }
  }
}
```

#### Resource Composition

##### Top-Level Object

The top-level object MUST be a JWT with the list of DID linkage assertions included under the `claims` field, wherein each entry is a DID the domain owner is claiming to control. Each entry MUST contain the following properties and values:

**`typ`** - Specifies the type of object, and MUST be of the value `jwt`.
**`iat`** - The time of publication, in epoch numeric datetime.
**`claims`** - An object of DID linkage entries, wherein the keys are the DID being linked to the domain via the assertion.

##### DID Linkage Entries

Each DID linkage entry under the `claims` property of the resource's top-level JWT object must contain the following properties and values:

**`jwt`** - Base64 encoded JWT signed by currently valid keys from the claimed DID. This object MUST include the following sub-properties:
- `iss`: the DID unique ID string of the claimed DID
- `claim`: the domain or subdomain the resource is located at
- `exp`: the time after which the claim of DID-to-domain linkage MUST NOT be deemed valid
...

### Validation of Linkage Claim

Validation of the claimed linkages between the domain and the DIDs present in the resource MUST proceed as follows:

1. Download the resource from the subdomain
2. Validate that the resource is a JWT
3. Iterate through each of the DID linkage assertions in the `claims` field
4. Process each DID linkage assertion as follows:
    1. Decode the JWT value of the linkage assertion
    2. Ensure the `claims` property value within the linkage assertion matches the same domain at which the resource is located.
    3. Ensure the `exp` property's specified expiry time has not passed.
    3. Resolve the DID specified in linkage assertion's `iss` value.
    4. Validate the JWT signature using the keys in the DID's resolved DID Document.

### Domain-Inferred Claim Scope

The origin-location of the resource file MUST infer the domain scope of the claim. This means a `/.well-known/did-configuration` resource located at the base domain of a site, e.g. `example.com`, contains claims over the base domain. Any subdomain under `example.com`, for example: `entity1.example.com`, may also include `/.well-known/did-configuration` resource that includes claims a linkage between `entity1.example.com` and another set of DIDs, independent of what is defined in the resource files of other `example.com` domains.

The rational behind the allowance of domain-based scoping is to allow subdomains to control their own linkages to DIDs. This is necessary for sites that provide users with their own user, project, or entity-scoped subdomains, with which they may wish to associate with DIDs. It is not feasible to force a site or app that follows this common pattern to constantly update its base domain resource file with the possibly innumerable state changes required by subdomain users modifying their own resource entries.

Additionally, there is a desire to support Progressive Web Apps enhanced with DID-based features and functionality. PWAs are origin scoped to domains or subdomains, meaning a subdomain exists as its own distinct app scope. In order to allow a PWA that is installed from a subdomain to associate itself with a set of DIDs independently of another PWA or entity that is granted control over a different subdomain of the same TLD, there must be scope separation of `/.well-known/did-configuration` resources.
