import fs from "fs";
import path from "path";

import vc from "vc-js";
import { Ed25519KeyPair } from "crypto-ld";
import jsigs from "jsonld-signatures";


import { customLoader, unlockedDid, unsignedCredential } from "./__fixtures__";

const ed25519Key = new Ed25519KeyPair(unlockedDid.publicKey[2]);

describe("ld-proof-domain-linkage-credential", () => {
  it("sign and verify ld-proof", async () => {
    const verifiableCredential = await vc.issue({
      credential: unsignedCredential,
      documentLoader: customLoader,
      suite: new jsigs.suites.Ed25519Signature2018({ key: ed25519Key })
    });

    fs.writeFileSync(
      path.resolve(__dirname, "./__fixtures__/data/verifiableCredential.json"),
      JSON.stringify(verifiableCredential, null, 2)
    );

    const result = await vc.verifyCredential({
      credential: verifiableCredential,
      documentLoader: customLoader,
      purpose: new jsigs.purposes.AssertionProofPurpose(),
      suite: new jsigs.suites.Ed25519Signature2018({ key: ed25519Key })
    });
    
    expect(result.verified).toBe(true);
  });
});
