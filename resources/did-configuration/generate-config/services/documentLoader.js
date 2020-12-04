const {
  documentLoaderFactory,
  contexts,
} = require("@transmute/jsonld-document-loader");
const fs = require("fs");
const path = require("path");
const { driver } = require("@transmute/did-key-ed25519");

const didConfigContext = JSON.parse(
  fs
    .readFileSync(
      path.resolve(
        __dirname,
        "../../../../contexts/did-configuration-v0.2.jsonld"
      )
    )
    .toString()
);

const documentLoader = documentLoaderFactory.pluginFactory
  .build({
    contexts: {
      ...contexts.W3C_Decentralized_Identifiers,
      ...contexts.W3C_Verifiable_Credentials,
      ...contexts.W3ID_Security_Vocabulary,
    },
  })
  .addContext({
    "https://identity.foundation/.well-known/contexts/did-configuration-v0.2.jsonld": didConfigContext,
  })
  .addResolver({
    "did:key:z6": {
      resolve: async (uri) => {
        const { didDocument } = await driver.resolve(uri, {
          accept: "application/did+ld+json",
        });
        return didDocument;
      },
    },
  })
  .buildDocumentLoader();

module.exports = { documentLoader };
