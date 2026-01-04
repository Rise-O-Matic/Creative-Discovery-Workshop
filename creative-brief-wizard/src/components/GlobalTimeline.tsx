import React, { useEffect, useState } from 'react';
import { useSession } from '../hooks/useSession';
import { useToast } from '../contexts/ToastContext';
import { useMeetingTimer } from '../contexts/MeetingTimerContext';
import { useFormattedTime } from '../hooks/useMeetingTimer';
import type { SessionPhase } from '../types';

// ============================================================================
// Phase Configuration
// ============================================================================

interface PhaseConfig {
  phase: SessionPhase;
  label: string;
  shortLabel: string;
  expectedDurationMs: number;
  color: string;
}

/**
 * Calculate phase durations based on total workshop duration
 */
function calculatePhaseConfigs(workshopDurationMinutes: number): PhaseConfig[] {
  // Base durations with proportional scaling
  const baseDurations: Omit<PhaseConfig, 'expectedDurationMs'>[] = [
    { phase: 'project-context', label: 'Welcome', shortLabel: 'W', color: '#10b981' },
    { phase: 'customer-discovery', label: 'Discovery', shortLabel: 'D', color: '#3b82f6' },
    { phase: 'sticky-notes-diverge', label: 'Diverge', shortLabel: 'Dv', color: '#8b5cf6' },
    { phase: 'sticky-notes-converge', label: 'Converge', shortLabel: 'C', color: '#ec4899' },
    { phase: 'spot-exercises', label: 'Exercises', shortLabel: 'SE', color: '#f59e0b' },
    { phase: 'prioritization', label: 'Prioritize', shortLabel: 'P', color: '#14b8a6' },
    { phase: 'synthesis-review', label: 'Review', shortLabel: 'R', color: '#6366f1' },
    { phase: 'brief-complete', label: 'Complete', shortLabel: 'B', color: '#22c55e' },
  ];

  // Base proportions (totals to 60 minutes)
  const baseProportions = [5, 15, 10, 10, 10, 5, 3, 2]; // minutes
  const totalBaseMinutes = baseProportions.reduce((sum, val) => sum + val, 0);

  return baseDurations.map((phase, index) => ({
    ...phase,
    expectedDurationMs: (baseProportions[index] / totalBaseMinutes) * workshopDurationMinutes * 60 * 1000,
  }));
}

// ============================================================================
// Phase Marker Component
// ============================================================================

interface PhaseMarkerProps {
  config: PhaseConfig;
  position: number; // percentage 0-100
  isCompleted: boolean;
  isCurrent: boolean;
  isNext: boolean;
  isLocked: boolean;
  onClick: () => void;
  completedTimeMs?: number;
}

const PhaseMarker: React.FC<PhaseMarkerProps> = ({
  config,
  position,
  isCompleted,
  isCurrent,
  isNext,
  isLocked,
  onClick,
  completedTimeMs,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const getMarkerStyle = () => {
    if (isCompleted) {
      return 'bg-green-500 border-green-600 cursor-pointer hover:scale-110';
    }
    if (isCurrent) {
      return 'bg-white border-blue-500 animate-pulse cursor-pointer';
    }
    if (isNext) {
      return 'bg-white bg-opacity-40 border-white cursor-pointer hover:scale-105';
    }
    return 'bg-gray-400 border-gray-500 cursor-not-allowed opacity-50';
  };

  const formatTime = (ms: number): string => {
    const minutes = Math.floor(ms / 60000);
    return `${minutes}m`;
  };

  const expectedMinutes = Math.round(config.expectedDurationMs / 60000);

  return (
    <div
      className="absolute flex flex-col items-center"
      style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {/* Marker Circle */}
      <div
        className={`relative w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${getMarkerStyle()}`}
        onClick={isLocked ? undefined : onClick}
        role="button"
        aria-label={`${config.label} phase`}
        tabIndex={isLocked ? -1 : 0}
      >
        {/* Icon */}
        {isCompleted && (
          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        )}
        {isCurrent && (
          <span className="text-[10px] font-bold text-blue-500">{config.shortLabel}</span>
        )}
        {isNext && (
          <span className="text-[10px] font-semibold text-white">{config.shortLabel}</span>
        )}
        {isLocked && (
          <svg className="w-3 h-3 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </div>

      {/* Label */}
      <div className="mt-0.5 text-[10px] text-white font-medium whitespace-nowrap">
        {config.shortLabel}
      </div>

      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute top-full mt-8 bg-gray-900 text-white px-3 py-2 rounded-lg shadow-lg z-50 whitespace-nowrap text-sm">
          <div className="font-semibold">{config.label}</div>
          {completedTimeMs !== undefined ? (
            <div className="text-green-400 text-xs">
              Completed in {formatTime(completedTimeMs)}
            </div>
          ) : (
            <div className="text-gray-300 text-xs">{expectedMinutes}m expected</div>
          )}
        </div>
      )}
    </div>
  );
};

// ============================================================================
// GlobalTimeline Component
// ============================================================================

export const GlobalTimeline: React.FC = () => {
  const { state, setPhase } = useSession();
  const { addToast } = useToast();
  const {
    timerState,
    startMeeting,
    pauseMeeting,
    resumeMeeting,
    resetMeeting,
    getCurrentElapsedMs,
    getPhaseElapsedMs,
    getPacingStatus,
  } = useMeetingTimer();
  const { formatMs, getProgressPercentage } = useFormattedTime();

  // Initialize meeting timer if not started
  useEffect(() => {
    if (!timerState.meetingStartTime) {
      startMeeting(state.projectContext.duration);
    }
  }, [timerState.meetingStartTime, state.projectContext.duration, startMeeting]);

  // Calculate phase configurations
  const phaseConfigs = calculatePhaseConfigs(state.projectContext.duration);
  const currentPhaseIndex = phaseConfigs.findIndex((p) => p.phase === state.currentPhase);

  // Calculate cumulative positions
  const totalExpectedMs = phaseConfigs.reduce((sum, p) => sum + p.expectedDurationMs, 0);
  const getPhasePosition = (index: number): number => {
    const cumulativeMs = phaseConfigs.slice(0, index).reduce((sum, p) => sum + p.expectedDurationMs, 0);
    return (cumulativeMs / totalExpectedMs) * 100;
  };

  // Calculate current phase thumb position
  const getCurrentPhasePosition = (): number => {
    if (currentPhaseIndex === -1) return 0;
    return getPhasePosition(currentPhaseIndex);
  };

  // Calculate elapsed time fill bar position
  const getElapsedPosition = (): number => {
    return Math.min(100, getProgressPercentage());
  };

  // Determine pacing color
  const getPacingColor = (): string => {
    const status = getPacingStatus(currentPhaseIndex, phaseConfigs.length);
    if (status === 'over') return '#dc2626'; // red
    if (status === 'behind') return '#f59e0b'; // amber
    return '#10b981'; // green
  };

  // Handle phase navigation
  const handlePhaseClick = (targetPhase: SessionPhase) => {
    const targetIndex = phaseConfigs.findIndex((p) => p.phase === targetPhase);

    // Progressive navigation rules
    if (targetIndex <= currentPhaseIndex) {
      // Can always go back
      setPhase(targetPhase);
    } else if (targetIndex === currentPhaseIndex + 1) {
      // Can go forward one
      setPhase(targetPhase);
    } else {
      // Cannot skip ahead
      addToast('Complete current phase before skipping ahead', 'warning', 3000);
    }
  };

  // Handle pause/resume
  const handlePauseResume = () => {
    if (timerState.isPaused) {
      resumeMeeting();
      addToast('Meeting timer resumed', 'info', 2000);
    } else {
      pauseMeeting();
      addToast('Meeting timer paused', 'info', 2000);
    }
  };

  // Handle reset
  const handleReset = () => {
    if (confirm('Reset meeting timer? This will clear all time tracking data.')) {
      resetMeeting();
      startMeeting(state.projectContext.duration);
      addToast('Meeting timer reset', 'success', 3000);
    }
  };

  // Determine phase states
  const getPhaseState = (index: number) => {
    const isCompleted = index < currentPhaseIndex;
    const isCurrent = index === currentPhaseIndex;
    const isNext = index === currentPhaseIndex + 1;
    const isLocked = index > currentPhaseIndex + 1;

    return { isCompleted, isCurrent, isNext, isLocked };
  };

  const currentElapsedMs = getCurrentElapsedMs();
  const expectedMs = timerState.expectedDurationMs;

  return (
    <div
      className="w-full shadow-lg transition-colors duration-500"
      style={{ backgroundColor: getPacingColor() }}
    >
      <div className="px-4 py-2.5">
        {/* Header: Meeting Time Display */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-4">
            <div>
              <div className="text-[10px] text-white opacity-80 uppercase tracking-wide">
                Meeting Time
              </div>
              <div className="text-lg font-mono font-bold text-white tabular-nums">
                {formatMs(currentElapsedMs)} / {formatMs(expectedMs)}
              </div>
            </div>
            {timerState.isPaused && (
              <div className="px-2 py-0.5 bg-white bg-opacity-20 rounded-full text-white text-xs font-semibold">
                PAUSED
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePauseResume}
              className="px-3 py-1.5 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-md transition-colors font-medium text-xs"
              aria-label={timerState.isPaused ? 'Resume timer' : 'Pause timer'}
            >
              {timerState.isPaused ? (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
            <button
              onClick={handleReset}
              className="px-3 py-1.5 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-md transition-colors font-medium text-xs"
              aria-label="Reset timer"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Timeline Container */}
        <div className="relative">
          {/* Phase Markers Row */}
          <div className="relative h-12 mb-2">
            {phaseConfigs.map((config, index) => {
              const { isCompleted, isCurrent, isNext, isLocked } = getPhaseState(index);
              const completedTimeMs = isCompleted ? getPhaseElapsedMs(config.phase) : undefined;

              return (
                <PhaseMarker
                  key={config.phase}
                  config={config}
                  position={getPhasePosition(index)}
                  isCompleted={isCompleted}
                  isCurrent={isCurrent}
                  isNext={isNext}
                  isLocked={isLocked}
                  onClick={() => handlePhaseClick(config.phase)}
                  completedTimeMs={completedTimeMs}
                />
              );
            })}
          </div>

          {/* Timeline Bar Container */}
          <div className="relative h-3 bg-white bg-opacity-20 rounded-full overflow-visible">
            {/* Red Fill Bar (Time Elapsed) */}
            <div
              className="absolute left-0 top-0 h-full bg-red-500 bg-opacity-80 transition-all duration-1000 ease-linear rounded-full"
              style={{ width: `${getElapsedPosition()}%` }}
              aria-label="Time elapsed"
            />

            {/* Current Phase Thumb */}
            <div
              className="absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-white border-4 border-blue-500 rounded-full shadow-lg transition-all duration-300"
              style={{ left: `${getCurrentPhasePosition()}%`, transform: 'translate(-50%, -50%)' }}
              aria-label="Current phase position"
            />
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-6 mt-3 text-white text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 bg-opacity-80 rounded" />
              <span>Time Elapsed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-white border-2 border-blue-500 rounded-full" />
              <span>Current Phase</span>
            </div>
          </div>
        </div>

        {/* Current Phase Info */}
        <div className="mt-4 flex items-center justify-between text-white">
          <div>
            <span className="text-xs opacity-80 uppercase tracking-wide">Current Phase</span>
            <div className="text-lg font-semibold">
              {phaseConfigs[currentPhaseIndex]?.label || 'Unknown'}
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs opacity-80 uppercase tracking-wide">Progress</span>
            <div className="text-lg font-semibold">
              {currentPhaseIndex + 1} of {phaseConfigs.length}
            </div>
          </div>
        </div>

        {/* Accessible live region */}
        <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
          {timerState.isPaused
            ? 'Timer paused'
            : `${formatMs(currentElapsedMs)} elapsed in ${phaseConfigs[currentPhaseIndex]?.label || 'current phase'}`}
        </div>
      </div>
    </div>
  );
};

export default GlobalTimeline;
