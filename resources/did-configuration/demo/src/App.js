import React from "react";
import { verifyDidConfiguration, getDecodedVc } from "./__fixtures__";

const getJson = async url =>
  fetch(url, {
    method: "get",
    headers: {
      Accept: "application/ld+json"
    }
  }).then(data => data.json());

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
          const verified = await verifyDidConfiguration(config, entry.did);

          if (verified) {
            const decoded = await getDecodedVc(config, entry.did);
            const domain =
              decoded.credentialSubject.domainLinkageAssertion.domain;

            console.log(entry.did, " is authorized for: ", domain);
            this.setState({
              verified: {
                [entry.did]: {
                  verified,
                  origin: url.hostname,
                  is_claim_for_origin: url.hostname === domain
                },
                ...(this.state.verified || {})
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
