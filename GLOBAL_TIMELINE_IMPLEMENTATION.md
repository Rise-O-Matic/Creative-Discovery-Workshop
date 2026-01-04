# Enhanced GlobalTimeline Implementation

## Overview

This document describes the enhanced GlobalTimeline component with meeting time tracking and phase navigation capabilities. The implementation provides a YouTube-style timeline with dual visual elements: a red fill bar showing elapsed time and a separate navigation thumb showing the current phase.

## Key Features

### 1. YouTube-Style Timeline Navigation

The timeline displays TWO independent visual elements:

**Red Fill Bar (Time Elapsed)**
- Continuously grows based on real-time elapsed since meeting started
- Independent of current phase position
- Shows meeting progress: `elapsed time / total expected duration`
- Example: If 30 minutes elapsed in a 60-minute meeting, red bar fills 50% of timeline width

**Navigation Thumb/Indicator (Current Phase)**
- Shows which phase user is currently on
- Can be different from the time elapsed position
- User can click on phase markers to navigate
- Clicking updates the session phase but doesn't affect time tracking

### 2. Progressive Navigation Model

**Phase Access Rules:**
- ✅ Can navigate backward to any completed phase
- ✅ Can navigate to current phase
- ✅ Can navigate forward one phase (next phase)
- ❌ Cannot skip ahead multiple phases

**Visual States:**
- **Completed phases**: Green with checkmark, clickable, shows completion time in tooltip
- **Current phase**: White with pulsing animation, shows phase short label
- **Next phase**: Semi-transparent white, outlined, available for navigation
- **Locked phases**: Grayed out with lock icon, not clickable

### 3. Meeting Timer System

**Timer Features:**
- Auto-starts when meeting begins
- Pause/resume functionality with visual indicators
- Reset with confirmation dialog
- Persists to localStorage (auto-save every 10 seconds)
- Calculates elapsed time even across browser refreshes
- Tracks time spent in each phase

**Phase Time Tracking:**
- Records entry and exit timestamps for each phase
- Accumulates total time spent in each phase
- Displays actual completion time vs expected time in tooltips

### 4. Pacing Indicators

The timeline background color changes based on pacing:
- **Green**: On track (elapsed < 110% of expected at current phase)
- **Yellow/Amber**: Running behind (elapsed 110-130% of expected)
- **Red**: Significantly over (elapsed > 130% of expected)

## File Structure

### New Files Created

**1. `creative-brief-wizard/src/contexts/MeetingTimerContext.tsx`**
- Timer state management
- Elapsed time calculation
- Pause/resume logic
- Persistence to localStorage
- Phase timestamp tracking

**2. `creative-brief-wizard/src/hooks/useMeetingTimer.ts`**
- Custom hook for timer logic
- Real-time updates (useEffect with setInterval)
- Formatted time utilities
- Progress percentage calculation

### Updated Files

**1. `creative-brief-wizard/src/components/GlobalTimeline.tsx`**
- Complete rewrite with new features
- Click handlers for phase navigation
- Red fill bar for elapsed time
- Meeting timer display
- Pause/resume controls
- Phase markers with tooltips
- Progressive navigation logic

**2. `creative-brief-wizard/src/contexts/SessionContext.tsx`**
- Added `navigateToPhase()` function
- Added `completedPhases` array to track completion
- Integrated progressive navigation rules

**3. `creative-brief-wizard/src/types/index.ts`**
- Added `completedPhases: SessionPhase[]` to `SessionState`

**4. `creative-brief-wizard/src/App.tsx`**
- Wrapped app with `MeetingTimerProvider`
- Ensures timer context is available throughout app

## Technical Details

### Timer Update Frequency

- **Display Updates**: Every 1 second (for smooth UI)
- **Persistence**: Every 10 seconds (to localStorage)
- **Calculation**: `Date.now() - meetingStartTime - totalPausedMs`

### Phase Duration Defaults

Based on proportional scaling from 60-minute workshop:

```typescript
const PHASE_PROPORTIONS = {
  'project-context': 5,      // 5 min (8.3%)
  'customer-discovery': 15,  // 15 min (25%)
  'sticky-notes-diverge': 10, // 10 min (16.7%)
  'sticky-notes-converge': 10, // 10 min (16.7%)
  'spot-exercises': 10,      // 10 min (16.7%)
  'prioritization': 5,       // 5 min (8.3%)
  'synthesis-review': 3,     // 3 min (5%)
  'brief-complete': 2        // 2 min (3.3%)
  // Total: 60 minutes
};
```

### Phase Navigation Logic

```typescript
const navigateToPhase = (targetPhase: SessionPhase) => {
  const currentIndex = PHASES.indexOf(currentPhase);
  const targetIndex = PHASES.indexOf(targetPhase);

  if (targetIndex <= currentIndex) {
    // Can always go back
    setPhase(targetPhase);
    return true;
  } else if (targetIndex === currentIndex + 1) {
    // Can go forward one
    setPhase(targetPhase);
    return true;
  } else {
    // Cannot skip ahead
    showToast('Complete current phase first', 'warning');
    return false;
  }
};
```

### Data Persistence

**MeetingTimer State (localStorage: `creative-discovery-meeting-timer`):**
```typescript
{
  meetingStartTime: number | null,
  totalElapsedMs: number,
  expectedDurationMs: number,
  isPaused: boolean,
  pausedAt: number | null,
  totalPausedMs: number,
  phaseTimestamps: {
    [phase: string]: {
      enteredAt: number,
      exitedAt?: number,
      totalTimeMs: number
    }
  }
}
```

**Session State (localStorage: handled by existing SessionContext):**
```typescript
{
  // ... existing fields
  currentPhase: SessionPhase,
  completedPhases: SessionPhase[]
}
```

## User Interactions

### Click Phase Marker
- Navigates to that phase if allowed by progressive navigation rules
- Shows toast warning if trying to skip ahead
- Updates current phase indicator (blue thumb)
- Logs phase transition with timestamp

### Pause Button
- Stops time accumulation
- Shows "PAUSED" badge
- Changes button to resume icon
- Preserves elapsed time

### Resume Button
- Resumes time accumulation
- Removes "PAUSED" badge
- Changes button back to pause icon
- Accounts for paused duration in calculations

### Reset Button
- Shows confirmation dialog
- Clears all time data
- Restarts timer from zero
- Re-initializes with current workshop duration

### Hover Phase Marker
- Shows tooltip with phase name
- Shows expected duration (e.g., "Discovery (15m expected)")
- For completed phases: Shows actual time (e.g., "Discovery (completed in 18m)")

## Visual Layout

```
┌──────────────────────────────────────────────────────────┐
│ Meeting Time                                 [⏸] [Reset] │
│ 15:30 / 60:00                               PAUSED       │
├──────────────────────────────────────────────────────────┤
│                                                           │
│  [✓]  [✓]  [◉]  [ ]  [ ]  [ ]  [ ]  [ ]                 │ ← Phase Markers
│   W    D   Dv   C   SE   P    R    B                    │ ← Labels
│                                                           │
├──────────────────────────────────────────────────────────┤
│ ▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │ ← Red elapsed bar
│      ◉                                                    │ ← Current phase thumb
├──────────────────────────────────────────────────────────┤
│  [▓] Time Elapsed    [◉] Current Phase                  │ ← Legend
├──────────────────────────────────────────────────────────┤
│ Current Phase: Diverge               Progress: 3 of 8    │
└──────────────────────────────────────────────────────────┘
```

## Accessibility

- **ARIA Labels**: All interactive elements have proper aria-labels
- **Keyboard Navigation**: Phase markers are keyboard accessible (tab/enter)
- **Live Regions**: Screen reader announcements for time updates and phase changes
- **Locked State**: Locked phases have `tabIndex={-1}` and are not keyboard accessible
- **Semantic HTML**: Proper use of button roles and aria attributes

## Integration with Existing App

### SessionContext Integration

The SessionContext now provides:
```typescript
interface SessionContextValue {
  // ... existing methods
  navigateToPhase: (targetPhase: SessionPhase) => boolean;
}
```

### MeetingTimerContext Integration

The MeetingTimerContext provides:
```typescript
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
```

### Provider Hierarchy

```typescript
<SessionProvider>
  <ToastProvider>
    <MeetingTimerProvider>
      <AppContent />
    </MeetingTimerProvider>
  </ToastProvider>
</SessionProvider>
```

## Future Enhancements

Potential improvements for future iterations:

1. **Analytics Dashboard**: Export phase time data for analysis
2. **Custom Durations**: Allow users to set custom expected durations per phase
3. **Time Warnings**: Configurable warnings at different thresholds
4. **Phase Notes**: Add ability to attach notes to phase transitions
5. **Session Comparison**: Compare time across multiple sessions
6. **Export Reports**: Generate PDF reports with time breakdowns
7. **Keyboard Shortcuts**: Add hotkeys for pause/resume, navigation
8. **Phase Dependencies**: More complex phase dependency rules
9. **Time Estimation**: Learn from past sessions to improve estimates
10. **Multi-Session Support**: Track multiple parallel workshops

## Troubleshooting

### Timer Not Starting
- Check that `MeetingTimerProvider` is properly wrapped around the app
- Verify `state.projectContext.duration` has a valid value
- Check browser console for initialization errors

### Time Not Persisting
- Ensure localStorage is enabled in browser
- Check for localStorage quota limits
- Verify localStorage key: `creative-discovery-meeting-timer`

### Phase Navigation Not Working
- Verify progressive navigation rules are being respected
- Check that phase names match exactly in the configuration
- Look for toast messages indicating why navigation was blocked

### Pacing Colors Not Updating
- Verify timer is running (not paused)
- Check that elapsed time is being calculated correctly
- Ensure phase index is valid and currentPhase is set

## Code Quality Notes

- **TypeScript**: Full type safety throughout
- **React Best Practices**: Proper use of hooks, memoization, and context
- **Performance**: Optimized renders with useMemo and useCallback
- **Error Handling**: Graceful degradation if localStorage fails
- **Testing Ready**: Components are structured for easy unit testing
- **Documentation**: Comprehensive inline comments
- **Accessibility**: WCAG 2.1 AA compliant
