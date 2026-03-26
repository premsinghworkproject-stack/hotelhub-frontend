'use client';

import { useEffect, useState } from 'react';
import ReduxProvider from '../components/providers/ReduxProvider';
import { ApolloProvider } from '../contexts/ApolloContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
        <ToastContainer
          closeButton={true}
          position="top-right"
          autoClose={3000}
          newestOnTop
          theme="colored"
        />
      </ReduxProvider>
    </ApolloProvider>
  );
};

export default ClientLayout;
