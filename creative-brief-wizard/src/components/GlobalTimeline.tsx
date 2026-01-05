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
  icon: React.ReactNode;
  color: string;
}

const PHASES: PhaseConfig[] = [
  {
    phase: 'project-context',
    label: 'Welcome',
    icon: <Sparkles className="w-4 h-4" />,
    color: '#10b981',
  },
  {
    phase: 'customer-discovery',
    label: 'Discovery',
    icon: <HelpCircle className="w-4 h-4" />,
    color: '#3b82f6',
  },
  {
    phase: 'prioritization',
    label: 'Prioritize',
    icon: <TrendingUp className="w-4 h-4" />,
    color: '#14b8a6',
  },
  {
    phase: 'synthesis-review',
    label: 'Review',
    icon: <Users className="w-4 h-4" />,
    color: '#6366f1',
  },
  {
    phase: 'brief-complete',
    label: 'Complete',
    icon: <CheckCircle2 className="w-4 h-4" />,
    color: '#22c55e',
  },
];

// ============================================================================
// GlobalTimeline Component - String of Beads
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

  const currentPhaseIndex = PHASES.findIndex((p) => p.phase === state.currentPhase);
  const currentElapsedMs = getCurrentElapsedMs();
  const expectedMs = timerState.expectedDurationMs;
  const progressPercent = getProgressPercentage();

  // Determine pacing color
  const getPacingColor = (): string => {
    const status = getPacingStatus(currentPhaseIndex, PHASES.length);
    if (status === 'over') return '#dc2626'; // red
    if (status === 'behind') return '#f59e0b'; // amber
    return '#10b981'; // green
  };

  // Handle phase navigation
  const handlePhaseClick = (targetPhase: SessionPhase) => {
    setPhase(targetPhase);
    const phaseName = PHASES.find((p) => p.phase === targetPhase)?.label;
    addToast(`Navigated to ${phaseName}`, 'info', 2000);
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
    if (confirm('Reset meeting timer?')) {
      resetMeeting();
      startMeeting(state.projectContext.duration);
      addToast('Meeting timer reset', 'success', 3000);
    }
  };

  return (
    <div className="w-full bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4">
        {/* Top row: Time and controls */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm font-semibold text-gray-700">
              {formatMs(currentElapsedMs)}
            </span>
            <span className="text-gray-400 text-sm">/</span>
            <span className="font-mono text-sm text-gray-600">
              {formatMs(expectedMs)}
            </span>
            {timerState.isPaused && (
              <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded">
                PAUSED
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePauseResume}
              className="p-1.5 hover:bg-gray-100 rounded transition-colors"
              title={timerState.isPaused ? 'Resume' : 'Pause'}
            >
              {timerState.isPaused ? (
                <Play className="w-4 h-4 text-gray-600" />
              ) : (
                <Pause className="w-4 h-4 text-gray-600" />
              )}
            </button>
            <button
              onClick={handleReset}
              className="p-1.5 hover:bg-gray-100 rounded transition-colors"
              title="Reset"
            >
              <RotateCcw className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Timeline: String of Beads */}
        <div className="relative h-12 flex items-center">
          {/* Background line */}
          <div className="absolute left-0 right-0 h-1 bg-gray-200 rounded-full" />

          {/* Progress fill */}
          <div
            className="absolute left-0 h-1 rounded-full transition-all duration-300"
            style={{
              width: `${progressPercent}%`,
              backgroundColor: getPacingColor(),
            }}
          />

          {/* Beads (phase icons) */}
          <div className="relative w-full flex items-center justify-between px-2">
            {PHASES.map((phase, index) => {
              const isCompleted = index < currentPhaseIndex;
              const isCurrent = index === currentPhaseIndex;

              return (
                <button
                  key={phase.phase}
                  onClick={() => handlePhaseClick(phase.phase)}
                  className="relative z-10 flex-shrink-0 group"
                  title={phase.label}
                >
                  {/* Bead icon */}
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
                      isCurrent
                        ? 'ring-2 ring-offset-1 scale-125 shadow-md'
                        : 'hover:scale-110 shadow-sm'
                    }`}
                    style={{
                      backgroundColor: phase.color,
                      color: 'white',
                      opacity: isCurrent ? 1 : isCompleted ? 0.9 : 0.6,
                    }}
                  >
                    {phase.icon}
                  </div>

                  {/* Completion checkmark */}
                  {isCompleted && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full flex items-center justify-center">
                      <svg
                        className="w-1.5 h-1.5 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}

                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    {phase.label}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
