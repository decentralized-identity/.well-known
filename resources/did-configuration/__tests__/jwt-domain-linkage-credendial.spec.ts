import fs from "fs";
import path from "path";
import jose, { JWKOKPKey } from "jose";

import { unsignedCredential, unlockedDid } from "./__fixtures__";

const key = jose.JWK.asKey( unlockedDid.publicKey[1].privateKeyJwk as unknown as JWKOKPKey);

describe("jwt-domain-linkage-credential", () => {
  it("sign and verify JWT", () => {
    const jwtPayload = {
      sub: unsignedCredential.credentialSubject.id,
      iss: unsignedCredential.credentialSubject.id,
      vc: unsignedCredential,
    };
    
    const jwt = jose.JWT.sign(
      jwtPayload,
      key,
      {
        iat: false, // do not overrite iat
        kid: true, // pushes kid to JWT Header,
        // beware that kid can assert anything...
        // an incredibily terrible property of jose...
      }
    );
    fs.writeFileSync(path.resolve(__dirname, "./__fixtures__/data/jwt.txt"), jwt);
    const { header, payload, signature } = jose.JWT.verify(
      jwt,
      key,
      {
        complete: true,
      }
    );
    expect(header).toEqual({
      kid: "did:web:identity.foundation#_Qq0UL2Fq651Q0Fjd6TvnYE-faHiOpRlPVQcY_-tA4A",
      alg: "EdDSA",
    });
    expect(payload).toEqual(jwtPayload);
    expect(signature).toEqual(
      "FO9V-W0nRyhFgvTV3h-M03ppJ5SdbunU3KQDszawaoiGWJpBifKRz-YAsGMMIujSIpk0ZQOAxQJ1BykexNvCAA"
    );
  });
});
