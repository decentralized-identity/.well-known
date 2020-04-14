const fs = require("fs");
const path = require("path");
const jose = require("jose");
const vc = require("vc-js");
const moment = require("moment");
const jsigs = require("jsonld-signatures");
const { Ed25519KeyPair } = require("crypto-ld");

const {
  JsonWebKeyLinkedDataKeyClass2020,
  JsonWebSignature2020,
} = require("lds-jws2020");

const { Ed25519Signature2018 } = jsigs.suites;

const documentLoader = require("../fixtures/documentLoader");
const credential = require("../fixtures/credential.json");
delete credential.proof;

describe("identity.foundation dids", () => {
  const entries = [];

  it("JSON Web Token, JWK, Ed25519, did:web:identity.foundation", async () => {
    const key = {
      id:
        "did:web:identity.foundation#_Qq0UL2Fq651Q0Fjd6TvnYE-faHiOpRlPVQcY_-tA4A",
      type: "JwsVerificationKey2020",
      controller: "did:web:identity.foundation",
      publicKeyJwk: {
        crv: "Ed25519",
        x: "VCpo2LMLhn6iWku8MKvSLg2ZAoC-nlOyPVQaO3FxVeQ",
        kty: "OKP",
        kid:
          "did:web:identity.foundation#_Qq0UL2Fq651Q0Fjd6TvnYE-faHiOpRlPVQcY_-tA4A",
      },
      privateKeyJwk: {
        crv: "Ed25519",
        x: "VCpo2LMLhn6iWku8MKvSLg2ZAoC-nlOyPVQaO3FxVeQ",
        d: "tP7VWE16yMQWUO2G250yvoevfbfxY25GjHglTP3ZOyU",
        kty: "OKP",
        kid:
          "did:web:identity.foundation#_Qq0UL2Fq651Q0Fjd6TvnYE-faHiOpRlPVQcY_-tA4A",
      },
    };

    const jwtPayload = {
      sub: credential.credentialSubject.id,
      iss: credential.credentialSubject.id,
      nbf: moment(credential.issuanceDate).unix(),
      exp: moment(credential.expirationDate).unix(),
      vc: {
        ...credential,
        issuer: key.controller,
        credentialSubject: {
          ...credential.credentialSubject,
          id: key.controller,
        },
      },
    };
    const jwt = jose.JWT.sign(jwtPayload, jose.JWK.asKey(key.privateKeyJwk), {
      iat: false, // do not overrite iat
      kid: true, // pushes kid to JWT Header,
      // beware that kid can anything...
      // an incredibily terrible property of jose...
    });
    entries.push(jwt);
  });

  it("JSON Web Token, JWK, secp256k1, did:elem:EiBJJPdo-ONF0jxqt8mZYEj9Z7FbdC87m2xvN0_HAbcoEg", async () => {
    const key = {
      id:
        "did:elem:ropsten:EiBJJPdo-ONF0jxqt8mZYEj9Z7FbdC87m2xvN0_HAbcoEg#636uaQJN8FKYI8vD-xIWEPDCsJzBxZfLxho3vzHT7Oc",
      type: "EcdsaSecp256k1VerificationKey2019",
      controller:
        "did:elem:ropsten:EiBJJPdo-ONF0jxqt8mZYEj9Z7FbdC87m2xvN0_HAbcoEg",
      publicKeyJwk: {
        kid:
          "did:elem:ropsten:EiBJJPdo-ONF0jxqt8mZYEj9Z7FbdC87m2xvN0_HAbcoEg#636uaQJN8FKYI8vD-xIWEPDCsJzBxZfLxho3vzHT7Oc",
        kty: "EC",
        crv: "secp256k1",
        y: "gnUxO29W9_Wglh1aPhQSTaJkv4hJZtfYVEnLP130cLc",
        x: "qL-z32z8dJycwHgX1th6QTcF9xuveMBrI3Udi4zDQbw",
      },
      privateKeyJwk: {
        kid:
          "did:elem:ropsten:EiBJJPdo-ONF0jxqt8mZYEj9Z7FbdC87m2xvN0_HAbcoEg#636uaQJN8FKYI8vD-xIWEPDCsJzBxZfLxho3vzHT7Oc",
        kty: "EC",
        crv: "secp256k1",
        d: "nw77p9FkUk7iwHABaI5aAD4zVwdXbZhM4Dhewwx0eL8",
        x: "qL-z32z8dJycwHgX1th6QTcF9xuveMBrI3Udi4zDQbw",
        y: "gnUxO29W9_Wglh1aPhQSTaJkv4hJZtfYVEnLP130cLc",
      },
    };

    const jwtPayload = {
      sub: credential.credentialSubject.id,
      iss: credential.credentialSubject.id,
      nbf: moment(credential.issuanceDate).unix(),
      exp: moment(credential.expirationDate).unix(),
      vc: {
        ...credential,
        issuer: key.controller,
        credentialSubject: {
          ...credential.credentialSubject,
          id: key.controller,
        },
      },
    };

    const jwt = jose.JWT.sign(jwtPayload, jose.JWK.asKey(key.privateKeyJwk), {
      iat: false, // do not overrite iat
      kid: true, // pushes kid to JWT Header,
      // beware that kid can anything...
      // an incredibily terrible property of jose...
    });
    entries.push(jwt);
  });
  it("Linked Data Proof, base58, Ed25519, did:key:z6MkjRagNiMu91DduvCvgEsqLZDVzrJzFrwahc4tXLt9DoHd", async () => {
    const key = {
      id:
        "did:key:z6MkjRagNiMu91DduvCvgEsqLZDVzrJzFrwahc4tXLt9DoHd#z6MkjRagNiMu91DduvCvgEsqLZDVzrJzFrwahc4tXLt9DoHd",
      type: "Ed25519VerificationKey2018",
      controller: "did:key:z6MkjRagNiMu91DduvCvgEsqLZDVzrJzFrwahc4tXLt9DoHd",
      publicKeyBase58: "5yKdnU7ToTjAoRNDzfuzVTfWBH38qyhE1b9xh4v8JaWF",
      privateKeyBase58:
        "28xXA4NyCQinSJpaZdSuNBM4kR2GqYb8NPqAtZoGCpcRYWBcDXtzVAzpZ9BAfgV334R2FC383fiHaWWWAacRaYGs",
    };
    const suite = new Ed25519Signature2018({
      key: new Ed25519KeyPair(key),
    });

    verifiableCredential = await vc.issue({
      credential: {
        ...credential,
        issuer: key.controller,
        credentialSubject: {
          ...credential.credentialSubject,
          id: key.controller,
        },
      },
      compactProof: false,
      documentLoader,
      suite,
    });
    entries.push(verifiableCredential);
  });

  it("Linked Data Proof, JWK, secp256k1, did:web:vc.transmute.world ", async () => {
    const key = {
      id:
        "did:web:vc.transmute.world#4SZ-StXrp5Yd4_4rxHVTCYTHyt4zyPfN1fIuYsm6k3A",
      type: "JwsVerificationKey2020",
      controller: "did:web:vc.transmute.world",
      publicKeyJwk: {
        crv: "secp256k1",
        x: "Z4Y3NNOxv0J6tCgqOBFnHnaZhJF6LdulT7z8A-2D5_8",
        y: "i5a2NtJoUKXkLm6q8nOEu9WOkso1Ag6FTUT6k_LMnGk",
        kty: "EC",
        kid:
          "did:web:vc.transmute.world#4SZ-StXrp5Yd4_4rxHVTCYTHyt4zyPfN1fIuYsm6k3A",
      },
      privateKeyJwk: {
        crv: "secp256k1",
        x: "Z4Y3NNOxv0J6tCgqOBFnHnaZhJF6LdulT7z8A-2D5_8",
        y: "i5a2NtJoUKXkLm6q8nOEu9WOkso1Ag6FTUT6k_LMnGk",
        d: "l7iiiJMmZyoizalGnNjbG9oLd9P7f2-EFGoV7n4xVeo",
        kty: "EC",
        kid:
          "did:web:vc.transmute.world#4SZ-StXrp5Yd4_4rxHVTCYTHyt4zyPfN1fIuYsm6k3A",
      },
    };
    const suite = new JsonWebSignature2020({
      LDKeyClass: JsonWebKeyLinkedDataKeyClass2020,
      linkedDataSigantureType: "JsonWebSignature2020",
      linkedDataSignatureVerificationKeyType: "JwsVerificationKey2020",
      key: new JsonWebKeyLinkedDataKeyClass2020(key),
    });

    verifiableCredential = await vc.issue({
      credential: {
        ...credential,
        issuer: key.controller,
        credentialSubject: {
          ...credential.credentialSubject,
          id: key.controller,
        },
      },
      compactProof: false,
      documentLoader,
      suite,
    });
    entries.push(verifiableCredential);
  });

  it("write configuration", async () => {
    fs.writeFileSync(
      path.resolve(
        __dirname,
        "../../public/.well-known/did-configuration.json"
      ),
      JSON.stringify(
        {
          "@context":
            "https://identity.foundation/.well-known/contexts/did-configuration-v0.0.jsonld",
          entries,
        },
        null,
        2
      )
    );
  });
});
