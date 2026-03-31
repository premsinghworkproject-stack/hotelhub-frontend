import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { 
  SIGNUP_MUTATION, 
  LOGIN_MUTATION, 
  COMPLETE_OTP_VERIFICATION_MUTATION, 
  RESEND_OTP_MUTATION,
  FORGOT_PASSWORD_MUTATION,
  VERIFY_FORGOT_PASSWORD_OTP_MUTATION,
  RESET_PASSWORD_MUTATION,
  SignupInput,
  LoginInput,
  VerifyOTPInput,
  ResendOTPInput,
  ForgotPasswordInput,
  VerifyForgotPasswordOTPInput,
  ResetPasswordInput,
  AuthResponse,
  LoginResponse,
  OTPResponse,
  ForgotPasswordResponse,
  VerifyForgotPasswordOTPResponse,
  UserType
} from '../../graphql/auth';
import { client } from '../apollo-client';

interface AuthState {
  user: {
    id?: string;
    name?: string;
    email?: string;
    userType?: string;
    companyName?: string;
  } | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  requiresOTP: boolean;
  otpEmail: string | null;
  // Forgot password fields
  resetToken: string | null;
  accountDeleted: boolean;
  requiresEmailVerification: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  requiresOTP: false,
  otpEmail: null,
  // Forgot password fields
  resetToken: null,
  accountDeleted: false,
  requiresEmailVerification: false,
};

// Async thunks
export const signup = createAsyncThunk(
  'auth/signup',
  async (input: SignupInput, { rejectWithValue }) => {
    try {
      // Trim all input fields before sending to GraphQL
      const trimmedInput: SignupInput = {
        name: input.name?.trim() || '',
        email: input.email?.trim() || '',
        password: input.password?.trim() || '',
        userType: input.userType,
        ...(input.userType === UserType.HOTEL_OWNER && { companyName: input.companyName?.trim() || '' })
      };
      
      const response = await client.mutate<{ signup: AuthResponse }>({
        mutation: SIGNUP_MUTATION,
        variables: { input: trimmedInput },
      });
      
      if (response.data?.signup.success) {
        return response.data.signup;
      } else {
        // Check if the message is actually a success message despite success: false
        const message = response.data?.signup.message || 'Signup failed';
        if (message.includes('Account created successfully') || message.includes('check your email') || message.includes('verification OTP')) {
          // This is actually a success case (user created but needs OTP verification)
          return { ...response.data!.signup, success: true };
        }
        return rejectWithValue(message);
      }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Signup failed');
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async (input: LoginInput, { rejectWithValue }) => {
    try {
      // Trim all input fields before sending to GraphQL
      const trimmedInput: LoginInput = {
        email: input.email?.trim() || '',
        password: input.password?.trim() || ''
      };
      
      const response = await client.mutate<{ login: LoginResponse }>({
        mutation: LOGIN_MUTATION,
        variables: { input: trimmedInput },
      });
      
      const result = response.data?.login;
      if (result?.success && result.token) {
        return result;
      } else if (result?.requiresOTP) {
        return { ...result, requiresOTP: true, otpEmail: trimmedInput.email } as LoginResponse & { requiresOTP: boolean; otpEmail: string };
      } else {
        return rejectWithValue(result?.message || 'Login failed');
      }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

export const verifyOTP = createAsyncThunk(
  'auth/verifyOTP',
  async (input: VerifyOTPInput, { rejectWithValue }) => {
    try {
      // Trim all input fields before sending to GraphQL
      const trimmedInput: VerifyOTPInput = {
        email: input.email?.trim() || '',
        otp: input.otp?.trim() || ''
      };
      
      const response = await client.mutate<{ completeOTPVerification: AuthResponse }>({
        mutation: COMPLETE_OTP_VERIFICATION_MUTATION,
        variables: { input: trimmedInput },
      });
      
      if (response.data?.completeOTPVerification.success) {
        return response.data.completeOTPVerification;
      } else {
        return rejectWithValue(response.data?.completeOTPVerification.message || 'OTP verification failed');
      }
    } catch (error: any) {
      return rejectWithValue(error.message || 'OTP verification failed');
    }
  }
);

export const resendOTP = createAsyncThunk(
  'auth/resendOTP',
  async (input: ResendOTPInput, { rejectWithValue }) => {
    try {
      // Trim all input fields before sending to GraphQL
      const trimmedInput: ResendOTPInput = {
        email: input.email?.trim() || ''
      };
      
      const response = await client.mutate<{ resendOTP: OTPResponse }>({
        mutation: RESEND_OTP_MUTATION,
        variables: { input: trimmedInput },
      });
      
      if (response.data?.resendOTP.success) {
        return response.data.resendOTP;
      } else {
        return rejectWithValue(response.data?.resendOTP.message || 'Resend OTP failed');
      }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Resend OTP failed');
    }
  }
);

export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (input: ForgotPasswordInput, { rejectWithValue }) => {
    try {
      // Trim input field before sending to GraphQL
      const trimmedInput: ForgotPasswordInput = {
        email: input.email?.trim() || ''
      };
      
      const response = await client.mutate<{ forgotPassword: ForgotPasswordResponse }>({
        mutation: FORGOT_PASSWORD_MUTATION,
        variables: { input: trimmedInput },
      });
      
      if (response.data?.forgotPassword) {
        return response.data.forgotPassword;
      } else {
        return rejectWithValue('Forgot password failed');
      }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Forgot password failed');
    }
  }
);

export const verifyForgotPasswordOTP = createAsyncThunk(
  'auth/verifyForgotPasswordOTP',
  async (input: VerifyForgotPasswordOTPInput, { rejectWithValue }) => {
    try {
      // Trim all input fields before sending to GraphQL
      const trimmedInput: VerifyForgotPasswordOTPInput = {
        email: input.email?.trim() || '',
        otp: input.otp?.trim() || ''
      };
      
      const response = await client.mutate<{ verifyForgotPasswordOTP: VerifyForgotPasswordOTPResponse }>({
        mutation: VERIFY_FORGOT_PASSWORD_OTP_MUTATION,
        variables: { input: trimmedInput },
      });
      
      if (response.data?.verifyForgotPasswordOTP) {
        return response.data.verifyForgotPasswordOTP;
      } else {
        return rejectWithValue('OTP verification failed');
      }
    } catch (error: any) {
      return rejectWithValue(error.message || 'OTP verification failed');
    }
  }
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (input: ResetPasswordInput, { rejectWithValue }) => {
    try {
      // Trim all input fields before sending to GraphQL
      const trimmedInput: ResetPasswordInput = {
        email: input.email?.trim() || '',
        newPassword: input.newPassword?.trim() || '',
        resetToken: input.resetToken?.trim() || ''
      };
      
      const response = await client.mutate<{ resetPassword: AuthResponse }>({
        mutation: RESET_PASSWORD_MUTATION,
        variables: { input: trimmedInput },
      });
      
      if (response.data?.resetPassword) {
        return response.data.resetPassword;
      } else {
        return rejectWithValue('Password reset failed');
      }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Password reset failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      state.requiresOTP = false;
      state.otpEmail = null;
      // Clear forgot password fields
      state.resetToken = null;
      state.accountDeleted = false;
      state.requiresEmailVerification = false;
    },
    clearError: (state) => {
      state.error = null;
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      state.isAuthenticated = true;
    },
  },
  extraReducers: (builder) => {
    // Signup
    builder
      .addCase(signup.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.token) {
          state.token = action.payload.token;
          state.isAuthenticated = true;
          state.user = {
            id: action.payload.user?.id,
            name: action.payload.user?.name,
            email: action.payload.user?.email,
            userType: action.payload.user?.userType,
            companyName: action.payload.user?.companyName
          };
        }
      })
      .addCase(signup.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Login
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.token) {
          state.token = action.payload.token;
          state.isAuthenticated = true;
          state.user = {
            id: action.payload.user?.id,
            name: action.payload.user?.name,
            email: action.payload.user?.email,
            userType: action.payload.user?.userType,
            companyName: action.payload.user?.companyName
          };
          state.requiresOTP = false;
          state.otpEmail = null;
        } else if ((action.payload as any).requiresOTP) {
          state.requiresOTP = true;
          state.otpEmail = (action.payload as any).otpEmail || null;
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Verify OTP
    builder
      .addCase(verifyOTP.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyOTP.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.token) {
          state.token = action.payload.token;
          state.isAuthenticated = true;
          state.user = {
            id: action.payload.user?.id,
            name: action.payload.user?.name,
            email: action.payload.user?.email,
            userType: action.payload.user?.userType,
            companyName: action.payload.user?.companyName
          };
          state.requiresOTP = false;
          state.otpEmail = null;
        }
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Resend OTP
    builder
      .addCase(resendOTP.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resendOTP.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(resendOTP.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

    // Forgot Password
    .addCase(forgotPassword.pending, (state) => {
      state.isLoading = true;
      state.error = null;
      state.accountDeleted = false;
      state.requiresEmailVerification = false;
    })
    .addCase(forgotPassword.fulfilled, (state, action) => {
      state.isLoading = false;
      if (action.payload.accountDeleted) {
        state.accountDeleted = true;
      }
      if (action.payload.requiresEmailVerification) {
        state.requiresEmailVerification = true;
      }
    })
    .addCase(forgotPassword.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    })

    // Verify Forgot Password OTP
    .addCase(verifyForgotPasswordOTP.pending, (state) => {
      state.isLoading = true;
      state.error = null;
      state.resetToken = null;
    })
    .addCase(verifyForgotPasswordOTP.fulfilled, (state, action) => {
      state.isLoading = false;
      if (action.payload.resetToken) {
        state.resetToken = action.payload.resetToken;
      }
    })
    .addCase(verifyForgotPasswordOTP.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    })

    // Reset Password
    .addCase(resetPassword.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    })
    .addCase(resetPassword.fulfilled, (state, action) => {
      state.isLoading = false;
      if (action.payload.token) {
        state.token = action.payload.token;
        state.isAuthenticated = true;
        // Clear forgot password fields after successful reset
        state.resetToken = null;
        state.accountDeleted = false;
        state.requiresEmailVerification = false;
      }
    })
    .addCase(resetPassword.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
  },
});

export const { logout, clearError, setToken } = authSlice.actions;
export default authSlice.reducer;
