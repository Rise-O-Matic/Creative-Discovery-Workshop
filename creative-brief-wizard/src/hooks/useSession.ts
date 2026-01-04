import { useContext } from 'react';
import { SessionContext } from '../contexts/SessionContext';
import type { SessionContextValue } from '../contexts/SessionContext';

/**
 * Hook to access the SessionContext
 * Throws an error if used outside of SessionProvider
 */
export function useSession(): SessionContextValue {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}
