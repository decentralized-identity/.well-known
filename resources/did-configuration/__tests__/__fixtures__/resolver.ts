import { unlockedDid } from "../__fixtures__";

export const getJson = async (url: any) =>
  fetch(url, {
    headers: {
      Accept: "application/ld+json",
    },
    method: "get",
  }).then((data) => data.json());

export const resolver = async (didUri: any) => {
  if (didUri !== "did:web:identity.foundation") {
    throw Error("This test only supports a mocked did:web:identity.foundation did.");
  }
  
  return unlockedDid;
};
