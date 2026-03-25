'use client';

import { createContext, useContext, ReactNode } from 'react';
import { client } from '../lib/apollo-client';

interface ApolloContextType {
  client: typeof client;
}

const ApolloContext = createContext<ApolloContextType | undefined>(undefined);

interface ApolloProviderProps {
  children: ReactNode;
}

export const ApolloProvider: React.FC<ApolloProviderProps> = ({ children }) => {
  return (
    <ApolloContext.Provider value={{ client }}>
      {children}
    </ApolloContext.Provider>
  );
};

export const useApollo = () => {
  const context = useContext(ApolloContext);
  if (context === undefined) {
    throw new Error('useApollo must be used within an ApolloProvider');
  }
  return context.client;
};
