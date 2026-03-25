'use client';

import { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import ReduxProvider from '../components/providers/ReduxProvider';
import { ApolloProvider } from '../contexts/ApolloContext';

interface ClientLayoutProps {
  children: React.ReactNode;
}

const ClientLayout: React.FC<ClientLayoutProps> = ({ children }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="min-h-full flex flex-col">
        <div className="animate-pulse">
          <div className="h-16 bg-gray-200"></div>
          <div className="h-96 bg-gray-100"></div>
        </div>
      </div>
    );
  }

  return (
    <ApolloProvider>
      <ReduxProvider>
        {children}
        <Toaster 
          position="top-right"
          reverseOrder={false}
          gutter={8}
          containerStyle={{}}
          toastOptions={{
            // Define default options
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#fff',
                secondary: '#10b981',
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: '#fff',
                secondary: '#ef4444',
              },
            },
          }}
        />
      </ReduxProvider>
    </ApolloProvider>
  );
};

export default ClientLayout;
