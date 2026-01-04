import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { SessionPhase } from '../types';

// ============================================================================
// Meeting Timer Types
// ============================================================================

export interface PhaseTimestamp {
  enteredAt: number;
  exitedAt?: number;
  totalTimeMs: number;
}

export interface MeetingTimerState {
  meetingStartTime: number | null; // timestamp when meeting began
  totalElapsedMs: number; // continuously updated
  expectedDurationMs: number; // default 60 minutes, configurable
  isPaused: boolean;
  pausedAt: number | null; // when the timer was paused
  totalPausedMs: number; // total time spent paused
  phaseTimestamps: Partial<Record<SessionPhase, PhaseTimestamp>>;
}

interface MeetingTimerContextValue {
  timerState: MeetingTimerState;
  startMeeting: (expectedDurationMinutes: number) => void;
  pauseMeeting: () => void;
  resumeMeeting: () => void;
  resetMeeting: () => void;
  enterPhase: (phase: SessionPhase) => void;
  exitPhase: (phase: SessionPhase) => void;
  getCurrentElapsedMs: () => number;
  getPhaseElapsedMs: (phase: SessionPhase) => number;
  getPacingStatus: (currentPhaseIndex: number, totalPhases: number) => 'on-track' | 'behind' | 'over';
}

// ============================================================================
// Storage Keys
// ============================================================================

const STORAGE_KEY = 'creative-discovery-meeting-timer';

// ============================================================================
// Default State
// ============================================================================

function createDefaultTimerState(): MeetingTimerState {
  return {
    meetingStartTime: null,
    totalElapsedMs: 0,
    expectedDurationMs: 60 * 60 * 1000, // 60 minutes default
    isPaused: false,
    pausedAt: null,
    totalPausedMs: 0,
    phaseTimestamps: {},
  };
}

// ============================================================================
// Storage Utilities
// ============================================================================

function loadTimerState(): MeetingTimerState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return createDefaultTimerState();
    return JSON.parse(stored);
  } catch (error) {
    console.error('Failed to load timer state:', error);
    return createDefaultTimerState();
  }
}

function saveTimerState(state: MeetingTimerState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save timer state:', error);
  }
}

// ============================================================================
// Context
// ============================================================================

const MeetingTimerContext = createContext<MeetingTimerContextValue | undefined>(undefined);

// ============================================================================
// Provider Component
// ============================================================================

export function MeetingTimerProvider({ children }: { children: React.ReactNode }) {
  const [timerState, setTimerState] = useState<MeetingTimerState>(loadTimerState);

  // Calculate current elapsed time
  const getCurrentElapsedMs = useCallback((): number => {
    if (!timerState.meetingStartTime) return 0;

    if (timerState.isPaused && timerState.pausedAt) {
      // If paused, return elapsed up to pause time
      return timerState.pausedAt - timerState.meetingStartTime - timerState.totalPausedMs;
    }

    // Active: current time minus start time minus paused time
    return Date.now() - timerState.meetingStartTime - timerState.totalPausedMs;
  }, [timerState]);

  // Update elapsed time every second
  useEffect(() => {
    if (!timerState.meetingStartTime || timerState.isPaused) return;

    const interval = setInterval(() => {
      setTimerState((prev) => ({
        ...prev,
        totalElapsedMs: getCurrentElapsedMs(),
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [timerState.meetingStartTime, timerState.isPaused, getCurrentElapsedMs]);

  // Persist to localStorage every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      saveTimerState(timerState);
    }, 10000);

    return () => clearInterval(interval);
  }, [timerState]);

  // Start meeting timer
  const startMeeting = useCallback((expectedDurationMinutes: number) => {
    const now = Date.now();
    setTimerState({
      meetingStartTime: now,
      totalElapsedMs: 0,
      expectedDurationMs: expectedDurationMinutes * 60 * 1000,
      isPaused: false,
      pausedAt: null,
      totalPausedMs: 0,
      phaseTimestamps: {},
    });
  }, []);

  // Pause meeting
  const pauseMeeting = useCallback(() => {
    setTimerState((prev) => {
      if (prev.isPaused) return prev;
      return {
        ...prev,
        isPaused: true,
        pausedAt: Date.now(),
      };
    });
  }, []);

  // Resume meeting
  const resumeMeeting = useCallback(() => {
    setTimerState((prev) => {
      if (!prev.isPaused || !prev.pausedAt) return prev;
      const pauseDuration = Date.now() - prev.pausedAt;
      return {
        ...prev,
        isPaused: false,
        pausedAt: null,
        totalPausedMs: prev.totalPausedMs + pauseDuration,
      };
    });
  }, []);

  // Reset meeting
  const resetMeeting = useCallback(() => {
    setTimerState(createDefaultTimerState());
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  // Enter a phase
  const enterPhase = useCallback((phase: SessionPhase) => {
    setTimerState((prev) => {
      const now = Date.now();
      const existingPhase = prev.phaseTimestamps[phase];

      return {
        ...prev,
        phaseTimestamps: {
          ...prev.phaseTimestamps,
          [phase]: {
            enteredAt: now,
            totalTimeMs: existingPhase?.totalTimeMs || 0,
          },
        },
      };
    });
  }, []);

  // Exit a phase
  const exitPhase = useCallback((phase: SessionPhase) => {
    setTimerState((prev) => {
      const phaseData = prev.phaseTimestamps[phase];
      if (!phaseData) return prev;

      const now = Date.now();
      const sessionTime = now - phaseData.enteredAt;

      return {
        ...prev,
        phaseTimestamps: {
          ...prev.phaseTimestamps,
          [phase]: {
            ...phaseData,
            exitedAt: now,
            totalTimeMs: phaseData.totalTimeMs + sessionTime,
          },
        },
      };
    });
  }, []);

  // Get elapsed time for a specific phase
  const getPhaseElapsedMs = useCallback((phase: SessionPhase): number => {
    const phaseData = timerState.phaseTimestamps[phase];
    if (!phaseData) return 0;

    let elapsed = phaseData.totalTimeMs;

    // If currently in this phase (entered but not exited)
    if (phaseData.enteredAt && !phaseData.exitedAt) {
      const currentSessionTime = Date.now() - phaseData.enteredAt;
      elapsed += currentSessionTime;
    }

    return elapsed;
  }, [timerState.phaseTimestamps]);

  // Get pacing status
  const getPacingStatus = useCallback((currentPhaseIndex: number, totalPhases: number): 'on-track' | 'behind' | 'over' => {
    if (!timerState.meetingStartTime || totalPhases === 0) return 'on-track';

    const elapsed = getCurrentElapsedMs();
    const expected = timerState.expectedDurationMs;
    const progressRatio = currentPhaseIndex / totalPhases;
    const expectedElapsed = expected * progressRatio;

    if (elapsed > expectedElapsed * 1.3) return 'over';
    if (elapsed > expectedElapsed * 1.1) return 'behind';
    return 'on-track';
  }, [timerState, getCurrentElapsedMs]);

  const value: MeetingTimerContextValue = {
    timerState,
    startMeeting,
    pauseMeeting,
    resumeMeeting,
    resetMeeting,
    enterPhase,
    exitPhase,
    getCurrentElapsedMs,
    getPhaseElapsedMs,
    getPacingStatus,
  };

  return (
    <MeetingTimerContext.Provider value={value}>
      {children}
    </MeetingTimerContext.Provider>
  );
}

// ============================================================================
// Hook
// ============================================================================

export function useMeetingTimer(): MeetingTimerContextValue {
  const context = useContext(MeetingTimerContext);
  if (!context) {
    throw new Error('useMeetingTimer must be used within a MeetingTimerProvider');
  }
  return context;
}
