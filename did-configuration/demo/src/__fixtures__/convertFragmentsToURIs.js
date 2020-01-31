const transformArrays = [
  "assertionMethod",
  "authentication",
  "capabilityDelegation",
  "capabilityInvocation"
];

const transformObjects = ["publicKey", "keyAgreement"];

const convertFragmentsToURIs = didDocument => {
  const convertedDidDocument = JSON.parse(JSON.stringify({ ...didDocument }));

  transformObjects.forEach(property => {
    if (convertedDidDocument[property]) {
      convertedDidDocument[property].forEach(value => {
        if (value.id[0] === "#") {
          value.id = convertedDidDocument.id + value.id;
        }

        if (!value.controller) {
          value.controller = convertedDidDocument.id;
        }
      });
    }
  });

  transformArrays.forEach(property => {
    if (convertedDidDocument[property]) {
      convertedDidDocument[property] = convertedDidDocument[property].map(
        value => {
          if (value[0] === "#") {
            return convertedDidDocument.id + value;
          }
          return value;
        }
      );
    }
  });

  return convertedDidDocument;
};

export default convertFragmentsToURIs;
