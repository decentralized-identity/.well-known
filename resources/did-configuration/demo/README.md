# DID-to-Domain Linkage

The ability to bridge between existing systems and systems based on Decentralized Identifiers is an important undertaking that can aid in bootstrapping adoption and usefulness of DIDs in the market. One clear area where DIDs could benefit from being linked with legacy systems is proving an Internet domain and DID share the same controlling entity.

The easiest means for many with a Web presence to link their Internet domains to external systems is via publication of proving data somewhere under their domain they control. An ideal mechanism for deterministic, inferential lookup of such data is the existing Well-Known URI convention: https://tools.ietf.org/html/rfc5785.

## Functional Intent

We seek to expose verifiable data at a Well-Known URI endpoint that proves the controller of a domain/subdomain and a DID (or DIDs) is the same entity.

## Well-Known URI: `/.well-known/did-configuration`

In an effort to mirror existing Well-Known URIs, specifically, ones most closely related to the intent of exposing identity configuration data, such as `/.well-known/openid-configuration`, we propose the use of `/.well-known/did-configuration`.

### Resource Data Format

The format of the resource located at `/.well-known/did-configuration` shall be a JSON object, constructed as follows:

```js
{
  "entries": [
    {
      "did": "did:btcr:123...",
      "jwt": JWT_VALUE
    },
    {
      "did": "did:ethr:456...",
      "jwt": JWT_VALUE
    },
    {
      "did": "did:sov:789...",
      "jwt": JWT_VALUE
    }
  ]
}
```

#### Resource Composition

##### Top-Level Object

The top-level object MUST be a JSON object with the list of DID linkage assertions included under the `entries` field, wherein each entry is a DID the domain owner is claiming to control. Each entry MUST contain the following properties and values:

**`entries`** - An object of DID linkage entries, wherein the keys are the DID being linked to the domain via the assertion.

##### DID Linkage Entries

Each DID linkage entry under the `entries` property of the resource's top-level JWT object must contain the following properties and values:

**`jwt`** - JWT payload signed by currently valid keys from the claimed DID. This object MUST include the following sub-properties:

- `iss`: the DID unique ID string of the claimed DID
- `domain`: the domain or subdomain the resource is located at
- `exp`: the time after which the claim of DID-to-domain linkage MUST NOT be deemed valid
  ...

### Validation of Linkage Claims

Validation of the claimed linkages between the domain and the DIDs present in the resource MUST proceed as follows:

1. Download the resource from the subdomain
2. Parse the resource as a JSON object
3. Iterate through each of the DID linkage assertions in the `entries` field
4. Process each DID linkage assertion as follows:
   1. Decode the JWT value of the linkage assertion
   2. Ensure the `domain` property value within the linkage assertion matches the same domain at which the resource is located.
   3. Ensure the `exp` property's specified expiry time has not passed.
   4. Resolve the DID specified in linkage assertion's `iss` value.
   5. Validate the JWT signature using the keys in the DID's resolved DID Document.

### Domain-Inferred Claim Scope

The origin-location of the resource file MUST infer the domain scope of the claim. This means a `/.well-known/did-configuration` resource located at the base domain of a site, e.g. `example.com`, contains claims over the base domain. Any subdomain under `example.com`, for example: `entity1.example.com`, may also include `/.well-known/did-configuration` resource that includes claims a linkage between `entity1.example.com` and another set of DIDs, independent of what is defined in the resource files of other `example.com` domains.

The rational behind the allowance of domain-based scoping is to allow subdomains to control their own linkages to DIDs. This is necessary for sites that provide users with their own user, project, or entity-scoped subdomains, with which they may wish to associate with DIDs. It is not feasible to force a site or app that follows this common pattern to constantly update its base domain resource file with the possibly innumerable state changes required by subdomain users modifying their own resource entries.

Additionally, there is a desire to support Progressive Web Apps enhanced with DID-based features and functionality. PWAs are origin scoped to domains or subdomains, meaning a subdomain exists as its own distinct app scope. In order to allow a PWA that is installed from a subdomain to associate itself with a set of DIDs independently of another PWA or entity that is granted control over a different subdomain of the same TLD, there must be scope separation of `/.well-known/did-configuration` resources.

## Secure Validation of DID-to-Domain Linkage

There are many user flows where it is desirable to initiate trusted DID interactions with users relative to the platform, environment, or scope an app or service is operating in. In these cases, wallet apps and other types of User Agents must have a way to securely relate the trust within that non-DID context to the DID of the app or service requesting the user's participation in a trusted interaction. This section will describe some of these flows and how wallets, browsers, and operating systems can integrate mechanisms for ensuring the interactions they engage in are highly secure.

### Web Browsers

There are many contexts in which a site/app running in a Web browser will seek to engage users in a trusted interaction. Below we detail some of those we envision will be common, and how we can support them.

#### Interactions based on visual artifacts (e.g. QR codes)

```sequence
participant Wallet App as W
participant Browser as B
participant Site as S
participant Universal Resolver as UR

B->S: 1. Loads page
Note right of S: User activates DID interaction
S->S: 2. Site invokes trusted browser API
B->S: 3. Browser fetches DID-Configuration
B->UR: 4. Browser resolves DID
B->B: 5. Browser validates matching DID-Configuration entry
B->B: 6. Browser validates Site's payload
B->B: 7. Browser displays payload as QR in trusted UI
W->B: 8. Wallet scans QR
W->W: 9. Verifies and handles scanned payload
```

## Development Instructons

Install

```
npm i
```

Create a configuration:

```
npm run config:create
```

[example](https://jwt.io/#debugger-io?token=eyJhbGciOiJFUzI1NksiLCJraWQiOiJKVXZwbGxNRVlVWjJqb081OVVOdWlfWFlEcXhWcWlGTExBSjhrbFd1UEJ3In0.eyJpc3MiOiJkaWQ6YnRjcjp4eGNsLWx6cHEtcTgzYS0wZDUiLCJkb21haW4iOiJpZGVudGl0eS5mb3VuZGF0aW9uIiwiZXhwIjoxOTI4OTI2NTM3LCJpYXQiOjE1Njg5MzAxMzd9.bRBpvbbAwgDS__7TMXX9dDlIDWWRpFXiBQy3kh6HVxBa8DLV6hirQj5Wq-GvFYAb_PrsF8SxhaxPFr1CrbNggQ)

Verify a configuration:

```
npm run config:verify
```

### Boilerplate

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `npm run build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify
