import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { ReactNode } from 'react';
import { ApolloClient, NormalizedCacheObject } from '@apollo/client';

export interface MockApolloProps {
  mocks?: readonly MockedResponse[];
  client?: ApolloClient<NormalizedCacheObject>;
  children: ReactNode;
}

/**
 * Wrapper component to provide Apollo Client with mocked responses
 * Usage in tests:
 * render(
 *   <MockApollo mocks={[mockQuery]}>
 *     <YourComponent />
 *   </MockApollo>
 * )
 */
export function MockApollo({
  mocks = [],
  client,
  children,
}: MockApolloProps) {
  return (
    <MockedProvider mocks={mocks} client={client}>
      {children}
    </MockedProvider>
  );
}

/**
 * Helper to create a mock GraphQL response
 * Usage:
 * const mockLoginMutation = createMockResponse(
 *   LOGIN_MUTATION,
 *   { login: { token: 'test-token', user: { id: '1' } } }
 * )
 */
export function createMockResponse(
  query: any,
  result: any,
  variables?: Record<string, any>
): MockedResponse {
  return {
    request: {
      query,
      variables,
    },
    result: {
      data: result,
    },
  };
}

/**
 * Helper to create a mock GraphQL error response
 */
export function createMockErrorResponse(
  query: any,
  error: string,
  variables?: Record<string, any>
): MockedResponse {
  return {
    request: {
      query,
      variables,
    },
    error: new Error(error),
  };
}
