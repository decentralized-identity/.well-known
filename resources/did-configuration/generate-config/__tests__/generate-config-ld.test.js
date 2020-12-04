const moment = require("moment");
const fs = require("fs");
const path = require("path");
const { Ed25519KeyPair } = require("@transmute/did-key-ed25519");
const { Ed25519Signature2018 } = require("@transmute/ed25519-signature-2018");
const vcjs = require("@transmute/vc.js");
const { documentLoader } = require("../services/documentLoader");

const k0 = require("../keys/did-key-ed25519.json");

const origin = "https://identity.foundation";
it("can issue / verify vanilla", async () => {
  const key = await Ed25519KeyPair.from(k0);
  const verifiableCredential = await vcjs.ld.issue({
    credential: {
      "@context": [
        "https://www.w3.org/2018/credentials/v1",
        "https://identity.foundation/.well-known/contexts/did-configuration-v0.2.jsonld",
      ],
      issuer: k0.controller,
      issuanceDate: moment().format(),
      expirationDate: moment().add(5, "years").format(),
      type: ["VerifiableCredential", "DomainLinkageCredential"],
      credentialSubject: {
        id: k0.controller,
        origin,
      },
    },
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

  fs.writeFileSync(
    path.resolve(__dirname, "../__fixtures__/did-configuration.json"),
    JSON.stringify(
      {
        "@context":
          "https://identity.foundation/.well-known/contexts/did-configuration-v0.2.jsonld",
        linked_dids: [verifiableCredential],
      },
      null,
      2
    )
  );
});
