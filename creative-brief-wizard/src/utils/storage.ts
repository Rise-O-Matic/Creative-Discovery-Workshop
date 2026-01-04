import type { SessionState } from '../types';

const STORAGE_KEY = 'creative-discovery-workshop-session';

/**
 * Type-safe localStorage wrapper for session persistence
 */

/**
 * Save session state to localStorage
 */
export function saveSession(state: SessionState): void {
  try {
    const serialized = JSON.stringify(state);
    localStorage.setItem(STORAGE_KEY, serialized);
  } catch (error) {
    console.error('Failed to save session to localStorage:', error);
  }
}

/**
 * Load session state from localStorage
 * Returns null if no session exists or if parsing fails
 */
export function loadSession(): SessionState | null {
  try {
    const serialized = localStorage.getItem(STORAGE_KEY);
    if (!serialized) {
      return null;
    }
    return JSON.parse(serialized) as SessionState;
  } catch (error) {
    console.error('Failed to load session from localStorage:', error);
    return null;
  }
}

/**
 * Clear session from localStorage
 */
export function clearSession(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear session from localStorage:', error);
  }
}

/**
 * Check if a saved session exists
 */
export function hasSession(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) !== null;
  } catch (error) {
    console.error('Failed to check for session in localStorage:', error);
    return false;
  }
}

/**
 * Export session as JSON file
 */
export function exportSession(state: SessionState): void {
  try {
    const serialized = JSON.stringify(state, null, 2);
    const blob = new Blob([serialized], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `creative-discovery-session-${state.sessionId}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Failed to export session:', error);
  }
}

/**
 * Import session from JSON file
 */
export function importSession(file: File): Promise<SessionState> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const state = JSON.parse(content) as SessionState;
        resolve(state);
      } catch (error) {
        reject(new Error('Failed to parse session file'));
      }
    };
    reader.onerror = () => {
      reject(new Error('Failed to read session file'));
    };
    reader.readAsText(file);
  });
}
