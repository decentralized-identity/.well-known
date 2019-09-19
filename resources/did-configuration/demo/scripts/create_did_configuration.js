const fs = require("fs");
const path = require("path");
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

const defaultExpiresInHours = 99999;

(async () => {
  const innerPayload = {
    iss: "did:btcr:xxcl-lzpq-q83a-0d5",
    domain: "identity.foundation",
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * defaultExpiresInHours
  };
  const domainClaimJwt = await ES256K.JWT.sign(innerPayload, privateJWK);

  const outerPayload = {
    // typ: "jwt",
    // iss: "did:btcr:xxcl-lzpq-q83a-0d5",
    // exp: Math.floor(Date.now() / 1000) + 60 * 60 * defaultExpiresInHours
    entries: {
      "did:btcr:xxcl-lzpq-q83a-0d5": {
        jwt: domainClaimJwt
      }
    }
  };

  // const wellKnownDidConfigJwt = await ES256K.JWT.sign(outerPayload, privateJWK);
  // console.log("JWT:\n", wellKnownDidConfigJwt);
  // console.log();

  const decodedStr = JSON.stringify(outerPayload, null, 2);

  fs.writeFileSync(
    path.resolve(__dirname, "../public/.well-known/did-configuration.json"),
    decodedStr
  );
})();
