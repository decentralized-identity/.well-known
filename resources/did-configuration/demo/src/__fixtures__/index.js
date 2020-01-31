import documentLoader from "./documentLoader";

const defaultExpiresInHours = 999999;

const vc = require("vc-js");
const jsigs = require("jsonld-signatures");

const { Ed25519KeyPair } = require("crypto-ld");

const { Ed25519Signature2018 } = jsigs.suites;

const ES256K = require("@transmute/es256k-jws-ts");

export const vcJWTProofPayload = {
  sub: "did:ethr:0xf1232f840f3ad7d23fcdaa84d6c66dac24efb198",
  iss: "did:ethr:0xf1232f840f3ad7d23fcdaa84d6c66dac24efb198",
  nbf: 1562950282,
  exp: 1475878357,
  vc: {
    "@context": [
      "https://www.w3.org/2018/credentials/v1",
      "https://identity.foundation/.well-known/contexts/did-configuration-v0.0.jsonld"
    ],
    type: ["VerifiableCredential", "DomainLinkageAssertion"],
    credentialSubject: {
      domainLinkageAssertion: {
        domain: "identity.foundation"
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
  payload.exp = Math.floor(Date.now() / 1000) + 60 * 60 * defaultExpiresInHours;
  payload.vc.credentialSubject.domainLinkageAssertion.domain = domain;
  return payload;
};

export const getDomainLinkageAssertionVCLinkedDataProofPayload = (
  domain,
  did
) => {
  const payload = { ...vcLinkedDataProofPayload };
  payload.issuer = did;
  payload.credentialSubject.domainLinkageAssertion.domain = domain;
  return payload;
};

export { default as documentLoader } from "./documentLoader";

export const createDidConfiguration = entries => {
  const didConfiguration = {
    "@context":
      "https://identity.foundation/.well-known/contexts/did-configuration-v0.0.jsonld",
    entries
  };

  return didConfiguration;
};

export const verifyDidConfiguration = async (didConfiguration, did) => {
  let isValid = false;

  await Promise.all(
    didConfiguration.entries.map(async entry => {
      if (entry.did === did) {
        if (typeof entry.vc === "string") {
          // assume vc jwt...
          const controller = (await documentLoader(entry.did)).document;
          const decoded = ES256K.JWS.decode(entry.vc, { complete: true });

          const publicKey = controller.publicKey.find(k => {
            return k.id === controller.id + "#" + decoded.header.kid;
          });

          const verified = await ES256K.JWT.verify(
            entry.vc,
            publicKey.publicKeyJwk
          );

          isValid = verified.iss === controller.id;
        }

        if (typeof entry.vc === "object") {
          // assume vc ld proof...

          const controller = (await documentLoader(entry.did)).document;
          const publicKey = controller.publicKey.find(k => {
            return k.id === entry.vc.proof.verificationMethod;
          });
          const suite = new Ed25519Signature2018({
            key: new Ed25519KeyPair(publicKey)
          });
          const result = await vc.verify({
            credential: entry.vc,
            suite,
            documentLoader
          });
          // console.log(result);
          isValid = result.verified;
        }
      }
    })
  );

  return isValid;
};

export const getDecodedVc = async (didConfiguration, did) => {
  let decodedVc = null;

  await Promise.all(
    didConfiguration.entries.map(async entry => {
      if (entry.did === did) {
        if (typeof entry.vc === "string") {
          // assume vc jwt...
          const controller = (await documentLoader(entry.did)).document;
          const decoded = ES256K.JWS.decode(entry.vc, { complete: true });

          const publicKey = controller.publicKey.find(k => {
            return k.id === controller.id + "#" + decoded.header.kid;
          });

          const verified = await ES256K.JWT.verify(
            entry.vc,
            publicKey.publicKeyJwk
          );
          if (verified.iss === controller.id) {
            decodedVc = decoded.payload.vc;
          }
        }

        if (typeof entry.vc === "object") {
          // assume vc ld proof...

          const controller = (await documentLoader(entry.did)).document;
          const publicKey = controller.publicKey.find(k => {
            return k.id === entry.vc.proof.verificationMethod;
          });
          const suite = new Ed25519Signature2018({
            key: new Ed25519KeyPair(publicKey)
          });
          const result = await vc.verify({
            credential: entry.vc,
            suite,
            documentLoader
          });
          // console.log(result);

          if (result.verified) {
            decodedVc = entry.vc;
          }
        }
      }
    })
  );

  return decodedVc;
};
