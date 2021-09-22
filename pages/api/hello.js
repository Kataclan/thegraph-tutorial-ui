import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

const APIURL = "https://api.studio.thegraph.com/query/8916/nfttest/0.1";

export const tokensQuery = `
  query {
    tokens (
      orderDirection: desc
      orderBy: createdAtTimestamp
      first: 5
    ) {
      id
      tokenID
      contentURI
      metadataURI
    }
  }
`;

export const client = new ApolloClient({
  uri: APIURL,
  cache: new InMemoryCache(),
});
