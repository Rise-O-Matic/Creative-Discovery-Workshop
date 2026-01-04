import { useEffect, useRef, useCallback, useState } from 'react';
import { useSession } from './useSession';

/**
 * Hook for managing countdown timer with hard stop enforcement
 *
 * Features:
 * - Countdown from specified duration
 * - Hard stop when timer expires (no extensions)
 * - Optional auto-transition to next phase
 * - Pause/resume capability
 *
 * @param onComplete - Callback when timer expires
 * @param autoTransition - Whether to auto-transition to next phase on complete
 */
export function useTimer(
  onComplete?: () => void,
  autoTransition = false
): {
  remainingSeconds: number;
  isActive: boolean;
  isPaused: boolean;
  isExpired: boolean;
  start: (durationSeconds: number) => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
} {
  const { state, startTimer, pauseTimer, resumeTimer, stopTimer, nextPhase } = useSession();
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const onCompleteRef = useRef(onComplete);

  // Keep callback ref updated
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // Calculate remaining time
  const calculateRemaining = useCallback(() => {
    if (!state.timer.isActive || !state.timer.startedAt) return 0;
    if (state.timer.isPaused && state.timer.remainingSeconds !== null) {
      return state.timer.remainingSeconds;
    }

    const elapsed = Math.floor((Date.now() - state.timer.startedAt) / 1000);
    const remaining = Math.max(0, state.timer.duration - elapsed);
    return remaining;
  }, [state.timer]);

  // Update timer every second
  useEffect(() => {
    if (state.timer.isActive && !state.timer.isPaused) {
      intervalRef.current = setInterval(() => {
        const remaining = calculateRemaining();
        setRemainingSeconds(remaining);

        if (remaining <= 0) {
          // Timer expired - hard stop
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
          }

          // Call onComplete callback
          if (onCompleteRef.current) {
            onCompleteRef.current();
          }

          // Auto-transition if enabled
          if (autoTransition) {
            nextPhase();
          }

          // Stop the timer
          stopTimer();
        }
      }, 1000);

      // Initial calculation
      setRemainingSeconds(calculateRemaining());

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    } else if (state.timer.isActive && state.timer.isPaused) {
      // When paused, keep displaying the paused remaining time
      if (state.timer.remainingSeconds !== null) {
        setRemainingSeconds(state.timer.remainingSeconds);
      }
    } else {
      setRemainingSeconds(0);
    }
  }, [
    state.timer.isActive,
    state.timer.isPaused,
    state.timer.startedAt,
    state.timer.duration,
    state.timer.remainingSeconds,
    calculateRemaining,
    stopTimer,
    nextPhase,
    autoTransition,
  ]);

  // Pause handler - saves current remaining time
  const pause = useCallback(() => {
    const remaining = calculateRemaining();
    pauseTimer();
    // Update the timer state with current remaining time
    setRemainingSeconds(remaining);
  }, [calculateRemaining, pauseTimer]);

  // Resume handler - recalculates startedAt based on remaining time
  const resume = useCallback(() => {
    if (state.timer.remainingSeconds !== null) {
      // Recalculate startedAt so the timer continues from where it was paused
      startTimer(state.timer.duration);
      // The SessionContext will handle updating startedAt
    }
    resumeTimer();
  }, [state.timer.remainingSeconds, state.timer.duration, startTimer, resumeTimer]);

  return {
    remainingSeconds,
    isActive: state.timer.isActive,
    isPaused: state.timer.isPaused,
    isExpired: state.timer.isActive && remainingSeconds === 0,
    start: startTimer,
    pause,
    resume,
    stop: stopTimer,
  };
}

/**
 * Format seconds as MM:SS
 */
export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}
