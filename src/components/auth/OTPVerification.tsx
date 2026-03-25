'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../lib/store';
import { verifyOTP, resendOTP, clearError } from '../../lib/slices/authSlice';
import { VerifyOTPInput } from '../../graphql/auth';
import { showSuccessToast, showErrorToast } from '../../lib/toast';

const OTPVerification = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error, otpEmail, isAuthenticated } = useSelector((state: RootState) => state.auth);
  
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [email, setEmail] = useState('');
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [canResend, setCanResend] = useState(false);

  // Redirect to dashboard if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    const emailFromParams = searchParams.get('email');
    const storedEmail = otpEmail || emailFromParams || '';
    setEmail(storedEmail);
  }, [searchParams, otpEmail]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`) as HTMLInputElement;
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`) as HTMLInputElement;
      if (prevInput) {
        prevInput.focus();
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        setOtp(newOtp);
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    const newOtp = pastedData.split('').concat(Array(6 - pastedData.length).fill(''));
    setOtp(newOtp);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearError());

    const otpString = otp.join('');
    if (otpString.length !== 6) {
      showErrorToast('Please enter all 6 digits of the verification code');
      return;
    }

    const verifyData: VerifyOTPInput = {
      email,
      otp: otpString
    };

    const result = await dispatch(verifyOTP(verifyData));
    if (verifyOTP.fulfilled.match(result)) {
      showSuccessToast('Email verified successfully!');
      // Redirect will be handled by useEffect when isAuthenticated changes
    } else if (verifyOTP.rejected.match(result)) {
      showErrorToast(result.payload as string);
    }
  };

  const handleResendOTP = async () => {
    if (!canResend || !email) return;
    
    dispatch(clearError());
    const result = await dispatch(resendOTP({ email }));
    
    if (resendOTP.fulfilled.match(result)) {
      showSuccessToast('New OTP sent to your email');
      // Reset timer
      setTimeLeft(600);
      setCanResend(false);
      setOtp(['', '', '', '', '', '']);
      
      // Focus first input
      const firstInput = document.getElementById('otp-0') as HTMLInputElement;
      if (firstInput) firstInput.focus();
    } else if (resendOTP.rejected.match(result)) {
      showErrorToast(result.payload as string);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  if (!email) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600">Email Required</h2>
            <p className="mt-2 text-sm text-gray-900">
              Please provide an email address to verify OTP.
            </p>
            <Link 
              href="/auth/login" 
              className="mt-4 inline-flex items-center px-4 py-2 border-2 border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
              aria-label="Back to login page"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <Link href="/" className="flex justify-center">
            <h1 className="text-3xl font-bold text-indigo-600">HotelHub</h1>
          </Link>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Verify your email
          </h2>
          <p className="mt-2 text-center text-sm text-gray-900">
            We've sent a verification code to
          </p>
          <p className="text-center text-sm font-medium text-gray-900">
            {email}
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-4">
              Enter verification code
            </label>
            <div className="flex justify-center space-x-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength={1}
                  required
                  aria-required="true"
                  aria-label={`Verification code digit ${index + 1}`}
                  className="w-12 h-12 text-center text-lg font-semibold border-2 border-gray-300 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={index === 0 ? handlePaste : undefined}
                  autoFocus={index === 0}
                />
              ))}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading || otp.join('').length !== 6}
              className="group relative w-full flex justify-center py-3 px-4 border-2 border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              aria-label="Verify email with OTP code"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Verifying...
                </div>
              ) : (
                'Verify Email'
              )}
            </button>
          </div>

          <div className="text-center">
            <div className="text-sm text-gray-900 mb-2">
              {timeLeft > 0 ? (
                <>Resend code in <span className="font-medium">{formatTime(timeLeft)}</span></>
              ) : (
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={!canResend || isLoading}
                  className="font-medium text-indigo-600 hover:text-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Resend verification code"
                >
                  Resend code
                </button>
              )}
            </div>
            <Link 
              href="/auth/login" 
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200"
              aria-label="Back to login page"
            >
              Back to login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OTPVerification;
