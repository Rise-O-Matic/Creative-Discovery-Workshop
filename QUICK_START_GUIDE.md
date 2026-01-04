# Enhanced GlobalTimeline - Quick Start Guide

## Getting Started

### 1. Start the Development Server

```bash
cd c:\Users\maxam\Projects\CreativeDiscovery\creative-brief-wizard
npm run dev
```

The application will open at `http://localhost:5173`

### 2. Initial Setup

When you first load the app:

1. **Welcome Page** appears
2. Fill in project details (name, description, etc.)
3. Set workshop duration (default: 60 minutes)
4. Click "Start Workshop"

The meeting timer starts automatically when you proceed to the first phase.

### 3. Using the Timeline

#### Understanding the Visual Elements

```
┌──────────────────────────────────────────────────┐
│ Meeting Time: 15:30 / 60:00     [⏸] [Reset]    │
├──────────────────────────────────────────────────┤
│  [✓]  [✓]  [◉]  [ ]  [ ]  [ ]  [ ]  [ ]        │ ← Phase Markers
│   W    D   Dv   C   SE   P    R    B           │
├──────────────────────────────────────────────────┤
│ ▓▓▓▓▓▓▓▓░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   │ ← Red: Time elapsed
│      ◉                                           │ ← Blue: Current phase
└──────────────────────────────────────────────────┘
```

**Phase Marker States:**
- ✓ **Green with checkmark**: Completed phase (clickable)
- ◉ **White pulsing**: Current phase (you are here)
- [ ] **Semi-transparent**: Next phase (clickable)
- 🔒 **Gray with lock**: Locked phase (not clickable yet)

**Timeline Bars:**
- **Red Fill Bar**: Shows how much time has elapsed
- **Blue Thumb**: Shows which phase you're currently on

### 4. Navigation

#### Valid Navigation Patterns

✅ **You CAN:**
- Go back to any completed phase (green markers)
- Stay on current phase
- Move forward to the next phase

❌ **You CANNOT:**
- Skip multiple phases ahead
- Jump to locked phases

#### How to Navigate

1. **Click a phase marker** to navigate
2. If navigation is allowed, the page changes immediately
3. If blocked, you'll see a warning toast message

Example navigation flow:
```
Project Context → Discovery → Diverge
                  ↑           ↓
                  ← Can go back
                              → Can go forward
                              ✗ Cannot skip to Review
```

### 5. Timer Controls

#### Pause Button
- **Icon**: ⏸ (pause symbol)
- **Action**: Stops time counting
- **Result**: Shows "PAUSED" badge
- **Use case**: Taking a break, discussion, etc.

#### Resume Button (appears when paused)
- **Icon**: ▶ (play symbol)
- **Action**: Resumes time counting
- **Result**: Removes "PAUSED" badge
- **Note**: Paused time is excluded from elapsed time

#### Reset Button
- **Action**: Resets all timer data
- **Confirmation**: Shows confirm dialog first
- **Result**: Timer starts over from 00:00
- **Warning**: This clears all phase time tracking

### 6. Phase Information

#### Hover Over Phase Markers

Tooltip shows:
- **Phase name** (e.g., "Discovery")
- **Expected duration** (e.g., "15m expected")
- **Actual time** if completed (e.g., "completed in 18m")

Example tooltips:
```
┌──────────────────────┐
│ Discovery            │
│ 15m expected         │
└──────────────────────┘

┌──────────────────────┐
│ Welcome              │
│ completed in 7m      │
└──────────────────────┘
```

### 7. Pacing Indicators

The timeline background color shows your pacing:

**🟢 Green Background**: On Track
- You're at or ahead of schedule
- Elapsed time < 110% of expected

**🟡 Yellow Background**: Running Behind
- You're slightly behind schedule
- Elapsed time 110-130% of expected

**🔴 Red Background**: Significantly Over
- You're significantly behind schedule
- Elapsed time > 130% of expected

### 8. Data Persistence

#### Automatic Saving

Your progress is automatically saved:
- **Timer state**: Every 10 seconds
- **Session state**: On every change
- **Storage**: Browser localStorage

#### After Browser Refresh

When you reload the page:
- ✅ Current phase is restored
- ✅ Completed phases remembered
- ✅ Timer continues from where it was
- ✅ All form data preserved

#### Clear All Data

To start fresh:
1. Click "Reset" button (clears timer only)
2. Or use browser DevTools → Application → Clear Storage

### 9. Keyboard Shortcuts

#### Phase Markers
- **Tab**: Navigate between phase markers
- **Enter/Space**: Click selected marker
- **Shift+Tab**: Navigate backward

#### Accessibility
- Screen readers announce phase changes
- Live regions update with time remaining
- All interactive elements are keyboard accessible

### 10. Common Workflows

#### Normal Workshop Flow

```
1. Start at Welcome
   ↓
2. Fill in project details
   ↓
3. Timer starts automatically
   ↓
4. Progress through phases sequentially
   ↓
5. Click "Next" or phase markers to advance
   ↓
6. Complete all phases
   ↓
7. Generate creative brief
```

#### Review Previous Phase

```
1. Currently on "Exercises"
   ↓
2. Click "Discovery" marker (completed phase)
   ↓
3. Page changes to Discovery
   ↓
4. Review your answers
   ↓
5. Click "Exercises" marker to return
   ↓
6. Continue where you left off
```

#### Taking a Break

```
1. Click Pause button
   ↓
2. "PAUSED" badge appears
   ↓
3. Time stops counting
   ↓
4. Take your break
   ↓
5. Click Resume button
   ↓
6. Time continues (break time excluded)
```

## Troubleshooting

### Timer Not Starting

**Problem**: Timer shows 00:00 and doesn't move

**Solutions**:
1. Ensure you're past the Welcome page
2. Check browser console for errors
3. Try refreshing the page
4. Clear localStorage and start fresh

### Can't Navigate to Phase

**Problem**: Clicking phase marker doesn't work

**Reasons**:
1. Phase is locked (gray with lock icon)
   - Solution: Complete current phase first
2. Phase is more than one ahead
   - Solution: Progress sequentially
3. You're already on that phase
   - Solution: No action needed

### Timer Shows Wrong Time

**Problem**: Elapsed time doesn't match actual time

**Causes**:
1. Computer went to sleep
   - Solution: Reset timer and restart
2. Browser tab was inactive
   - Solution: Timer continues in background (expected)
3. localStorage corrupted
   - Solution: Clear storage and restart

### Colors Not Changing

**Problem**: Background stays green even when behind

**Check**:
1. Timer is running (not paused)
2. You're past first phase
3. Sufficient time has elapsed
4. Browser supports CSS color transitions

### Data Not Persisting

**Problem**: Progress lost on refresh

**Solutions**:
1. Check localStorage is enabled
2. Not in private/incognito mode
3. Browser storage quota not exceeded
4. Check browser console for errors

## Tips & Best Practices

### For Facilitators

1. **Before Workshop**:
   - Test the timer functionality
   - Set correct workshop duration
   - Familiarize with navigation

2. **During Workshop**:
   - Use pause for discussions
   - Monitor pacing colors
   - Don't skip phases
   - Save frequently (automatic)

3. **After Workshop**:
   - Review phase times
   - Export creative brief
   - Note any time overruns

### For Participants

1. **Time Management**:
   - Watch the elapsed time display
   - Note pacing color changes
   - Use phase markers for context

2. **Navigation**:
   - Feel free to review previous phases
   - Can't skip ahead (by design)
   - Hover for time estimates

3. **Saving Work**:
   - Auto-saves every 10 seconds
   - Safe to refresh browser
   - Don't clear localStorage mid-session

## Phase Duration Reference

Default durations for 60-minute workshop:

| Phase | Label | Duration | Purpose |
|-------|-------|----------|---------|
| Welcome | W | 5 min | Project setup |
| Discovery | D | 15 min | Customer research |
| Diverge | Dv | 10 min | Idea generation |
| Converge | C | 10 min | Idea clustering |
| Exercises | SE | 10 min | SPOT exercises |
| Prioritize | P | 5 min | Requirements ranking |
| Review | R | 3 min | Synthesis review |
| Complete | B | 2 min | Brief generation |

**Total**: 60 minutes

**Note**: Durations scale proportionally for different workshop lengths.

## Testing Your Implementation

### Quick Test Checklist

1. ✅ Timer starts when entering first phase
2. ✅ Elapsed time updates every second
3. ✅ Pause button stops timer
4. ✅ Resume button continues timer
5. ✅ Reset button clears timer (with confirm)
6. ✅ Red bar grows as time elapses
7. ✅ Blue thumb moves with phase changes
8. ✅ Can navigate backward to completed phases
9. ✅ Can navigate forward one phase
10. ✅ Cannot skip multiple phases
11. ✅ Tooltips show on hover
12. ✅ Pacing colors change appropriately
13. ✅ Data persists across refresh
14. ✅ Keyboard navigation works

### Manual Testing Steps

**Test 1: Timer Functionality**
```
1. Start workshop
2. Verify timer starts at 00:00
3. Wait 5 seconds
4. Verify timer shows 00:05
5. Click Pause
6. Verify timer stops
7. Wait 5 seconds
8. Verify timer still shows 00:05
9. Click Resume
10. Verify timer continues from 00:05
```

**Test 2: Phase Navigation**
```
1. Start at Welcome (phase 0)
2. Try clicking Review (phase 6)
3. Verify warning toast appears
4. Click Discovery (phase 1)
5. Verify navigation succeeds
6. Click Welcome (phase 0)
7. Verify backward navigation works
8. Click Diverge (phase 2)
9. Verify forward navigation works
```

**Test 3: Persistence**
```
1. Start workshop
2. Navigate to Discovery
3. Wait for 30 seconds
4. Note current time
5. Refresh browser
6. Verify phase is Discovery
7. Verify timer continued from last value
8. Verify all data intact
```

**Test 4: Pacing Colors**
```
1. Start 60-minute workshop
2. Verify background is green
3. Use DevTools to simulate 30 min elapsed at phase 1
4. Verify background turns yellow
5. Simulate 40 min elapsed at phase 1
6. Verify background turns red
```

## Next Steps

After familiarizing yourself with the timeline:

1. **Explore Phase Components**
   - See how each phase uses the timer
   - Understand phase-specific functionality

2. **Review Documentation**
   - `GLOBAL_TIMELINE_IMPLEMENTATION.md`: Technical details
   - `CODE_SNIPPETS.md`: Usage examples
   - `ARCHITECTURE_DIAGRAM.md`: System design

3. **Customize**
   - Adjust phase durations
   - Modify pacing thresholds
   - Customize colors and styling

4. **Extend**
   - Add custom warnings
   - Implement analytics
   - Create export features

## Support

For issues or questions:

1. Check troubleshooting section above
2. Review detailed documentation
3. Check browser console for errors
4. Verify all files are properly imported

## Summary

The Enhanced GlobalTimeline provides:
- ✅ Real-time meeting timer
- ✅ Visual progress tracking
- ✅ Progressive phase navigation
- ✅ Automatic data persistence
- ✅ Pacing indicators
- ✅ Pause/resume functionality
- ✅ Accessible interface
- ✅ Responsive design

Enjoy your creative discovery workshop!
