import { setContext } from '@apollo/client/link/context';

/**
 * Shared authentication link that extracts the JWT token from 
 * the persisted Redux state string in localStorage.
 */
export const authLink = setContext((_, { headers }) => {
  // Get the authentication token from local storage if it exists
  let token = null;
  
  if (typeof window !== 'undefined') {
    // Redux Persist saves the state under 'persist:root'
    const persistRoot = localStorage.getItem('persist:root');
    if (persistRoot) {
      try {
        const root = JSON.parse(persistRoot);
        if (root.auth) {
          // The auth slice itself is a stringified JSON in the persisting object
          const auth = JSON.parse(root.auth);
          token = auth.token;
        }
      } catch (e) {
        // Silently fail if there's a parsing error
        console.error('Error parsing token from storage:', e);
      }
    }
  }

  // Return the headers to the context so HTTP links can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  };
});
