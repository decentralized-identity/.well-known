import EthrDID from "ethr-did";
import { Resolver } from "did-resolver";
import { createVerifiableCredential, verifyCredential } from "did-jwt-vc";
import { getResolver } from "ethr-did-resolver";
import { getDomainLinkageAssertionVCJWTProofPayload } from "../__fixtures__";

const issuer = new EthrDID({
  address: "0xf1232f840f3ad7d23fcdaa84d6c66dac24efb198",
  privateKey: "d8b595680851765f38ea5405129244ba3cbad84467d190859f4c8b20c1ff6c75"
});

describe("did-jwt-vc", () => {
  it("create and verify", async () => {
    const vcPayload = getDomainLinkageAssertionVCJWTProofPayload(
      "identity.foundation",
      "did:ethr:0xf1232f840f3ad7d23fcdaa84d6c66dac24efb198"
    );

    const vcJwt = await createVerifiableCredential(vcPayload, issuer);
    const resolver = new Resolver(getResolver());
    const verifiedVC = await verifyCredential(vcJwt, resolver);
    expect(
      verifiedVC.payload.vc.credentialSubject.domainLinkageAssertion.domain
    ).toBe("identity.foundation");
    expect(verifiedVC.payload.iss).toBe(
      "did:ethr:0xf1232f840f3ad7d23fcdaa84d6c66dac24efb198"
    );
    expect(verifiedVC.issuer).toBe(
      "did:ethr:0xf1232f840f3ad7d23fcdaa84d6c66dac24efb198"
    );
  });
});
