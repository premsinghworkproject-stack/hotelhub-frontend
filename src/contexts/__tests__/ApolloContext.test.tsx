import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ApolloProvider, useApollo } from '@/contexts/ApolloContext';
import { ReactNode } from 'react';

// Mock the apollo-client module
vi.mock('@/lib/apollo-client', () => ({
  client: {
    query: vi.fn(),
    mutate: vi.fn(),
    cache: {},
  },
}));

// Test component that uses the Apollo context
const TestComponent = () => {
  const apolloClient = useApollo();
  return <div data-testid="test-component">{apolloClient ? 'Apollo Client Available' : 'No Client'}</div>;
};

describe('ApolloContext', () => {
  describe('ApolloProvider', () => {
    it('should render children correctly', () => {
      render(
        <ApolloProvider>
          <div data-testid="child-element">Test Child</div>
        </ApolloProvider>
      );

      const childElement = screen.getByTestId('child-element');
      expect(childElement).toBeInTheDocument();
      expect(childElement).toHaveTextContent('Test Child');
    });

    it('should provide Apollo client to context', () => {
      render(
        <ApolloProvider>
          <TestComponent />
        </ApolloProvider>
      );

      const testComponent = screen.getByTestId('test-component');
      expect(testComponent).toHaveTextContent('Apollo Client Available');
    });
  });

  describe('useApollo hook', () => {
    it('should throw error when used outside ApolloProvider', () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        render(<TestComponent />);
      }).toThrow('useApollo must be used within an ApolloProvider');

      consoleErrorSpy.mockRestore();
    });

    it('should return Apollo client when used inside ApolloProvider', () => {
      const { container } = render(
        <ApolloProvider>
          <TestComponent />
        </ApolloProvider>
      );

      const testComponent = screen.getByTestId('test-component');
      expect(testComponent).toBeInTheDocument();
      expect(testComponent).toHaveTextContent('Apollo Client Available');
    });
  });

  describe('Nested components', () => {
    it('should make Apollo client available to nested components', () => {
      const NestedComponent = () => {
        const apolloClient = useApollo();
        return <div data-testid="nested-component">{apolloClient ? 'Nested: Available' : 'Nested: None'}</div>;
      };

      render(
        <ApolloProvider>
          <div>
            <NestedComponent />
          </div>
        </ApolloProvider>
      );

      const nestedComponent = screen.getByTestId('nested-component');
      expect(nestedComponent).toHaveTextContent('Nested: Available');
    });
  });
});
