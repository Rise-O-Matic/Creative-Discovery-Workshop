# Enhanced GlobalTimeline - Code Snippets

Quick reference guide for key code snippets and usage patterns.

## Usage in Components

### Using Meeting Timer in a Component

```typescript
import { useMeetingTimer } from '../contexts/MeetingTimerContext';
import { useFormattedTime } from '../hooks/useMeetingTimer';

function MyComponent() {
  const {
    timerState,
    pauseMeeting,
    resumeMeeting,
    getCurrentElapsedMs,
  } = useMeetingTimer();

  const { formatMs, getProgressPercentage } = useFormattedTime();

  return (
    <div>
      <p>Elapsed: {formatMs(getCurrentElapsedMs())}</p>
      <p>Progress: {getProgressPercentage()}%</p>
      <p>Status: {timerState.isPaused ? 'Paused' : 'Running'}</p>
      <button onClick={pauseMeeting}>Pause</button>
      <button onClick={resumeMeeting}>Resume</button>
    </div>
  );
}
```

### Automatic Phase Tracking

```typescript
import { usePhaseTimer } from '../hooks/useMeetingTimer';
import { useSession } from '../hooks/useSession';

function PhaseComponent() {
  const { state } = useSession();

  // Automatically tracks entry/exit of this phase
  usePhaseTimer(state.currentPhase);

  return <div>Phase content</div>;
}
```

### Progressive Navigation

```typescript
import { useSession } from '../hooks/useSession';
import { useToast } from '../contexts/ToastContext';

function NavigationExample() {
  const { navigateToPhase } = useSession();
  const { addToast } = useToast();

  const handleNavigate = (targetPhase: SessionPhase) => {
    const success = navigateToPhase(targetPhase);

    if (!success) {
      addToast('Complete current phase before skipping ahead', 'warning');
    }
  };

  return (
    <button onClick={() => handleNavigate('customer-discovery')}>
      Go to Discovery
    </button>
  );
}
```

## MeetingTimerContext API

### Starting a Meeting

```typescript
const { startMeeting } = useMeetingTimer();

// Start a 60-minute meeting
startMeeting(60);

// Start a 90-minute meeting
startMeeting(90);
```

### Pause/Resume Controls

```typescript
const { pauseMeeting, resumeMeeting, timerState } = useMeetingTimer();

// Pause the timer
pauseMeeting();

// Resume the timer
resumeMeeting();

// Check if paused
if (timerState.isPaused) {
  console.log('Timer is paused');
}
```

### Reset Timer

```typescript
const { resetMeeting, startMeeting } = useMeetingTimer();

// Reset and restart
const handleReset = () => {
  if (confirm('Reset timer?')) {
    resetMeeting();
    startMeeting(60); // Restart with 60 minutes
  }
};
```

### Get Elapsed Time

```typescript
const { getCurrentElapsedMs, getPhaseElapsedMs } = useMeetingTimer();

// Get total elapsed time in milliseconds
const totalElapsed = getCurrentElapsedMs();

// Get time spent in a specific phase
const discoveryTime = getPhaseElapsedMs('customer-discovery');

// Convert to minutes
const minutes = Math.floor(totalElapsed / 60000);
```

### Phase Entry/Exit Tracking

```typescript
const { enterPhase, exitPhase } = useMeetingTimer();

// Manually track phase entry (usually done automatically)
enterPhase('customer-discovery');

// Manually track phase exit (usually done automatically)
exitPhase('customer-discovery');
```

### Pacing Status

```typescript
const { getPacingStatus } = useMeetingTimer();

const currentPhaseIndex = 3;
const totalPhases = 8;

const status = getPacingStatus(currentPhaseIndex, totalPhases);
// Returns: 'on-track' | 'behind' | 'over'

if (status === 'over') {
  console.log('Significantly behind schedule!');
}
```

## SessionContext API

### Navigate to Phase

```typescript
const { navigateToPhase, state } = useSession();

// Try to navigate to a phase
const canNavigate = navigateToPhase('spot-exercises');

if (canNavigate) {
  console.log('Navigation successful');
} else {
  console.log('Navigation blocked by progressive rules');
}
```

### Check Current Phase

```typescript
const { state } = useSession();

console.log('Current phase:', state.currentPhase);
console.log('Completed phases:', state.completedPhases);

const isCompleted = state.completedPhases.includes('customer-discovery');
```

## Formatted Time Utilities

### Format Milliseconds

```typescript
import { useFormattedTime } from '../hooks/useMeetingTimer';

const { formatMs, formatMsLong } = useFormattedTime();

// Short format: "15:30"
const short = formatMs(930000); // "15:30"

// Long format: "15m 30s"
const long = formatMsLong(930000); // "15m 30s"

// Only minutes: "15m"
const onlyMinutes = formatMsLong(900000); // "15m"

// Only seconds: "30s"
const onlySeconds = formatMsLong(30000); // "30s"
```

### Get Progress Percentage

```typescript
const { getProgressPercentage } = useFormattedTime();

const percentage = getProgressPercentage();
// Returns: number between 0-100

// Use in progress bar
<div style={{ width: `${percentage}%` }} />
```

### Display Current Time

```typescript
const {
  getCurrentElapsedFormatted,
  getExpectedDurationFormatted,
} = useFormattedTime();

const display = `${getCurrentElapsedFormatted()} / ${getExpectedDurationFormatted()}`;
// Example: "15:30 / 60:00"
```

## Phase Configuration

### Phase Definitions

```typescript
interface PhaseConfig {
  phase: SessionPhase;
  label: string;
  shortLabel: string;
  expectedDurationMs: number;
  color: string;
}

const phaseConfigs: PhaseConfig[] = [
  {
    phase: 'project-context',
    label: 'Welcome',
    shortLabel: 'W',
    expectedDurationMs: 5 * 60 * 1000,
    color: '#10b981',
  },
  {
    phase: 'customer-discovery',
    label: 'Discovery',
    shortLabel: 'D',
    expectedDurationMs: 15 * 60 * 1000,
    color: '#3b82f6',
  },
  // ... more phases
];
```

### Calculate Phase Position

```typescript
const getPhasePosition = (index: number, configs: PhaseConfig[]): number => {
  const totalMs = configs.reduce((sum, p) => sum + p.expectedDurationMs, 0);
  const cumulativeMs = configs
    .slice(0, index)
    .reduce((sum, p) => sum + p.expectedDurationMs, 0);

  return (cumulativeMs / totalMs) * 100;
};

// Example: Get position of phase 3
const position = getPhasePosition(3, phaseConfigs);
// Returns percentage (0-100)
```

## localStorage Interaction

### Reading Timer State

```typescript
const STORAGE_KEY = 'creative-discovery-meeting-timer';

const loadTimerState = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    return JSON.parse(stored);
  } catch (error) {
    console.error('Failed to load timer state:', error);
    return null;
  }
};

const state = loadTimerState();
```

### Saving Timer State

```typescript
const saveTimerState = (state: MeetingTimerState) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save timer state:', error);
  }
};
```

### Clear Timer Data

```typescript
const clearTimerData = () => {
  localStorage.removeItem('creative-discovery-meeting-timer');
};
```

## Common Patterns

### Timer with Display

```typescript
function TimerDisplay() {
  const { getCurrentElapsedMs, timerState } = useMeetingTimer();
  const { formatMs } = useFormattedTime();

  const elapsed = getCurrentElapsedMs();
  const expected = timerState.expectedDurationMs;
  const remaining = Math.max(0, expected - elapsed);

  return (
    <div>
      <p>Elapsed: {formatMs(elapsed)}</p>
      <p>Expected: {formatMs(expected)}</p>
      <p>Remaining: {formatMs(remaining)}</p>
      {timerState.isPaused && <p>⏸ PAUSED</p>}
    </div>
  );
}
```

### Progress Bar with Colors

```typescript
function ProgressBar() {
  const { getProgressPercentage, getPacingStatus } = useMeetingTimer();
  const currentPhaseIndex = 3;
  const totalPhases = 8;

  const percentage = getProgressPercentage();
  const status = getPacingStatus(currentPhaseIndex, totalPhases);

  const getColor = () => {
    if (status === 'over') return '#dc2626';
    if (status === 'behind') return '#f59e0b';
    return '#10b981';
  };

  return (
    <div style={{
      width: '100%',
      height: '8px',
      backgroundColor: '#e5e7eb',
      borderRadius: '4px',
    }}>
      <div style={{
        width: `${percentage}%`,
        height: '100%',
        backgroundColor: getColor(),
        borderRadius: '4px',
        transition: 'all 1s ease-linear',
      }} />
    </div>
  );
}
```

### Phase Navigation with Confirmation

```typescript
function NavigateWithConfirmation() {
  const { navigateToPhase, state } = useSession();
  const { addToast } = useToast();

  const handleNavigate = async (targetPhase: SessionPhase) => {
    // Check if there's unsaved work
    const hasUnsavedWork = checkForUnsavedWork();

    if (hasUnsavedWork) {
      const confirmed = confirm(
        'You have unsaved work. Continue anyway?'
      );
      if (!confirmed) return;
    }

    const success = navigateToPhase(targetPhase);

    if (!success) {
      addToast(
        'Complete current phase before skipping ahead',
        'warning',
        3000
      );
    } else {
      addToast(`Navigated to ${targetPhase}`, 'success', 2000);
    }
  };

  return (
    <button onClick={() => handleNavigate('spot-exercises')}>
      Go to Exercises
    </button>
  );
}

function checkForUnsavedWork(): boolean {
  // Your logic here
  return false;
}
```

### Phase Timer Hook Integration

```typescript
function PhaseWithTimer() {
  const { state } = useSession();
  const { getPhaseElapsedMs } = useMeetingTimer();
  const { formatMsLong } = useFormattedTime();

  // Auto-track this phase
  usePhaseTimer(state.currentPhase);

  // Get time spent in current phase
  const phaseElapsed = getPhaseElapsedMs(state.currentPhase);

  return (
    <div>
      <h1>Current Phase: {state.currentPhase}</h1>
      <p>Time in phase: {formatMsLong(phaseElapsed)}</p>
    </div>
  );
}
```

### Real-time Updates

```typescript
function RealTimeTimer() {
  const [currentTime, setCurrentTime] = useState(Date.now());
  const { timerState } = useMeetingTimer();

  // Update every second
  useEffect(() => {
    if (timerState.isPaused) return;

    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, [timerState.isPaused]);

  // Calculate elapsed
  const elapsed = timerState.meetingStartTime
    ? currentTime - timerState.meetingStartTime - timerState.totalPausedMs
    : 0;

  return <div>{Math.floor(elapsed / 1000)} seconds</div>;
}
```

## TypeScript Types

### Import Types

```typescript
import type {
  SessionPhase,
  SessionState,
} from '../types';

import type {
  MeetingTimerState,
  PhaseTimestamp,
} from '../contexts/MeetingTimerContext';
```

### Type Guards

```typescript
function isValidPhase(phase: string): phase is SessionPhase {
  const validPhases: SessionPhase[] = [
    'project-context',
    'customer-discovery',
    'sticky-notes-diverge',
    'sticky-notes-converge',
    'spot-exercises',
    'prioritization',
    'synthesis-review',
    'brief-complete',
  ];

  return validPhases.includes(phase as SessionPhase);
}

// Usage
const phase: string = getUserInput();
if (isValidPhase(phase)) {
  navigateToPhase(phase); // TypeScript knows it's SessionPhase
}
```

### Custom Hook Type

```typescript
type TimerHookReturn = {
  elapsed: number;
  formatted: string;
  isPaused: boolean;
  pause: () => void;
  resume: () => void;
};

function useTimer(): TimerHookReturn {
  const { getCurrentElapsedMs, timerState, pauseMeeting, resumeMeeting } = useMeetingTimer();
  const { formatMs } = useFormattedTime();

  return {
    elapsed: getCurrentElapsedMs(),
    formatted: formatMs(getCurrentElapsedMs()),
    isPaused: timerState.isPaused,
    pause: pauseMeeting,
    resume: resumeMeeting,
  };
}
```

## Error Handling

### Safe Navigation

```typescript
function SafeNavigation() {
  const { navigateToPhase } = useSession();
  const { addToast } = useToast();

  const safeNavigate = (targetPhase: SessionPhase) => {
    try {
      const success = navigateToPhase(targetPhase);

      if (!success) {
        addToast('Cannot navigate to that phase yet', 'warning');
      }
    } catch (error) {
      console.error('Navigation error:', error);
      addToast('Navigation failed', 'error');
    }
  };

  return <button onClick={() => safeNavigate('spot-exercises')}>Navigate</button>;
}
```

### localStorage Error Handling

```typescript
function SafeTimerPersistence() {
  const saveWithErrorHandling = (state: MeetingTimerState) => {
    try {
      localStorage.setItem('meeting-timer', JSON.stringify(state));
    } catch (error) {
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        console.error('localStorage quota exceeded');
        // Handle quota error (e.g., clear old data)
      } else {
        console.error('Failed to save timer state:', error);
      }
    }
  };

  return saveWithErrorHandling;
}
```

## Testing Utilities

### Mock Timer State

```typescript
const mockTimerState: MeetingTimerState = {
  meetingStartTime: Date.now() - 900000, // 15 minutes ago
  totalElapsedMs: 900000,
  expectedDurationMs: 3600000, // 60 minutes
  isPaused: false,
  pausedAt: null,
  totalPausedMs: 0,
  phaseTimestamps: {
    'project-context': {
      enteredAt: Date.now() - 900000,
      exitedAt: Date.now() - 600000,
      totalTimeMs: 300000, // 5 minutes
    },
    'customer-discovery': {
      enteredAt: Date.now() - 600000,
      totalTimeMs: 600000, // 10 minutes so far
    },
  },
};
```

### Test Phase Navigation

```typescript
describe('Phase Navigation', () => {
  it('should allow backward navigation', () => {
    const { navigateToPhase } = useSession();
    const result = navigateToPhase('project-context');
    expect(result).toBe(true);
  });

  it('should prevent skipping phases', () => {
    const { navigateToPhase } = useSession();
    const result = navigateToPhase('brief-complete');
    expect(result).toBe(false);
  });
});
```

## Performance Tips

### Memoize Expensive Calculations

```typescript
function OptimizedTimeline() {
  const { timerState } = useMeetingTimer();
  const { state } = useSession();

  // Memoize phase configs
  const phaseConfigs = useMemo(
    () => calculatePhaseConfigs(state.projectContext.duration),
    [state.projectContext.duration]
  );

  // Memoize progress calculation
  const progress = useMemo(
    () => (timerState.totalElapsedMs / timerState.expectedDurationMs) * 100,
    [timerState.totalElapsedMs, timerState.expectedDurationMs]
  );

  return <ProgressBar progress={progress} phases={phaseConfigs} />;
}
```

### Debounce localStorage Saves

```typescript
function useDebouncedSave(state: MeetingTimerState, delay: number = 10000) {
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      saveTimerState(state);
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [state, delay]);
}
```

## Accessibility Snippets

### Screen Reader Announcements

```typescript
function AccessibleTimer() {
  const { formatMs, getCurrentElapsedMs } = useFormattedTime();
  const { timerState } = useMeetingTimer();

  return (
    <>
      {/* Visual display */}
      <div>{formatMs(getCurrentElapsedMs())}</div>

      {/* Screen reader announcement */}
      <div
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {timerState.isPaused
          ? 'Timer paused'
          : `${formatMs(getCurrentElapsedMs())} elapsed`}
      </div>
    </>
  );
}
```

### Keyboard Navigation

```typescript
function KeyboardAccessiblePhase({ phase }: { phase: SessionPhase }) {
  const { navigateToPhase } = useSession();

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      navigateToPhase(phase);
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => navigateToPhase(phase)}
      onKeyPress={handleKeyPress}
      aria-label={`Navigate to ${phase} phase`}
    >
      {phase}
    </div>
  );
}
```
