import { ApolloClient, InMemoryCache } from '@apollo/client';
// @ts-ignore
import createUploadLink from 'apollo-upload-client/createUploadLink.mjs';
import { authLink } from './apollo-links';

/**
 * Specialized Apollo Client for file uploads.
 * It automatically includes the authentication token from localStorage.
 */
export const uploadClient = new ApolloClient({
  link: authLink.concat(createUploadLink({
    uri: 'http://localhost:8200/graphql', // Backend GraphQL endpoint
  })),
  cache: new InMemoryCache(),
  defaultOptions: {
    mutate: {
      errorPolicy: 'all',
    },
  },
});
