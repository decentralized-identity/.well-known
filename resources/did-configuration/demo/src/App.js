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

class App extends React.Component {
  state = {};

  async componentWillMount() {
    const getAuthorizedDids = async didConfigUri => {
      const url = new URL(didConfigUri);

      const config = await getJson(didConfigUri);

      this.setState({
        wellKnownUri: didConfigUri,
        config
      });
      return Promise.all(
        config.entries.map(async entry => {
          const jwt = entry.jwt;
          const publicKey = await getPublicKeyFromJwt(jwt);
          const verified = await ES256K.JWT.verify(jwt, publicKey.publicKeyJwk);
          if (verified.iss === entry.did) {
            console.log(entry.did, " is authorized for: ", verified.domain);
            this.setState({
              verified: {
                [entry.did]: {
                  verified,
                  origin: url.hostname,
                  is_claim_for_origin: url.hostname === verified.domain
                }
              }
            });
            return entry.did;
          }
          return undefined;
        })
      );
    };
    await getAuthorizedDids(
      window.location.origin + "/.well-known/did-configuration.json"
    );
  }
  render() {
    return (
      <div>
        <h1>.well-known/did-configuration</h1>

        <h2>URI</h2>
        <a href={this.state.wellKnownUri}>{this.state.wellKnownUri}</a>

        <br />
        <h2>Configuration</h2>

        <pre>{JSON.stringify(this.state.config, null, 2)}</pre>
        <br />

        <h2>Verified</h2>
        <pre>{JSON.stringify(this.state.verified, null, 2)}</pre>
      </div>
    );
  }
}

export default App;
