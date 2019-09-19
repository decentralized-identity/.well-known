const fetch = require("node-fetch");
const ES256K = require("@transmute/es256k-jws-ts");

const getJson = async url =>
  fetch(url, {
    method: "get",
    headers: {
      Accept: "application/ld+json"
    }
  }).then(data => data.json());

const fs = require("fs");
const path = require("path");

const getPublicKeyFromJwt = async jwt => {
  const decodedClaim = await ES256K.JWT.decode(jwt, {
    complete: true
  });
  const res = await getJson(
    "https://uniresolver.io/1.0/identifiers/" + decodedClaim.payload.iss
  );
  const publicKeyFromResolver = res.methodMetadata.continuation.publicKey.find(
    k => {
      return (
        k.id === decodedClaim.payload.iss + "#key-" + decodedClaim.header.kid
      );
    }
  );
  return publicKeyFromResolver;
};

(async () => {
  const config = JSON.parse(
    fs
      .readFileSync(
        path.resolve(__dirname, "../public/.well-known/did-configuration.json")
      )
      .toString()
  );
  config.entries.forEach(async entry => {
    const jwt = entry.jwt;

    const publicKey = await getPublicKeyFromJwt(jwt);

    const verified = await ES256K.JWT.verify(jwt, publicKey.publicKeyJwk);

    if (verified.iss === entry.did) {
      console.log(entry.did, " is authorized for: ", verified.domain);
    }
  });
})();
