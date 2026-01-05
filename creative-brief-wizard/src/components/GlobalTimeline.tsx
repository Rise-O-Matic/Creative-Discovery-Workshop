import { useEffect } from 'react';
import { useSession } from '../hooks/useSession';
import { useToast } from '../contexts/ToastContext';
import { useMeetingTimer } from '../contexts/MeetingTimerContext';
import { useFormattedTime } from '../hooks/useMeetingTimer';
import type { SessionPhase } from '../types';
import {
  Sparkles,
  HelpCircle,
  Users,
  TrendingUp,
  CheckCircle2,
  Play,
  Pause,
  RotateCcw,
} from 'lucide-react';

// ============================================================================
// Phase Configuration with Icons
// ============================================================================

interface PhaseConfig {
  phase: SessionPhase;
  label: string;
  shortLabel: string;
  icon: React.ReactNode;
  color: string;
  expectedDurationMs: number;
}

/**
 * Calculate phase durations based on total workshop duration
 */
function calculatePhaseConfigs(workshopDurationMinutes: number): PhaseConfig[] {
  const baseDurations: Omit<PhaseConfig, 'expectedDurationMs'>[] = [
    {
      phase: 'project-context',
      label: 'Welcome',
      shortLabel: 'W',
      icon: <Sparkles className="w-5 h-5" />,
      color: '#10b981',
    },
    {
      phase: 'customer-discovery',
      label: 'Discovery',
      shortLabel: 'D',
      icon: <HelpCircle className="w-5 h-5" />,
      color: '#3b82f6',
    },
    {
      phase: 'prioritization',
      label: 'Prioritize',
      shortLabel: 'P',
      icon: <TrendingUp className="w-5 h-5" />,
      color: '#14b8a6',
    },
    {
      phase: 'synthesis-review',
      label: 'Review',
      shortLabel: 'R',
      icon: <Users className="w-5 h-5" />,
      color: '#6366f1',
    },
    {
      phase: 'brief-complete',
      label: 'Complete',
      shortLabel: 'B',
      icon: <CheckCircle2 className="w-5 h-5" />,
      color: '#22c55e',
    },
  ];

  // Base proportions (totals to 60 minutes)
  const baseProportions = [5, 30, 15, 8, 2]; // minutes - redistributed without sticky notes
  const totalBaseMinutes = baseProportions.reduce((sum, val) => sum + val, 0);

  return baseDurations.map((phase, index) => ({
    ...phase,
    expectedDurationMs:
      (baseProportions[index] / totalBaseMinutes) * workshopDurationMinutes * 60 * 1000,
  }));
}

// ============================================================================
// Phase Marker Component (Top Timeline Style)
// ============================================================================

interface PhaseMarkerProps {
  config: PhaseConfig;
  isCompleted: boolean;
  isCurrent: boolean;
  onClick: () => void;
}

const PhaseMarker: React.FC<PhaseMarkerProps> = ({
  config,
  isCompleted,
  isCurrent,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-2 transition-all duration-200 group`}
    >
      {/* Icon Circle */}
      <div
        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 ${
          isCurrent
            ? 'ring-4 ring-offset-2 scale-110 shadow-lg'
            : isCompleted
              ? 'bg-opacity-100 shadow-md'
              : 'bg-opacity-60 shadow-sm'
        }`}
        style={{
          backgroundColor: config.color,
          color: 'white',
        }}
      >
        {config.icon}
      </div>

      {/* Label */}
      <div className="text-center">
        <p
          className={`text-xs font-semibold transition-colors ${
            isCurrent ? 'text-gray-900' : isCompleted ? 'text-gray-700' : 'text-gray-500'
          }`}
        >
          {config.label}
        </p>
      </div>

      {/* Completion Indicator */}
      {isCompleted && (
        <div className="absolute -top-1 -right-1">
          <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
            <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
      )}
    </button>
  );
};

// ============================================================================
// GlobalTimeline Component (Top Position)
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
  // totalExpectedMs could be used for getPhasePosition calculation
  // const totalExpectedMs = phaseConfigs.reduce((sum, p) => sum + p.expectedDurationMs, 0);
  // getPhasePosition is not currently used but kept for future reference
  // const getPhasePosition = (index: number): number => {
  //   const cumulativeMs = phaseConfigs.slice(0, index).reduce((sum, p) => sum + p.expectedDurationMs, 0);
  //   return (cumulativeMs / totalExpectedMs) * 100;
  // };}

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

  // Handle phase navigation - FREE NAVIGATION (no locking)
  const handlePhaseClick = (targetPhase: SessionPhase) => {
    setPhase(targetPhase);
    addToast(`Navigated to ${phaseConfigs.find((p) => p.phase === targetPhase)?.label}`, 'info', 2000);
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

    return { isCompleted, isCurrent };
  };

  const currentElapsedMs = getCurrentElapsedMs();
  const expectedMs = timerState.expectedDurationMs;
  const currentPhase = phaseConfigs[currentPhaseIndex];

  return (
    <div className="w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Top Row: Timer and Controls */}
        <div className="flex items-center justify-between mb-8">
          {/* Left: Time Display */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-gray-700">
              <span className="font-mono font-semibold text-lg">
                {formatMs(currentElapsedMs)}
              </span>
              <span className="text-gray-400">/</span>
              <span className="font-mono text-gray-600">
                {formatMs(expectedMs)}
              </span>
            </div>
            {timerState.isPaused && (
              <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">
                PAUSED
              </span>
            )}
          </div>

          {/* Right: Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePauseResume}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title={timerState.isPaused ? 'Resume' : 'Pause'}
            >
              {timerState.isPaused ? (
                <Play className="w-5 h-5 text-gray-600" />
              ) : (
                <Pause className="w-5 h-5 text-gray-600" />
              )}
            </button>
            <button
              onClick={handleReset}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Reset"
            >
              <RotateCcw className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full transition-all duration-300 rounded-full"
              style={{
                width: `${getElapsedPosition()}%`,
                backgroundColor: getPacingColor(),
              }}
            />
          </div>
        </div>

        {/* Phase Markers */}
        <div className="flex items-end justify-between gap-4">
          {phaseConfigs.map((config, index) => {
            const { isCompleted, isCurrent } = getPhaseState(index);

            return (
              <div key={config.phase} className="flex-1 flex justify-center relative">
                <PhaseMarker
                  config={config}
                  isCompleted={isCompleted}
                  isCurrent={isCurrent}
                  onClick={() => handlePhaseClick(config.phase)}
                />
              </div>
            );
          })}
        </div>

        {/* Current Phase Label */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Current Phase: <span className="font-semibold text-gray-900">{currentPhase?.label}</span>
          </p>
        </div>
      </div>
    </div>
  );
};
