# Testing Guide for Hotel Booking Frontend

This document provides a comprehensive guide for running tests and writing new tests in the Hotel Booking Frontend project.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Running Tests](#running-tests)
3. [Project Structure](#project-structure)
4. [Testing Patterns](#testing-patterns)
5. [Writing Tests](#writing-tests)
6. [Mocking Strategies](#mocking-strategies)
7. [Coverage Goals](#coverage-goals)
8. [Troubleshooting](#troubleshooting)

## Getting Started

The project uses **Vitest** as the test runner with **React Testing Library** for component testing.

### Installation

All dependencies are already installed. If you need to reinstall:

```bash
pnpm install
```

### Verify Setup

Confirm Vitest is installed:

```bash
npx vitest --version
```

## Running Tests

### Run All Tests (Once)

```bash
pnpm test
```

This discovers and runs all `.test.ts`, `.test.tsx`, `.spec.ts`, and `.spec.tsx` files in the project.

### Watch Mode (Recommended for Development)

```bash
pnpm test:watch
```

Tests re-run automatically when you modify files. Press `h` in the terminal for help options.

### Generate Coverage Report

```bash
pnpm test:coverage
```

Generates a coverage report in the terminal and creates an HTML report (if configured).

### Run Specific Test File

```bash
pnpm test LoginForm.test.tsx
```

Or with a pattern:

```bash
pnpm test --grep "LoginForm"
```

### Run Tests in UI Mode (Optional)

```bash
pnpm test:ui
```

Opens an interactive dashboard in your browser (requires `@vitest/ui` package).

## Project Structure

```
src/
├── components/
│   ├── __tests__/           # Component tests
│   │   └── LoginForm.test.tsx
│   ├── auth/
│   ├── hotel/
│   └── ...
├── lib/
│   ├── __tests__/           # Utility & service tests
│   │   ├── slices/
│   │   │   └── authSlice.test.ts
│   │   └── ...
│   ├── apollo-client.ts
│   ├── store.ts
│   ├── slices/
│   │   ├── authSlice.ts
│   │   └── hotelSlice.ts
│   └── ...
├── contexts/
│   ├── __tests__/           # Context tests
│   │   └── ApolloContext.test.tsx
│   └── ApolloContext.tsx
├── graphql/
│   ├── auth.ts
│   └── hotel.ts
├── test/                    # Test utilities & configuration
│   ├── setup.ts             # Global test setup (jest-dom matchers, mocks)
│   ├── utils.tsx            # Custom render function with providers
│   └── mocks/
│       ├── apollo-mock.ts   # Apollo Client mocking helpers
│       └── redux-mock.ts    # Redux store mocking helpers
└── ...
```

## Testing Patterns

### Component Testing

Components are tested using React Testing Library, which encourages testing user interactions rather than implementation details.

**Example Pattern:**

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderWithProviders, screen, fireEvent } from '@/test/utils';
import MyComponent from '@/components/MyComponent';

// Mock external modules
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

describe('MyComponent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the component', () => {
    renderWithProviders(<MyComponent />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });

  it('should handle user interactions', () => {
    renderWithProviders(<MyComponent />);
    const button = screen.getByRole('button', { name: /submit/i });
    fireEvent.click(button);
    expect(screen.getByText('Success')).toBeInTheDocument();
  });
});
```

### Redux Reducer Testing

Redux slices are tested by dispatching actions and verifying state changes.

**Example Pattern:**

```typescript
import { describe, it, expect } from 'vitest';
import authReducer, { logout, setToken } from '@/lib/slices/authSlice';

describe('authSlice reducer', () => {
  const initialState = { user: null, token: null, isAuthenticated: false };

  it('should set token on setToken action', () => {
    const state = authReducer(initialState, setToken('my-token'));
    expect(state.token).toBe('my-token');
    expect(state.isAuthenticated).toBe(true);
  });

  it('should clear state on logout action', () => {
    const state = authReducer(
      { user: { id: '1' }, token: 'token', isAuthenticated: true },
      logout()
    );
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
  });
});
```

### Apollo Context Testing

Contexts are tested by rendering components that use the hook and verifying behavior.

**Example Pattern:**

```typescript
import { render, screen } from '@testing-library/react';
import { ApolloProvider, useApollo } from '@/contexts/ApolloContext';

const TestComponent = () => {
  const apolloClient = useApollo();
  return <div>{apolloClient ? 'Available' : 'Not Available'}</div>;
};

describe('ApolloContext', () => {
  it('should provide Apollo client to components', () => {
    render(
      <ApolloProvider>
        <TestComponent />
      </ApolloProvider>
    );
    expect(screen.getByText('Available')).toBeInTheDocument();
  });

  it('should throw error when used outside provider', () => {
    expect(() => render(<TestComponent />)).toThrow(
      'useApollo must be used within an ApolloProvider'
    );
  });
});
```

## Writing Tests

### Step 1: Create Test File

Name your test file to match the component/utility:

- Component: `ComponentName.test.tsx` in `src/components/__tests__/`
- Service/Utility: `filename.test.ts` in `src/lib/__tests__/`
- Redux Slice: `sliceName.test.ts` in `src/lib/__tests__/slices/`
- Context: `ContextName.test.tsx` in `src/contexts/__tests__/`

### Step 2: Import Testing Utilities

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderWithProviders, screen, fireEvent, waitFor } from '@/test/utils';
```

### Step 3: Write Test Cases

Start with simple tests and build complexity:

```typescript
describe('Component Name', () => {
  // Test group 1: Rendering
  describe('rendering', () => {
    it('should render without errors', () => {
      renderWithProviders(<Component />);
      expect(screen.getByText('Expected Text')).toBeInTheDocument();
    });
  });

  // Test group 2: User Interactions
  describe('user interactions', () => {
    it('should handle button click', () => {
      renderWithProviders(<Component />);
      const button = screen.getByRole('button');
      fireEvent.click(button);
      expect(screen.getByText('Updated')).toBeInTheDocument();
    });
  });

  // Test group 3: State & Props
  describe('state and props', () => {
    it('should update when props change', () => {
      const { rerender } = renderWithProviders(<Component prop="initial" />);
      expect(screen.getByText('initial')).toBeInTheDocument();

      rerender(<Component prop="updated" />);
      expect(screen.getByText('updated')).toBeInTheDocument();
    });
  });

  // Test group 4: Edge Cases & Errors
  describe('error handling', () => {
    it('should display error message', () => {
      renderWithProviders(<Component />, {
        preloadedState: { error: 'Something went wrong' },
      });
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    });
  });
});
```

### Best Practices

1. **Use semantic queries**: Prefer `getByRole`, `getByLabelText`, `getByPlaceholderText` over `getByTestId`
2. **Test user behavior**: Click buttons, type text, submit forms - not internal state
3. **Use `waitFor` for async**: Always await mutations, API calls, and state updates
4. **Mock external dependencies**: API calls, routing, toast notifications
5. **Keep tests focused**: One main assertion per test
6. **Clean up**: Use `beforeEach` to reset mocks and state
7. **Use descriptive names**: Test should clearly describe what's being tested

## Mocking Strategies

### Mock External Modules

```typescript
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    back: vi.fn(),
  }),
}));
```

### Mock Apollo Mutations/Queries

```typescript
import { createMockResponse } from '@/test/mocks/apollo-mock';
import { LOGIN_MUTATION } from '@/graphql/auth';

const mockLoginMutation = createMockResponse(
  LOGIN_MUTATION,
  { login: { token: 'test-token', success: true } },
  { email: 'test@example.com', password: 'password123' }
);

renderWithProviders(<LoginForm />, {
  apolloMocks: [mockLoginMutation],
});
```

### Mock Toast Notifications

```typescript
vi.mock('@/lib/toast', () => ({
  showSuccessToast: vi.fn(),
  showErrorToast: vi.fn(),
}));

// In test:
import { showSuccessToast } from '@/lib/toast';

// ... trigger action ...
expect(showSuccessToast).toHaveBeenCalledWith('Success message');
```

### Mock Redux State

```typescript
renderWithProviders(<Component />, {
  preloadedState: {
    auth: {
      user: { id: '1', name: 'John' },
      token: 'test-token',
      isAuthenticated: true,
      isLoading: false,
      error: null,
      // ... other fields
    },
    hotel: {
      hotelId: null,
      hotelData: null,
      error: null,
    },
  },
});
```

## Coverage Goals

The project targets **80%+ code coverage** across:

- **Statements**: 80%
- **Branches**: 75%
- **Functions**: 80%
- **Lines**: 80%

### Check Coverage

```bash
pnpm test:coverage
```

### Improve Coverage

1. Test error paths and edge cases
2. Test different states (loading, error, success)
3. Test user interactions (click, type, submit)
4. Test conditional rendering
5. Add tests for rarely-used code paths

## Troubleshooting

### Tests Not Running

**Problem**: Files not found or tests not discovered

**Solution**:
- Check file naming: `Component.test.tsx` or `Component.spec.ts`
- Check file location: Must be in `__tests__/` folder or next to source file
- Check `vitest.config.ts`: Verify `include` and `exclude` patterns

### Import Errors

**Problem**: `Cannot find module '@/...'`

**Solution**:
- Check `@` alias is configured in `vitest.config.ts`
- Verify path is correct relative to `src/`
- Example: `@/components/auth/LoginForm` → `src/components/auth/LoginForm.tsx`

### Mock Not Working

**Problem**: Mock is not being used

**Solution**:
- Check `vi.mock()` is called **before** import of module that uses it
- Clear mocks in `beforeEach`: `vi.clearAllMocks()`
- Use `vi.resetModules()` if needed between tests

### Async Test Timeouts

**Problem**: `Test timeout exceeded`

**Solution**:
- Use `waitFor()` for async operations:
  ```typescript
  await waitFor(() => {
    expect(screen.getByText('Success')).toBeInTheDocument();
  });
  ```
- Increase timeout if needed: `waitFor(..., { timeout: 5000 })`
- Check Apollo mocks are properly set up

### Context Not Available

**Problem**: `Context not found` or `Hook outside provider`

**Solution**:
- Use `renderWithProviders()` from `@/test/utils` instead of raw `render()`
- Include component inside `<ApolloProvider>` or `<Provider>` wrapper
- Check mocks are set in correct order

### Component Rendering Issues

**Problem**: Component renders but test fails due to navigation or missing props

**Solution**:
- Mock `next/navigation` hooks (useRouter, usePathname, etc.)
- Provide required Redux state in `preloadedState`
- Provide Apollo mocks for all queries/mutations the component uses

## Further Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Apollo Client Testing](https://www.apollographql.com/docs/react/development-testing/testing/)
- [Redux Testing](https://redux.js.org/usage/writing-tests)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

## Need Help?

If you encounter issues:

1. Check the [Troubleshooting](#troubleshooting) section above
2. Review example tests in `src/components/__tests__/`
3. Check Vitest and React Testing Library documentation
4. Run in watch mode to get detailed error messages: `pnpm test:watch`
