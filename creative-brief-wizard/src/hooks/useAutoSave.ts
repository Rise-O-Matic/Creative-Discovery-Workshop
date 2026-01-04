import { useEffect, useRef } from 'react';
import type { SessionState } from '../types';
import { saveSession } from '../utils/storage';

/**
 * Hook to auto-save session state with debouncing
 * Prevents excessive localStorage writes by debouncing state changes
 *
 * @param state - The session state to save
 * @param debounceMs - Debounce delay in milliseconds (default: 500ms)
 */
export function useAutoSave(state: SessionState, debounceMs = 500): void {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout to save after debounce period
    timeoutRef.current = setTimeout(() => {
      saveSession(state);
    }, debounceMs);

    // Cleanup on unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [state, debounceMs]);
}
