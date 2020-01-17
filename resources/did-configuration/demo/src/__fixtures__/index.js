const defaultExpiresInHours = 999999;

export const vcJWTProofPayload = {
  sub: "did:ethr:0xf1232f840f3ad7d23fcdaa84d6c66dac24efb198",
  nbf: 1562950282,
  vc: {
    "@context": [
      "https://www.w3.org/2018/credentials/v1",
      "https://identity.foundation/.well-known/contexts/did-configuration-v0.0.jsonld"
    ],
    type: ["VerifiableCredential", "DomainLinkageAssertion"],
    credentialSubject: {
      domainLinkageAssertion: {
        iss: "did:ethr:0xf1232f840f3ad7d23fcdaa84d6c66dac24efb198",
        domain: "identity.foundation",
        exp: 1475878357
      }
    }
  }
};

const vcLinkedDataProofPayload = {
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    "https://identity.foundation/.well-known/contexts/did-configuration-v0.0.jsonld"
  ],
  id: "https://example.com/credentials/0",
  type: ["VerifiableCredential", "DomainLinkageAssertion"],
  issuer: "did:ethr:0xf1232f840f3ad7d23fcdaa84d6c66dac24efb198",
  issuanceDate: "2019-12-02T15:08:37.751Z",
  credentialSubject: vcJWTProofPayload.vc.credentialSubject
};

export const getDomainLinkageAssertionVCJWTProofPayload = (domain, did) => {
  const payload = { ...vcJWTProofPayload };
  payload.iss = did;
  payload.sub = did;
  payload.nbf = Math.floor(Date.now() / 1000);
  payload.vc.credentialSubject.domainLinkageAssertion.iss = did;
  payload.vc.credentialSubject.domainLinkageAssertion.domain = domain;
  payload.vc.credentialSubject.domainLinkageAssertion.exp =
    Math.floor(Date.now() / 1000) + 60 * 60 * defaultExpiresInHours;
  return payload;
};

export const getDomainLinkageAssertionVCLinkedDataProofPayload = (
  domain,
  did
) => {
  const payload = { ...vcLinkedDataProofPayload };
  payload.issuer = did;
  payload.credentialSubject.domainLinkageAssertion.iss = did;
  payload.credentialSubject.domainLinkageAssertion.domain = domain;
  payload.credentialSubject.domainLinkageAssertion.exp =
    Math.floor(Date.now() / 1000) + 60 * 60 * defaultExpiresInHours;
  return payload;
};

export const documentLoader = require("./documentLoader");
