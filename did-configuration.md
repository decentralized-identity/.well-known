
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
  "dids": {
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

#### Composition

The top-level of the JSON object MUST include a *dids* field with an object, wherein each entry is a DID the domain owner is claiming to control. Each entry in the "dids" field shall contain the following properties and values:

**jwt**: Base64 encoded JWT signed by valid keys from the claimed DID, which MUST include the following properties:
- *iss*: the DID unique ID string of the claimed DID
- *claim*: the domain or subdomain the resource is located at
...

### Domain-Inferred Claim Scope

The origin-location of the resource file MUST infer the domain scope of the claim. This means a `/.well-known/did-configuration` resource located at the base domain of a site, e.g. `example.com`, contains claims over the base domain. Any subdomain under `example.com`, for example: `entity1.example.com`, may also include `/.well-known/did-configuration` resource that includes claims a linkage between `entity1.example.com` and another set of DIDs, independent of what is defined in the resource files of other `example.com` domains.

The rational behind the allowance of domain-based scoping is to allow subdomains to control their own linkages to DIDs. This is necessary for sites that provide users with their own user, project, or entity-scoped subdomains, with which they may wish to associate with DIDs. It is not feasible to force a site or app that follows this common pattern to constantly update its base domain resource file with the possibly innumerable state changes required by subdomain users modifying their own resource entries.

Additionally, there is a desire to support Progressive Web Apps enhanced with DID-based features and functionality. PWAs are origin scoped to domains or subdomains, meaning a subdomain exists as its own distinct app scope. In order to allow a PWA that is installed from a subdomain to associate itself with a set of DIDs independently of another PWA or entity that is granted control over a different subdomain of the same TLD, there must be scope separation of `/.well-known/did-configuration` resources.
