'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '../lib/store';

interface AuthGuardProps {
  children: React.ReactNode;
  redirectTo?: string;
  requireAuth?: boolean;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ 
  children, 
  redirectTo = '/auth/login',
  requireAuth = true 
}) => {
  const router = useRouter();
  const { isAuthenticated, token } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (requireAuth && (!isAuthenticated || !token)) {
      router.push(redirectTo);
    }
    
    if (!requireAuth && isAuthenticated && token) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, token, router, redirectTo, requireAuth]);

  // If authentication is required and user is not authenticated, show loading
  if (requireAuth && (!isAuthenticated || !token)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting...</p>
        </div>
      </div>
    );
  }

  // If user is authenticated and auth is not required, show loading while redirecting
  if (!requireAuth && isAuthenticated && token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthGuard;
