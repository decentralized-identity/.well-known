const fetch = require("node-fetch");

const getJson = async (url) =>
  fetch(url, {
    headers: {
      Accept: "application/ld+json",
    },
    method: "get",
  }).then((data) => data.json());

module.exports = {
  resolve: async (didUri) => {
    if (didUri.indexOf("did:web:identity.foundation") === 0) {
      return require("./unlockedDID.json");
    }
    const res = await getJson(
      "https://uniresolver.io/1.0/identifiers/" + didUri
    );

    if (res.didDocument === null) {
      throw new Error("Could not resolve DID with Universal Resolver.");
    }
    return res.didDocument;
  },
};
