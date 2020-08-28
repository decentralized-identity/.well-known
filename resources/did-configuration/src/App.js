import React from "react";
import GithubCorner from "react-github-corner";

import vc from "vc-js";

const jsonld = require("jsonld");
const jsigs = require("jsonld-signatures");
const ES256K = require("@transmute/es256k-jws-ts");

const { Ed25519Signature2018 } = jsigs.suites;

const getJson = async (url) =>
  fetch(url, {
    headers: {
      Accept: "application/ld+json",
    },
    method: "get",
  }).then((data) => data.json());

const resolver = {
  resolve: async (didUri) => {
    const res = await getJson(
      "https://uniresolver.io/1.0/identifiers/" + didUri
    );

    if (res.didDocument === null) {
      throw new Error("Could not resolve DID with Universal Resolver.");
    }
    return res.didDocument;
  },
};
const suites = {
  Ed25519Signature2018: new Ed25519Signature2018(),
};

const documentLoader = async (url) => {
  if (url.startsWith("did:")) {
    const didDocument = await resolver.resolve(url);
    return {
      contextUrl: null, // this is for a context via a link header
      document: didDocument, // this is the actual document that was loaded
      documentUrl: url, // this is the actual context URL after redirects
    };
  }
  try {
    const res = await jsonld.documentLoader(url);
    // console.log(url, res);
    return res;
  } catch (e) {
    console.error(`No remote context support for ${url}`);
  }
};

const well_known_did_configuration_uri =
  window.location.origin + "/.well-known/did-configuration.json";

const getPublicKey = (didDocument, kid) => {
  let key;
  didDocument.assertionMethod.forEach((k) => {
    if (typeof k === "string") {
      // console.log(k === kid);
      if (k === kid) {
        if (didDocument.publicKey) {
          didDocument.publicKey.forEach((k1) => {
            // console.log(k1);
            if (k1.id === kid) {
              key = k1;
            }
          });
        }
      }
    }
    if (k.id === kid) {
      key = k;
    }
  });
  return key;
};

function App() {
  const [state, setState] = React.useState({
    well_known_did_configuration_uri,
  });

  const getLinkedDIDs = async (well_known_did_configuration_uri) => {
    const linked_dids = [];
    const did_configuration_resource = await getJson(
      state.well_known_did_configuration_uri
    );
    console.log({ did_configuration_resource });
    for (let i = 0; i < did_configuration_resource.linked_dids.length; i++) {
      try {
        console.log("processing entry ", i);
        let entry = did_configuration_resource.linked_dids[i];
        console.log({ entry });
        if (typeof entry === "string") {
          const { header, payload, signature } = await ES256K.JWS.decode(
            entry,
            {
              complete: true,
            }
          );
          console.log({ header, payload, signature });
          const { document } = await documentLoader(header.kid);
          console.log(document);
          const key = getPublicKey(document, header.kid);
          console.log({ key });
          if (key && key.publicKeyJwk.crv === "secp256k1") {
            const verified = await ES256K.JWT.verify(entry, key.publicKeyJwk);

            const domain_matches_resource_uri =
              verified.vc.credentialSubject.origin ===
              new URL(well_known_did_configuration_uri).host;

            if (domain_matches_resource_uri) {
              linked_dids.push(verified.vc.credentialSubject.id);
            }
          }
        }
        if (typeof entry === "object") {
          const suite = suites[entry.proof.type];
          if (!suite) {
            console.warn("no suite for ", entry.proof.type);
            continue;
          }
          const verification_result = await vc.verifyCredential({
            credential: entry,
            suite,
            documentLoader,
          });
          if (!verification_result.verified) {
            continue;
          }
          console.log({ verification_result });
          const domain_matches_resource_uri =
            entry.credentialSubject.origin ===
            new URL(well_known_did_configuration_uri).host;
          console.log({ domain_matches_resource_uri });
          if (domain_matches_resource_uri) {
            linked_dids.push(entry.credentialSubject.id);
          }
        }
      } catch (e) {
        console.error(e);
      }
    }

    return linked_dids;
  };

  React.useEffect(() => {
    (async () => {
      const linked_dids = await getLinkedDIDs(
        state.well_known_did_configuration_uri
      );
      setState({
        ...state,
        linked_dids,
      });
    })();
  }, []);
  return (
    <div style={{ padding: "16px" }}>
      <GithubCorner
        bannerColor={"#594aa8"}
        href="https://github.com/decentralized-identity/.well-known"
      />
      <p>See Developer console for processing details.</p>
      <pre>{JSON.stringify(state, null, 2)}</pre>
    </div>
  );
}

export default App;
