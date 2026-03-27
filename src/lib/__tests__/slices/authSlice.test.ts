import { describe, it, expect, beforeEach } from 'vitest';
import authReducer, {
  logout,
  clearError,
  setToken,
} from '@/lib/slices/authSlice';

describe('authSlice reducer', () => {
  const initialState = {
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    requiresOTP: false,
    otpEmail: null,
    resetToken: null,
    accountDeleted: false,
    requiresEmailVerification: false,
  };

  it('should return the initial state', () => {
    const state = authReducer(undefined, { type: 'unknown' });
    expect(state).toEqual(initialState);
  });

  describe('logout action', () => {
    it('should clear user data and authentication state', () => {
      const previousState = {
        user: { id: '1', name: 'John', email: 'john@example.com' },
        token: 'test-token',
        isAuthenticated: true,
        isLoading: false,
        error: null,
        requiresOTP: false,
        otpEmail: null,
        resetToken: null,
        accountDeleted: false,
        requiresEmailVerification: false,
      };

      const state = authReducer(previousState, logout());
      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(state.requiresOTP).toBe(false);
      expect(state.otpEmail).toBeNull();
    });

    it('should clear all forgot password fields', () => {
      const previousState = {
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        requiresOTP: false,
        otpEmail: null,
        resetToken: 'test-reset-token',
        accountDeleted: true,
        requiresEmailVerification: true,
      };

      const state = authReducer(previousState, logout());
      expect(state.resetToken).toBeNull();
      expect(state.accountDeleted).toBe(false);
      expect(state.requiresEmailVerification).toBe(false);
    });
  });

  describe('clearError action', () => {
    it('should clear error message', () => {
      const previousState = {
        ...initialState,
        error: 'Something went wrong',
      };

      const state = authReducer(previousState, clearError());
      expect(state.error).toBeNull();
    });

    it('should not change other state properties', () => {
      const previousState = {
        ...initialState,
        token: 'test-token',
        isAuthenticated: true,
        error: 'Error message',
      };

      const state = authReducer(previousState, clearError());
      expect(state.token).toBe('test-token');
      expect(state.isAuthenticated).toBe(true);
    });
  });

  describe('setToken action', () => {
    it('should set token and update authentication state', () => {
      const token = 'new-test-token';
      const state = authReducer(initialState, setToken(token));

      expect(state.token).toBe(token);
      expect(state.isAuthenticated).toBe(true);
    });

    it('should replace existing token', () => {
      const previousState = {
        ...initialState,
        token: 'old-token',
        isAuthenticated: true,
      };

      const newToken = 'new-test-token';
      const state = authReducer(previousState, setToken(newToken));

      expect(state.token).toBe(newToken);
      expect(state.isAuthenticated).toBe(true);
    });
  });
});
