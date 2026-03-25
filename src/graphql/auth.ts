import { gql } from '@apollo/client';

// GraphQL Mutations
export const SIGNUP_MUTATION = gql`
  mutation Signup($input: SignupInput!) {
    signup(input: $input) {
      success
      token
      message
    }
  }
`;

export const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      success
      token
      message
      requiresOTP
    }
  }
`;

export const COMPLETE_OTP_VERIFICATION_MUTATION = gql`
  mutation CompleteOTPVerification($input: VerifyOTPInput!) {
    completeOTPVerification(input: $input) {
      success
      token
      message
    }
  }
`;

export const RESEND_OTP_MUTATION = gql`
  mutation ResendOTP($input: ResendOTPInput!) {
    resendOTP(input: $input) {
      success
      message
    }
  }
`;

export const FORGOT_PASSWORD_MUTATION = gql`
  mutation ForgotPassword($input: ForgotPasswordInput!) {
    forgotPassword(input: $input) {
      success
      message
      accountDeleted
      requiresEmailVerification
    }
  }
`;

export const VERIFY_FORGOT_PASSWORD_OTP_MUTATION = gql`
  mutation VerifyForgotPasswordOTP($input: VerifyForgotPasswordOTPInput!) {
    verifyForgotPasswordOTP(input: $input) {
      success
      message
      resetToken
    }
  }
`;

export const RESET_PASSWORD_MUTATION = gql`
  mutation ResetPassword($input: ResetPasswordInput!) {
    resetPassword(input: $input) {
      success
      token
      message
    }
  }
`;

// TypeScript types based on backend documentation
export interface SignupInput {
  name: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface VerifyOTPInput {
  email: string;
  otp: string;
}

export interface ResendOTPInput {
  email: string;
}

export interface ForgotPasswordInput {
  email: string;
}

export interface VerifyForgotPasswordOTPInput {
  email: string;
  otp: string;
}

export interface ResetPasswordInput {
  email: string;
  newPassword: string;
  resetToken: string;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  message?: string;
}

export interface LoginResponse {
  success: boolean;
  token?: string;
  message?: string;
  requiresOTP?: boolean;
}

export interface OTPResponse {
  success: boolean;
  message: string;
}

export interface ForgotPasswordResponse {
  success: boolean;
  message: string;
  accountDeleted: boolean;
  requiresEmailVerification: boolean;
}

export interface VerifyForgotPasswordOTPResponse {
  success: boolean;
  message: string;
  resetToken?: string;
}
