import resolver from "./resolver";

const jsonld = require("jsonld");

const contexts = {
  "https://identity.foundation/.well-known/contexts/did-configuration-v0.0.jsonld": require("./did-configuration-v0.0.json")
};

const documentLoader = async url => {
  // console.log(url);
  if (url.startsWith("did:")) {
    const didDocument = await resolver.resolve(url);

    return {
      contextUrl: null, // this is for a context via a link header
      document: didDocument, // this is the actual document that was loaded
      documentUrl: url // this is the actual context URL after redirects
    };
  }

  const context = contexts[url];

  if (context) {
    return {
      contextUrl: null, // this is for a context via a link header
      document: context, // this is the actual document that was loaded
      documentUrl: url // this is the actual context URL after redirects
    };
  }

  try {
    const res = await jsonld.documentLoader(url);
    // console.log(url, res);
    return res;
  } catch (e) {
    console.error(`No remote context support for ${url}`);
  }

  console.error(`No custom context support for ${url}`);
  throw new Error(`No custom context support for ${url}`);
};

export default documentLoader;
