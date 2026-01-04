# Conversion Plan: Current → Proposed User Journey

**Document Version:** 1.0
**Last Updated:** January 4, 2026
**Purpose:** Roadmap for converting Creative Brief Wizard to Creative Discovery Workshop with improved UX

---

## Executive Summary

This plan outlines the conversion from the current Creative Brief Wizard implementation to the proposed Creative Discovery Workshop experience. The conversion focuses on:

1. **Branding Update** - Rename from "Creative Brief Wizard" to "Creative Discovery Workshop"
2. **Global Timeline System** - Replace individual timers with unified timeline bar
3. **Duration Management** - Add workshop duration field and time tracking
4. **AI Synthesis Removal** - Remove AI synthesis from Customer Discovery phase
5. **Toast Notifications** - Add time-based warnings and notifications
6. **UI/UX Refinements** - Various copy and interaction improvements

---

## Key Changes Overview

### 1. Branding Changes
**Current:** Creative Brief Wizard
**Proposed:** Creative Discovery Workshop

**Impact Areas:**
- Welcome page hero section
- Page titles and meta tags
- All user-facing copy
- Documentation references

**Agent:** `branding-updater`

---

### 2. Duration Field Addition
**Current:** No duration tracking, fixed 30-40 minute estimate
**Proposed:** User-defined workshop duration on welcome page

**Changes Required:**
- Add "Workshop Duration" input field to WelcomePage
- Update SessionContext to store duration value
- Update validation logic to include duration
- Calculate estimated completion time based on duration
- Display time estimates throughout app

**Agent:** `welcome-page-duration`

---

### 3. Global Timeline System
**Current:** Individual countdown timers on each phase
**Proposed:** Global timeline bar with graduations for all steps

**Changes Required:**
- Create GlobalTimeline component
- Add timeline graduations/markers for each phase
- Show current phase position on timeline
- Display overall time remaining
- Add phase-specific time allocations
- Replace individual Timer components with timeline integration

**Agent:** `timeline-ui-builder`

**Key Features:**
- Timeline bar spanning top of application
- Graduation markers at phase boundaries
- Current position indicator
- Time remaining display (MM:SS format)
- Visual warnings (orange <1 min, red when expired)

---

### 4. Customer Discovery AI Synthesis Removal
**Current:** Phase 2 includes "Review & Synthesize" section with AI insights
**Proposed:** Direct transition from Question 4 to Phase 3

**Changes Required:**
- Remove "Review & Synthesize" section from CustomerDiscoveryPage
- Remove AI synthesis button and logic from discovery phase
- Update CustomerDiscovery types to remove aiSynthesis field
- Update phase transition logic (Q4 → directly to Sticky Notes Diverge)
- Update Question 2 copy: Change "Is this something tangible..." to "Are we focusing on the tangibles..."

**Agent:** `discovery-refactor`

**Files to Modify:**
- `src/features/discovery/CustomerDiscoveryPage.tsx`
- `src/types/index.ts` (CustomerDiscovery interface)
- `src/contexts/SessionContext.tsx` (remove synthesis state)

---

### 5. Toast Notification System
**Current:** Static timer warnings
**Proposed:** Toast popups for time-based warnings

**Changes Required:**
- Create Toast/Notification component
- Add toast notification system to app root
- Implement toast triggers:
  - "<1 minute remaining" warning (orange toast)
  - "Time's up!" notification (red toast)
- Position toasts appropriately (top-right recommended)
- Auto-dismiss after 3-5 seconds

**Agent:** `timeline-ui-builder` (handles toast system)

---

### 6. Question 2 Copy Update
**Current:** "Is this something tangible they can buy, or something intangible like awareness, attitude shift, or action?"

**Proposed:** "Are we focusing on the tangibles they can see and touch, or something intangible like awareness, attitude shift, or action?"

**Agent:** `discovery-refactor`

---

### 7. UI/UX Refinements

#### Phase 2: Customer Discovery
**Current:**
- Large 3-minute timer at top
- Individual timer per question

**Proposed:**
- Timeline bar showing time remaining
- Graduations spaced according to recommended time for each step
- Toast popup warnings instead of inline timer warnings

#### Welcome Page
**Current:**
- Three feature cards
- Five-step process overview
- No duration field

**Proposed:**
- Same feature cards (updated branding)
- Same process overview
- **New:** Workshop Duration field (required)

---

## Implementation Sequence

### Phase 1: Branding Update ✅ (Agent: branding-updater)
**Priority:** High
**Estimated Time:** 30 minutes
**Dependencies:** None

**Tasks:**
1. Update all instances of "Creative Brief Wizard" → "Creative Discovery Workshop"
2. Update page titles and meta tags
3. Update welcome page hero section
4. Update any documentation references
5. Verify all user-facing copy updated

**Files Affected:**
- `index.html` - Page title
- `src/features/welcome/WelcomePage.tsx` - Hero section
- `README.md` - Documentation
- Any other files with branding references

**Verification:**
- [ ] Search codebase for "Creative Brief Wizard" returns zero results
- [ ] Welcome page displays "Creative Discovery Workshop"
- [ ] Browser tab shows updated name

---

### Phase 2: Duration Field Addition (Agent: welcome-page-duration)
**Priority:** High
**Estimated Time:** 1 hour
**Dependencies:** Phase 1 complete

**Tasks:**
1. Add duration field to WelcomePage form
2. Update SessionContext types to include duration
3. Update projectContext.duration in SessionState
4. Add validation for duration field (required, numeric, min/max)
5. Store duration value in localStorage
6. Calculate estimated completion time based on duration
7. Display time estimates in welcome page

**Files Affected:**
- `src/features/welcome/WelcomePage.tsx`
- `src/types/index.ts` - ProjectContext interface
- `src/contexts/SessionContext.tsx`

**New Fields:**
```typescript
interface ProjectContext {
  // ... existing fields
  duration?: number; // Workshop duration in minutes
}
```

**Verification:**
- [ ] Duration field visible on welcome page
- [ ] Validation enforces required duration
- [ ] Duration saves to SessionContext
- [ ] Duration persists in localStorage

---

### Phase 3: Customer Discovery Refactor (Agent: discovery-refactor)
**Priority:** High
**Estimated Time:** 1.5 hours
**Dependencies:** Phase 2 complete

**Tasks:**
1. Remove "Review & Synthesize" section from CustomerDiscoveryPage
2. Remove AI synthesis button and generation logic
3. Update CustomerDiscovery interface to remove aiSynthesis field
4. Update phase transition: Question 4 → Sticky Notes Diverge (skip synthesis)
5. Update Question 2 sub-prompt #6 copy
6. Remove synthesis-related state management from SessionContext
7. Update any navigation logic that referenced synthesis step

**Files Affected:**
- `src/features/discovery/CustomerDiscoveryPage.tsx`
- `src/types/index.ts`
- `src/contexts/SessionContext.tsx`
- `src/App.tsx` (phase navigation logic)

**Type Changes:**
```typescript
// REMOVE aiSynthesis field:
interface CustomerDiscovery {
  question1: string;
  question2: string;
  question3: string;
  question4: string;
  completed: boolean;
  // aiSynthesis?: string; // REMOVE THIS
}
```

**Copy Update (Question 2, Sub-prompt #6):**
```
OLD: "Is this something tangible they can buy, or something intangible like awareness, attitude shift, or action?"

NEW: "Are we focusing on the tangibles they can see and touch, or something intangible like awareness, attitude shift, or action?"
```

**Verification:**
- [ ] No synthesis section appears after Question 4
- [ ] Answering Q4 transitions directly to Phase 3
- [ ] Question 2 copy updated correctly
- [ ] No TypeScript errors related to aiSynthesis
- [ ] SessionContext compiles without aiSynthesis references

---

### Phase 4: Global Timeline & Toast System (Agent: timeline-ui-builder)
**Priority:** High
**Estimated Time:** 3 hours
**Dependencies:** Phase 3 complete

**Tasks:**

#### 4A: Toast Notification System
1. Create Toast component (`src/components/Toast.tsx`)
2. Create ToastProvider context for managing toasts
3. Add toast notification triggers:
   - Warning toast at <1 minute remaining
   - Expired toast at 0 seconds
4. Style toasts (orange warning, red expired)
5. Auto-dismiss after 3-5 seconds
6. Position toasts (top-right corner)

#### 4B: Global Timeline Component
1. Create GlobalTimeline component (`src/components/GlobalTimeline.tsx`)
2. Calculate phase time allocations from workshop duration
3. Add graduation markers for each phase boundary
4. Show current phase indicator
5. Display overall time remaining (MM:SS format)
6. Visual states: normal (blue), warning (orange), expired (red)
7. Integrate with SessionContext for time tracking

#### 4C: Integration
1. Replace individual Timer components with GlobalTimeline
2. Remove Timer component from CustomerDiscoveryPage
3. Remove Timer component from DivergePage
4. Remove Timer component from ConvergePage
5. Add GlobalTimeline to App.tsx layout (top of screen)
6. Update phase transitions to use global time

**Files Created:**
- `src/components/Toast.tsx`
- `src/components/GlobalTimeline.tsx`
- `src/contexts/ToastContext.tsx`

**Files Modified:**
- `src/App.tsx` - Add GlobalTimeline to layout
- `src/features/discovery/CustomerDiscoveryPage.tsx` - Remove Timer
- `src/features/diverge/DivergePage.tsx` - Remove Timer
- `src/features/converge/ConvergePage.tsx` - Remove Timer
- `src/contexts/SessionContext.tsx` - Add global time tracking

**Timeline Graduations:**
Based on proposed journey, graduations should mark:
- Welcome (start)
- Discovery Q1 (3 min)
- Discovery Q2 (3 min)
- Discovery Q3 (2 min)
- Discovery Q4 (3 min)
- Diverge (5 min)
- Converge Clustering (7 min)
- Converge Naming (3 min)
- Spot Exercises A-F (varying times)
- Prioritization
- Review
- Complete

**Verification:**
- [ ] GlobalTimeline visible at top of all pages
- [ ] Graduation markers display correctly
- [ ] Current phase highlighted on timeline
- [ ] Toast appears at <1 min warning
- [ ] Toast appears at time expired
- [ ] Toasts auto-dismiss after delay
- [ ] Individual timers removed from all phases
- [ ] Time tracking works across phase transitions

---

## Testing & Validation Plan

### Manual Testing Checklist

#### Branding
- [ ] Welcome page shows "Creative Discovery Workshop"
- [ ] Browser tab title updated
- [ ] No references to old branding in UI

#### Duration Field
- [ ] Duration field appears on welcome page
- [ ] Validation requires duration to proceed
- [ ] Duration persists after page refresh
- [ ] Estimated time displays correctly

#### Customer Discovery
- [ ] Question 2 copy updated correctly
- [ ] No synthesis section after Q4
- [ ] Q4 transitions directly to Diverge phase
- [ ] All 4 questions save correctly

#### Global Timeline
- [ ] Timeline bar visible on all pages
- [ ] Graduations positioned correctly
- [ ] Current phase indicator moves as user progresses
- [ ] Time countdown works correctly
- [ ] Timeline turns orange at <1 min
- [ ] Timeline turns red when expired

#### Toast Notifications
- [ ] Toast appears at <1 min warning
- [ ] Toast appears at time expiration
- [ ] Toasts positioned correctly (top-right)
- [ ] Toasts auto-dismiss
- [ ] Multiple toasts stack properly

#### Integration
- [ ] Auto-save still works throughout
- [ ] Phase transitions work correctly
- [ ] localStorage persistence intact
- [ ] No TypeScript errors
- [ ] No console errors
- [ ] Production build succeeds

---

## Rollback Plan

If issues arise during conversion:

1. **Git Workflow:**
   - Create conversion branch: `git checkout -b feature/proposed-ux-conversion`
   - Commit after each phase completion
   - Tag stable points: `git tag -a v2.0-phase1 -m "Branding complete"`

2. **Rollback Points:**
   - After Phase 1: Can rollback branding if needed
   - After Phase 2: Can rollback duration field
   - After Phase 3: Can revert discovery changes
   - After Phase 4: Can restore individual timers

3. **Backup Strategy:**
   - Keep current implementation on `master` branch
   - Test conversion on feature branch
   - Only merge to master after full validation

---

## Agent Execution Order

### Recommended Sequence:

1. **branding-updater** (30 min)
   - Update all "Creative Brief Wizard" → "Creative Discovery Workshop"
   - Verify no references remain

2. **welcome-page-duration** (1 hour)
   - Add duration field to welcome page
   - Update SessionContext for duration storage
   - Implement validation and time estimation

3. **discovery-refactor** (1.5 hours)
   - Remove AI synthesis from Customer Discovery
   - Update Question 2 copy
   - Fix phase transitions

4. **timeline-ui-builder** (3 hours)
   - Build toast notification system
   - Create GlobalTimeline component
   - Integrate timeline across all phases
   - Remove individual timer components

**Total Estimated Time:** 6 hours

---

## Post-Conversion Tasks

After all agents complete:

1. **Documentation Updates:**
   - Update AGENT_HANDOFF.md with conversion results
   - Update README.md with new branding and features
   - Archive USER_JOURNEY_CURRENT.md
   - Rename USER_JOURNEY_PROPOSED.md → USER_JOURNEY_CURRENT.md

2. **Code Cleanup:**
   - Remove unused Timer components (if fully replaced)
   - Remove unused synthesis-related code
   - Clean up commented-out code
   - Run linter and fix any issues

3. **Final Testing:**
   - Complete full user journey test
   - Test on multiple browsers
   - Test on mobile/tablet
   - Verify localStorage persistence
   - Test error handling

4. **Deployment:**
   - Build production bundle: `npm run build`
   - Deploy to Vercel
   - Verify production deployment works
   - Update documentation with deployment URL

---

## Success Criteria

### Functional Requirements
- ✅ All branding updated to "Creative Discovery Workshop"
- ✅ Duration field added and functional
- ✅ AI synthesis removed from Customer Discovery
- ✅ GlobalTimeline component working
- ✅ Toast notifications appearing correctly
- ✅ All phases transition correctly
- ✅ Auto-save working throughout
- ✅ DOCX generation still works

### Technical Requirements
- ✅ No TypeScript errors
- ✅ No console errors or warnings
- ✅ Production build succeeds
- ✅ All tests pass (if applicable)
- ✅ Linter passes
- ✅ Code formatted with Prettier

### User Experience
- ✅ User journey flows smoothly
- ✅ Timeline provides clear time awareness
- ✅ Toasts are helpful, not annoying
- ✅ Mobile responsive
- ✅ Keyboard accessible
- ✅ No regressions from current version

---

## Risk Assessment

### Low Risk
- Branding updates (simple find/replace)
- Question 2 copy update (single line change)

### Medium Risk
- Duration field addition (new required field, validation)
- Discovery refactor (removing synthesis, phase transitions)

### High Risk
- Global timeline implementation (complex component, timing logic)
- Toast notification system (new context, state management)
- Removing individual timers (potential for breaking changes)

### Mitigation Strategies
- Use feature branch for all changes
- Commit frequently with descriptive messages
- Test each phase thoroughly before proceeding
- Keep backup of working state
- Use specialized agents for complex tasks

---

## Notes for Agents

### For branding-updater:
- Search for all instances of "Creative Brief Wizard"
- Update index.html page title
- Update WelcomePage hero section
- Check README and documentation files
- Be careful with code comments vs. user-facing text

### For welcome-page-duration:
- Add duration field AFTER timeline field
- Make duration required for validation
- Store as number (minutes)
- Calculate estimated completion time from duration
- Display estimate below duration field

### For discovery-refactor:
- Remove entire "Review & Synthesize" section component
- Update phase navigation after Q4 completion
- Clean up CustomerDiscovery interface
- Update Question 2 sub-prompt #6 carefully
- Test phase transitions thoroughly

### For timeline-ui-builder:
- Build toast system BEFORE timeline component
- Timeline should span full width of app
- Graduations must align with phase time allocations
- Use workshop duration from SessionContext
- Toast positioning: fixed top-right, z-index high
- Timeline should update in real-time (not just on phase change)

---

## Appendix: Key File Locations

### Files to Modify:
```
src/
├── features/
│   ├── welcome/WelcomePage.tsx          # Phase 1, 2
│   └── discovery/CustomerDiscoveryPage.tsx  # Phase 3, 4
├── components/
│   ├── Timer.tsx                        # Phase 4 (potentially remove)
│   ├── Toast.tsx                        # Phase 4 (create)
│   └── GlobalTimeline.tsx               # Phase 4 (create)
├── contexts/
│   ├── SessionContext.tsx               # Phase 2, 3, 4
│   └── ToastContext.tsx                 # Phase 4 (create)
├── types/
│   └── index.ts                         # Phase 2, 3, 4
└── App.tsx                              # Phase 3, 4

Root:
├── index.html                           # Phase 1
├── README.md                            # Phase 1
└── AGENT_HANDOFF.md                     # Post-conversion
```

---

**End of Conversion Plan**

**Next Action:** Execute agents in sequence: branding-updater → welcome-page-duration → discovery-refactor → timeline-ui-builder
