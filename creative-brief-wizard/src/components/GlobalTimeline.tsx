import { useState, useEffect } from 'react';
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
    // Sticky notes phases temporarily shelved
    // { phase: 'sticky-notes-diverge', label: 'Diverge', shortLabel: 'Dv', color: '#8b5cf6' },
    // { phase: 'sticky-notes-converge', label: 'Converge', shortLabel: 'C', color: '#ec4899' },
    // { phase: 'spot-exercises', label: 'Exercises', shortLabel: 'SE', color: '#f59e0b' },
    { phase: 'prioritization', label: 'Prioritize', shortLabel: 'P', color: '#14b8a6' },
    { phase: 'synthesis-review', label: 'Review', shortLabel: 'R', color: '#6366f1' },
    { phase: 'brief-complete', label: 'Complete', shortLabel: 'B', color: '#22c55e' },
  ];

  // Base proportions (totals to 60 minutes)
  const baseProportions = [5, 30, 15, 8, 2]; // minutes - redistributed without sticky notes
  const totalBaseMinutes = baseProportions.reduce((sum, val) => sum + val, 0);

  return baseDurations.map((phase, index) => ({
    ...phase,
    expectedDurationMs: (baseProportions[index] / totalBaseMinutes) * workshopDurationMinutes * 60 * 1000,
  }));
}

// ============================================================================
// Phase Marker Component (Video Player Style)
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
      return 'bg-white border-white cursor-pointer hover:scale-125';
    }
    if (isCurrent) {
      return 'bg-white border-white shadow-lg cursor-pointer scale-125';
    }
    if (isNext) {
      return 'bg-white bg-opacity-50 border-white cursor-pointer hover:scale-110';
    }
    return 'bg-white bg-opacity-20 border-white border-opacity-30 cursor-not-allowed';
  };

  const formatTime = (ms: number): string => {
    const minutes = Math.floor(ms / 60000);
    return `${minutes}m`;
  };

  const expectedMinutes = Math.round(config.expectedDurationMs / 60000);

  return (
    <div
      className="absolute flex flex-col items-center justify-center"
      style={{ 
        left: `${position}%`, 
        transform: 'translateX(-50%)',
        bottom: '0',
        height: '100%'
      }}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute bottom-full mb-3 bg-gray-900 text-white px-3 py-2 rounded-lg shadow-xl z-50 whitespace-nowrap text-xs">
          <div className="font-semibold">{config.label}</div>
          {completedTimeMs !== undefined ? (
            <div className="text-green-400 text-[10px]">
              Completed in {formatTime(completedTimeMs)}
            </div>
          ) : (
            <div className="text-gray-300 text-[10px]">{expectedMinutes}m expected</div>
          )}
        </div>
      )}

      {/* Circular Thumb - Vertically Centered on Bar */}
      <div
        className={`w-3 h-3 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${getMarkerStyle()}`}
        onClick={isLocked ? undefined : onClick}
        role="button"
        aria-label={`${config.label} phase`}
        tabIndex={isLocked ? -1 : 0}
      >
        {/* Checkmark for completed */}
        {isCompleted && (
          <svg className="w-2 h-2 text-gray-800" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// GlobalTimeline Component (Video Player Style)
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
    // getPhaseElapsedMs,
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
  const currentPhase = phaseConfigs[currentPhaseIndex];

  return (
    <div
      className="fixed bottom-0 left-0 right-0 bg-gray-900 bg-opacity-95 backdrop-blur-sm shadow-2xl z-40"
      style={{ height: '48px' }}
    >
      <div className="relative h-full flex items-center px-6">
        {/* Left Side: Time Display */}
        <div className="flex items-center gap-3 text-white text-xs font-mono">
          <span className="font-semibold tabular-nums">
            {formatMs(currentElapsedMs)}
          </span>
          <span className="text-gray-400">/</span>
          <span className="text-gray-400 tabular-nums">
            {formatMs(expectedMs)}
          </span>
          {timerState.isPaused && (
            <span className="ml-2 px-2 py-0.5 bg-yellow-500 bg-opacity-20 text-yellow-400 rounded text-[10px] font-bold">
              PAUSED
            </span>
          )}
        </div>

        {/* Center: Progress Bar with Phase Markers */}
        <div className="flex-1 mx-6 relative" style={{ height: '4px' }}>
          {/* Background Track */}
          <div className="absolute inset-0 bg-white bg-opacity-20 rounded-full overflow-hidden">
            {/* Elapsed Time Fill */}
            <div
              className="h-full transition-all duration-300 rounded-full"
              style={{
                width: `${getElapsedPosition()}%`,
                backgroundColor: getPacingColor(),
              }}
            />
          </div>

          {/* Phase Markers */}
          {phaseConfigs.map((config, index) => {
            const position = getPhasePosition(index);
            const { isCompleted, isCurrent, isNext, isLocked } = getPhaseState(index);
            const completedTimeMs = (state as any).phaseCompletionTimes?.[config.phase];

            return (
              <PhaseMarker
                key={config.phase}
                config={config}
                position={position}
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

        {/* Right Side: Current Phase & Controls */}
        <div className="flex items-center gap-3">
          {/* Current Phase */}
          <div className="text-white text-xs font-medium">
            {currentPhase?.label || 'Workshop'}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-1">
            <button
              onClick={handlePauseResume}
              className="w-7 h-7 flex items-center justify-center bg-white bg-opacity-10 hover:bg-opacity-20 text-white rounded transition-colors"
              aria-label={timerState.isPaused ? 'Resume timer' : 'Pause timer'}
              title={timerState.isPaused ? 'Resume' : 'Pause'}
            >
              {timerState.isPaused ? (
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
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
              className="w-7 h-7 flex items-center justify-center bg-white bg-opacity-10 hover:bg-opacity-20 text-white rounded transition-colors text-[10px] font-bold"
              aria-label="Reset timer"
              title="Reset"
            >
              ↻
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
