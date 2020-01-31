import {
  getDomainLinkageAssertionVCLinkedDataProofPayload,
  getDomainLinkageAssertionVCJWTProofPayload,
  createDidConfiguration,
  verifyDidConfiguration,
  documentLoader
} from "../__fixtures__";

const vc = require("vc-js");
const jsigs = require("jsonld-signatures");

const { Ed25519KeyPair } = require("crypto-ld");

const { Ed25519Signature2018 } = jsigs.suites;

const ES256K = require("@transmute/es256k-jws-ts");

// feel free to impersonate me :/
const privateJWK = {
  kty: "EC",
  crv: "secp256k1",
  d: "wNZx20zCHoOehqaBOFsdLELabfv8sX0612PnuAiyc-g",
  x: "NbASvplLIO_XTzP9R69a3MuqOO0DQw2LGnhJjirpd4w",
  y: "EiZOvo9JWPz1yGlNNW66IV8uA44EQP_Yv_E7OZl1NG0",
  kid: "qfknmVDhMi3Uc190IHBRfBRqMgbEEBRzWOj1E9EmzwM"
};

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

describe("create configuration", () => {
  it("create and verify", async () => {
    const suite = new Ed25519Signature2018({
      key: new Ed25519KeyPair(keypair)
    });

    const credential = getDomainLinkageAssertionVCLinkedDataProofPayload(
      "identity.foundation",
      "did:key:z6Mktts3kfFWDrURs7fNpayz24LZeCGNvCaFMC6KkbeYpZvi"
    );

    const vcLd = await vc.issue({
      credential,
      suite,
      documentLoader
    });

    const vcPayload = getDomainLinkageAssertionVCJWTProofPayload(
      "identity.foundation",
      "did:elem:EiChaglAoJaBq7bGWp6bA5PAQKaOTzVHVXIlJqyQbljfmg"
    );
    const vcJwt = await ES256K.JWT.sign(vcPayload, privateJWK);

    const didConfiguration = createDidConfiguration([
      {
        did: "did:key:z6Mktts3kfFWDrURs7fNpayz24LZeCGNvCaFMC6KkbeYpZvi",
        vc: vcLd
      },
      {
        did: "did:elem:EiChaglAoJaBq7bGWp6bA5PAQKaOTzVHVXIlJqyQbljfmg",
        vc: vcJwt
      }
    ]);

    // leave for testing
    // console.log(JSON.stringify(didConfiguration, null, 2));

    const expectedSuccessLd = await verifyDidConfiguration(
      didConfiguration,
      "did:key:z6Mktts3kfFWDrURs7fNpayz24LZeCGNvCaFMC6KkbeYpZvi"
    );

    expect(expectedSuccessLd).toBe(true);

    const expectedSuccessJwt = await verifyDidConfiguration(
      didConfiguration,
      "did:elem:EiChaglAoJaBq7bGWp6bA5PAQKaOTzVHVXIlJqyQbljfmg"
    );

    expect(expectedSuccessJwt).toBe(true);

    const expectedFailure = await verifyDidConfiguration(
      didConfiguration,
      "did:ethr:0xf1232f840f3ad7d23fcdaa84d6c66dac24efb198"
    );
    expect(expectedFailure).toBe(false);
  });
});
