import { getDomainLinkageAssertionVCJWTProofPayload } from "../__fixtures__";

const ES256K = require("@transmute/es256k-jws-ts");

// feel free to impersonate me :/
const privateJWK = {
  crv: "secp256k1",
  d: "rhYFsBPF9q3-uZThy7B3c4LDF_8wnozFUAEm5LLC4Zw",
  kid: "JUvpllMEYUZ2joO59UNui_XYDqxVqiFLLAJ8klWuPBw",
  kty: "EC",
  x: "dWCvM4fTdeM0KmloF57zxtBPXTOythHPMm1HCLrdd3A",
  y: "36uMVGM7hnw-N6GnjFcihWE3SkrhMLzzLCdPMXPEXlA"
};

const publicJWK = {
  crv: "secp256k1",
  kid: "JUvpllMEYUZ2joO59UNui_XYDqxVqiFLLAJ8klWuPBw",
  kty: "EC",
  x: "dWCvM4fTdeM0KmloF57zxtBPXTOythHPMm1HCLrdd3A",
  y: "36uMVGM7hnw-N6GnjFcihWE3SkrhMLzzLCdPMXPEXlA"
};

describe("@transmute/es256k-jws-ts", () => {
  it("create and verify", async () => {
    const vcPayload = getDomainLinkageAssertionVCJWTProofPayload(
      "identity.foundation",
      "did:btcr:xxcl-lzpq-q83a-0d5"
    );
    const vcJwt = await ES256K.JWT.sign(vcPayload, privateJWK);
    const verified = await ES256K.JWT.verify(vcJwt, publicJWK);
    expect(verified.vc.credentialSubject.domainLinkageAssertion.domain).toBe(
      "identity.foundation"
    );
    expect(verified.vc.credentialSubject.domainLinkageAssertion.iss).toBe(
      "did:btcr:xxcl-lzpq-q83a-0d5"
    );
  });
});
