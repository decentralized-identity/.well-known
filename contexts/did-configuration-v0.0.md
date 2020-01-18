# DID Configuration Context

- [Latest JSON-LD Context](./did-configuration-v0.0.jsonld)

### Terminology

<h4 id="domainLinkageAssertion"><a href="#domainLinkageAssertion">domainLinkageAssertion</a></h4>

A claim object with fields for domain linkage assertions.

<h4 id="domain"><a href="#domain">domain</a></h4>

The domain being claimed to be linked to the DID in the domainLinkageAssertion.

<h4 id="iss"><a href="#iss">iss</a></h4>

The DID of the issuer making the domain linkage assertion. This is should be the same as the subject, since domain linkage assertions are self attestations.

<h4 id="sub"><a href="#sub">sub</a></h4>

The DID of the subject of the domain linkage assertion. This is should be the same as the issuer, since domain linkage assertions are self attestations.

<h4 id="exp"><a href="#exp">exp</a></h4>

The expiration time of the domain linkage assertions.
