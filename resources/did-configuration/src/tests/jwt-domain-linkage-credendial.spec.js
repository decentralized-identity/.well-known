const fs = require("fs");
const path = require("path");
const jose = require("jose");
const moment = require("moment");

const unlockedDID = require("../fixtures/unlockedDID.json");
const key = unlockedDID.assertionMethod[1];
const credential = require("../fixtures/credential.json");

describe("jwt-domain-linkage-credential", () => {
  it("sign and verify JWT", () => {
    delete credential.proof;
    const jwtPayload = {
      sub: credential.credentialSubject.id,
      iss: credential.credentialSubject.id,
      nbf: moment(credential.issuanceDate).unix(),
      exp: moment(credential.expirationDate).unix(),
      vc: credential,
    };
    expect(moment.unix(jwtPayload.nbf).format()).toEqual(
      moment("2020-04-13T16:44:52-05:00").format()
    );
    expect(moment.unix(jwtPayload.exp).format()).toEqual(
      moment("2022-05-13T16:44:52-05:00").format()
    );
    // console.log(JSON.stringify(jwtPayload, null, 2));
    const jwt = jose.JWT.sign(jwtPayload, jose.JWK.asKey(key.privateKeyJwk), {
      iat: false, // do not overrite iat
      kid: true, // pushes kid to JWT Header,
      // beware that kid can anything...
      // an incredibily terrible property of jose...
    });
    fs.writeFileSync(path.resolve(__dirname, "../fixtures/jwt"), jwt);
    const { header, payload, signature } = jose.JWT.verify(
      jwt,
      jose.JWK.asKey(key.publicKeyJwk),
      {
        complete: true,
      }
    );
    expect(header).toEqual({
      kid:
        "did:web:identity.foundation#_Qq0UL2Fq651Q0Fjd6TvnYE-faHiOpRlPVQcY_-tA4A",
      alg: "EdDSA",
    });
    expect(payload).toEqual(jwtPayload);
    expect(signature).toEqual(
      "am6aojyWxccW4WIVgORuHt4zwSTc7vAegG9TC5zucYobyOAD2RhVhDHEXmhqTCUZbwbXnysXvo-qw-PdcHDdCQ"
    );
  });
});
