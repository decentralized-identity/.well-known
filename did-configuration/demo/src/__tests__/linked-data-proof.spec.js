import {
  getDomainLinkageAssertionVCLinkedDataProofPayload,
  documentLoader
} from "../__fixtures__";

const vc = require("vc-js");
const jsigs = require("jsonld-signatures");

const { Ed25519KeyPair } = require("crypto-ld");

const { Ed25519Signature2018 } = jsigs.suites;

const keypair = {
  passphrase: null,
  id:
    "did:key:z6Mktts3kfFWDrURs7fNpayz24LZeCGNvCaFMC6KkbeYpZvi#z6Mktts3kfFWDrURs7fNpayz24LZeCGNvCaFMC6KkbeYpZvi",
  controller: "did:key:z6Mktts3kfFWDrURs7fNpayz24LZeCGNvCaFMC6KkbeYpZvi",
  type: "Ed25519VerificationKey2018",
  privateKeyBase58:
    "2fu69stzifU5bMzujkLvK1zLLtmYkW9gvpxMSxGvU4GkXm2KM2HS8nn4Uh5ScxnNDjq46Ru2cEKx4Mv9vHjdqKA2",
  publicKeyBase58: "FSc1AR14tJyxkcpg9229AxnZpczXWKKtfBBPvKgXuM9L"
};

jest.setTimeout(10 * 1000);

describe("linked-data-proof", () => {
  it("sign and verify", async () => {
    const suite = new Ed25519Signature2018({
      key: new Ed25519KeyPair(keypair)
    });

    const credential = getDomainLinkageAssertionVCLinkedDataProofPayload(
      "identity.foundation",
      "did:key:z6Mktts3kfFWDrURs7fNpayz24LZeCGNvCaFMC6KkbeYpZvi"
    );

    const signed = await vc.issue({
      credential,
      suite,
      documentLoader
    });

    const result = await vc.verify({
      credential: signed,
      suite,
      documentLoader
    });

    expect(result.verified).toBe(true);
  });
});
