import React from "react";
import * as ES256K from "@transmute/es256k-jws-ts";

const getJson = async url =>
  fetch(url, {
    method: "get",
    headers: {
      Accept: "application/ld+json"
    }
  }).then(data => data.json());

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

const getAuthorizedDids = async didConfigUri => {
  const config = await getJson(didConfigUri);
  return Promise.all(
    Object.keys(config.claims).map(async did => {
      const jwt = config.claims[did].jwt;
      const publicKey = await getPublicKeyFromJwt(jwt);
      const verified = await ES256K.JWT.verify(jwt, publicKey.publicKeyJwk);
      if (verified.iss === did) {
        console.log(did, " is authorized for: ", verified.domain);
        return did;
      }
      return undefined;
    })
  );
};

class App extends React.Component {
  state = {};

  async componentWillMount() {
    const authorizedDids = await getAuthorizedDids(
      window.location.origin + "/.well-known/did-configuration"
    );
    this.setState({
      authorizedDids
    });
  }
  render() {
    return (
      <div>
        <h1>.well-known/did-configuration</h1>
        <pre>{JSON.stringify(this.state, null, 2)}</pre>
      </div>
    );
  }
}

export default App;
