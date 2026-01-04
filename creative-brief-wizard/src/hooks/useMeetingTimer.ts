import { useEffect, useRef } from 'react';
import { useMeetingTimer } from '../contexts/MeetingTimerContext';
import type { SessionPhase } from '../types';

// ============================================================================
// Phase-Aware Timer Hook
// ============================================================================

/**
 * Custom hook that manages meeting timer lifecycle tied to session phase changes.
 * Automatically tracks phase entry/exit and ensures timer updates.
 */
export function usePhaseTimer(currentPhase: SessionPhase) {
  const { enterPhase, exitPhase } = useMeetingTimer();
  const previousPhaseRef = useRef<SessionPhase | null>(null);

  useEffect(() => {
    const previousPhase = previousPhaseRef.current;

    // Exit previous phase if we're coming from a different phase
    if (previousPhase && previousPhase !== currentPhase) {
      exitPhase(previousPhase);
    }

    // Enter current phase
    enterPhase(currentPhase);

    // Update ref
    previousPhaseRef.current = currentPhase;

    // Cleanup: exit phase when component unmounts
    return () => {
      if (previousPhaseRef.current) {
        exitPhase(previousPhaseRef.current);
      }
    };
  }, [currentPhase, enterPhase, exitPhase]);
}

// ============================================================================
// Formatted Time Hook
// ============================================================================

/**
 * Hook that provides formatted time strings for display.
 */
export function useFormattedTime() {
  const { getCurrentElapsedMs, timerState } = useMeetingTimer();

  const formatMs = (ms: number): string => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatMsLong = (ms: number): string => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    if (minutes === 0) {
      return `${seconds}s`;
    }
    if (seconds === 0) {
      return `${minutes}m`;
    }
    return `${minutes}m ${seconds}s`;
  };

  const getCurrentElapsedFormatted = (): string => {
    return formatMs(getCurrentElapsedMs());
  };

  const getExpectedDurationFormatted = (): string => {
    return formatMs(timerState.expectedDurationMs);
  };

  const getProgressPercentage = (): number => {
    if (timerState.expectedDurationMs === 0) return 0;
    const elapsed = getCurrentElapsedMs();
    return Math.min(100, (elapsed / timerState.expectedDurationMs) * 100);
  };

  return {
    formatMs,
    formatMsLong,
    getCurrentElapsedFormatted,
    getExpectedDurationFormatted,
    getProgressPercentage,
  };
}
