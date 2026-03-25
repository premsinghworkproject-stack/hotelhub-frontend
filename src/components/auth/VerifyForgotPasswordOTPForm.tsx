'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../lib/store';
import { verifyForgotPasswordOTP, clearError } from '../../lib/slices/authSlice';
import { VerifyForgotPasswordOTPInput } from '../../graphql/auth';
import { showSuccessToast, showErrorToast } from '../../lib/toast';

const VerifyForgotPasswordOTPForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error, resetToken } = useSelector((state: RootState) => state.auth);
  
  const [formData, setFormData] = useState<VerifyForgotPasswordOTPInput>({
    email: '',
    otp: ''
  });

  const [resendTimer, setResendTimer] = useState(0);

  // Get email from URL params, localStorage, or Redux state
  useEffect(() => {
    const emailFromParams = searchParams.get('email');
    const emailFromStorage = localStorage.getItem('forgotPasswordEmail');
    const email = emailFromParams || emailFromStorage || '';
    if (email) {
      setFormData(prev => ({ ...prev, email }));
    }
  }, [searchParams]);

  // Handle redirect when reset token is received
  useEffect(() => {
    if (resetToken) {
      showSuccessToast('OTP verified successfully');
      router.push('/auth/reset-password');
    }
  }, [resetToken, router]);

  // Resend timer
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Only allow numbers for OTP
    if (name === 'otp' && value && !/^\d*$/.test(value)) {
      return;
    }
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearError());

    if (!formData.email || !formData.otp) {
      showErrorToast('Please fill in all fields');
      return;
    }

    if (formData.otp.length !== 6) {
      showErrorToast('OTP must be 6 digits');
      return;
    }

    try {
      await dispatch(verifyForgotPasswordOTP(formData)).unwrap();
    } catch (error: any) {
      showErrorToast(error || 'OTP verification failed');
    }
  };

  const handleResendOTP = () => {
    if (resendTimer === 0) {
      // Navigate back to forgot password to resend
      router.push(`/auth/forgot-password?email=${encodeURIComponent(formData.email)}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Verify Reset OTP
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter the 6-digit OTP sent to your email
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-100"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
                disabled={true}
                readOnly
              />
            </div>
            
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                OTP Code
              </label>
              <input
                id="otp"
                name="otp"
                type="text"
                inputMode="numeric"
                maxLength={6}
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-center text-lg tracking-widest"
                placeholder="000000"
                value={formData.otp}
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
              {isLoading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </div>

          <div className="text-center space-y-2">
            <button
              type="button"
              onClick={handleResendOTP}
              disabled={resendTimer > 0 || isLoading}
              className="font-medium text-indigo-600 hover:text-indigo-500 disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : 'Resend OTP'}
            </button>
            <div>
              <Link 
                href="/auth/login" 
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Back to Login
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VerifyForgotPasswordOTPForm;
