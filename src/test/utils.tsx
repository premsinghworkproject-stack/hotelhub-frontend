import { ReactElement } from 'react';
import {
  render,
  RenderOptions,
} from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore, PreloadedState } from '@reduxjs/toolkit';
import authReducer from '@/lib/slices/authSlice';
import hotelReducer from '@/lib/slices/hotelSlice';
import { ReactNode } from 'react';

interface ExtendedRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  preloadedState?: PreloadedState<RootState>;
  store?: ReturnType<typeof configureStore>;
}

export interface RootState {
  auth: ReturnType<typeof authReducer>;
  hotel: ReturnType<typeof hotelReducer>;
}

/**
 * Custom render function that wraps components with Redux Provider
 * Usage:
 * render(<YourComponent />, {
 *   preloadedState: { auth: { user: null } }
 * })
 */
export function renderWithProviders(
  ui: ReactElement,
  {
    preloadedState = {} as RootState,
    store = configureStore({
      reducer: {
        auth: authReducer,
        hotel: hotelReducer,
      },
      preloadedState,
    }),
    ...renderOptions
  }: ExtendedRenderOptions = {}
) {
  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <Provider store={store}>
        {children}
      </Provider>
    );
  }

  return {
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
    store,
  };
}

// Re-export everything from @testing-library/react
export * from '@testing-library/react';
