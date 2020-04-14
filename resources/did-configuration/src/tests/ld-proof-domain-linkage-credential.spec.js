const fs = require("fs");
const path = require("path");
const vc = require("vc-js");
const moment = require("moment");

const jsigs = require("jsonld-signatures");

const {
  JsonWebKeyLinkedDataKeyClass2020,
  JsonWebSignature2020,
} = require("lds-jws2020");

const { AssertionProofPurpose } = jsigs.purposes;

const documentLoader = require("../fixtures/documentLoader");
const credential = require("../fixtures/credential.json");
const key = require("../fixtures/key.json");

const suite = new JsonWebSignature2020({
  LDKeyClass: JsonWebKeyLinkedDataKeyClass2020,
  linkedDataSigantureType: "JsonWebSignature2020",
  linkedDataSignatureVerificationKeyType: "JwsVerificationKey2020",
  key: new JsonWebKeyLinkedDataKeyClass2020(key),
});

const issuanceDate = moment("2020-04-13T16:44:52-05:00").format();
const expirationDate = moment("2020-05-13T16:44:52-05:00").format();

describe("ld-proof-domain-linkage-credential", () => {
  it("sign and verify ld-proof", async () => {
    delete credential.proof;
    credential.issuanceDate = issuanceDate;
    credential.expirationDate = expirationDate;

    const verifiableCredential = await vc.issue({
      credential: { ...credential },
      compactProof: false,
      documentLoader,
      suite,
    });
    // console.log(JSON.stringify(verifiableCredential, null, 2));
    fs.writeFileSync(
      path.resolve(__dirname, "../fixtures/credential.json"),
      JSON.stringify(verifiableCredential, null, 2)
    );
    const result = await vc.verifyCredential({
      credential: verifiableCredential,
      compactProof: false,
      documentLoader,
      purpose: new AssertionProofPurpose(),
      suite,
    });
    // console.log(result);
    expect(result.verified).toBe(true);
  });
});
