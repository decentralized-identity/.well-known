const moment = require("moment");

const fs = require("fs");
const path = require("path");

const { Ed25519KeyPair, EdDSA } = require("@transmute/did-key-ed25519");
const { Ed25519Signature2018 } = require("@transmute/ed25519-signature-2018");
const vcjs = require("@transmute/vc.js");
const { documentLoader } = require("../services/documentLoader");
const k0 = require("../keys/did-key-ed25519.json");
const origin = "https://identity.foundation";

let vcJwt;
let verifiableCredential;

it("can issue / verify linked data", async () => {
  const key = await Ed25519KeyPair.from(k0);
  const credentialTemplate = {
    "@context": [
      "https://www.w3.org/2018/credentials/v1",
      "https://identity.foundation/.well-known/did-configuration/v1",
    ],
    issuer: k0.controller,
    issuanceDate: moment().format(),
    expirationDate: moment().add(5, "years").format(),
    type: ["VerifiableCredential", "DomainLinkageCredential"],
    credentialSubject: {
      id: k0.controller,
      origin,
    },
  };
  verifiableCredential = await vcjs.ld.issue({
    credential: credentialTemplate,
    suite: new Ed25519Signature2018({
      key,
    }),
    documentLoader,
  });
  const result = await vcjs.ld.verifyCredential({
    credential: verifiableCredential,
    suite: new Ed25519Signature2018(),
    documentLoader,
  });
  expect(result.verified).toBe(true);
});

it("can issue and verify jwt", async () => {
  const credentialTemplate = {
    "@context": [
      "https://www.w3.org/2018/credentials/v1",
      "https://identity.foundation/.well-known/did-configuration/v1",
    ],
    issuer: k0.controller,
    issuanceDate: moment().format(),
    expirationDate: moment().add(5, "years").format(),
    type: ["VerifiableCredential", "DomainLinkageCredential"],
    credentialSubject: {
      id: k0.controller,
      origin,
    },
  };

  const issuedDate = moment();
  const expirationDate = moment().add(5, "years");
  const payload = {
    sub: k0.controller,
    iss: k0.controller,
    nbf: issuedDate.unix(),
    exp: expirationDate.unix(),
    vc: {
      "@context": [
        "https://www.w3.org/2018/credentials/v1",
        "https://identity.foundation/.well-known/did-configuration/v1",
      ],
      issuer: k0.controller,
      issuanceDate: issuedDate.format(),
      expirationDate: expirationDate.format(),
      type: ["VerifiableCredential", "DomainLinkageCredential"],
      credentialSubject: {
        id: k0.controller,
        origin: "identity.foundation",
      },
    },
  };
  vcJwt = await EdDSA.sign(payload, k0.privateKeyJwk, {
    alg: "EdDSA",
    kid: k0.id,
  });
  const verified = await EdDSA.verify(vcJwt, k0.publicKeyJwk);

  expect(verified).toEqual(payload);
});

it("can write config to disk", async () => {
  fs.writeFileSync(
    path.resolve(__dirname, "../__fixtures__/did-configuration.json"),
    JSON.stringify(
      {
        "@context":
          "https://identity.foundation/.well-known/did-configuration/v1",
        linked_dids: [verifiableCredential, vcJwt],
      },
      null,
      2
    )
  );
});
