'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../lib/store';
import { forgotPassword, clearError } from '../../lib/slices/authSlice';
import { ForgotPasswordInput } from '../../graphql/auth';
import { showSuccessToast, showErrorToast } from '../../lib/toast';

const ForgotPasswordForm = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error, accountDeleted, requiresEmailVerification } = useSelector((state: RootState) => state.auth);
  
  const [formData, setFormData] = useState<ForgotPasswordInput>({
    email: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearError());

    if (!formData.email) {
      showErrorToast('Please enter your email address');
      return;
    }

    try {
      const result = await dispatch(forgotPassword(formData)).unwrap();
      
      if (result.success) {
        showSuccessToast('Password reset OTP sent to your email');
        // Store email for OTP verification page
        localStorage.setItem('forgotPasswordEmail', formData.email);
        router.push(`/auth/verify-forgot-password-otp?email=${encodeURIComponent(formData.email)}`);
      } else if (result.accountDeleted) {
        showErrorToast('Account has been deleted');
      } else if (result.requiresEmailVerification) {
        showErrorToast('Account not verified. Please verify your email first');
        // Could redirect to email verification flow here
      } else {
        // User not found case - show generic message for security
        showSuccessToast('If an account with this email exists, a password reset OTP has been sent');
        // Store email for OTP verification page
        localStorage.setItem('forgotPasswordEmail', formData.email);
        router.push(`/auth/verify-forgot-password-otp?email=${encodeURIComponent(formData.email)}`);
      }
    } catch (error: any) {
      showErrorToast(error || 'Failed to send password reset OTP');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Forgot Password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your email address and we'll send you an OTP to reset your password
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Sending...' : 'Send Reset OTP'}
            </button>
          </div>

          <div className="text-center">
            <Link 
              href="/auth/login" 
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Back to Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
