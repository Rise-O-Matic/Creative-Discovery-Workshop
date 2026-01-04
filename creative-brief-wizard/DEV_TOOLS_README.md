# Creative Brief Wizard - Developer Tools

This document describes the developer tools available for testing and debugging the Creative Brief Wizard application.

## Overview

The DevTools component provides a quick way to populate the entire Creative Brief Wizard with realistic mock data, making it easy to test different phases of the application without manually filling out all forms.

## Features

- **Keyboard Shortcut**: Press `Ctrl+Shift+F` (Windows/Linux) or `Cmd+Shift+F` (Mac) to open the mock data fill dialog
- **Floating Button**: Visual UI button in the bottom-right corner for manual triggering
- **Two Fill Modes**:
  - **Fill All Phases**: Populates all sections with complete mock data
  - **Fill Current Phase Only**: Only fills data for the current phase (preserves existing data)
- **Visual Feedback**: Toast notifications confirm successful data population
- **Development Only**: Only visible when running in development mode (`npm run dev`)

## Mock Data Theme: EcoBottle Launch Campaign

All mock data is coherent and realistic, centered around a fictional product launch:

**Project**: EcoBottle - Sustainable Water Bottle Launch
**Concept**: Premium water bottles made from 100% ocean-recovered plastic
**Target Audience**: Environmentally conscious millennials and Gen Z (ages 25-40)
**Budget**: $250,000
**Timeline**: 8-week campaign from brief to launch

## What Gets Filled

### 1. Project Context
- Project name, description, stakeholders
- Constraints, timeline, and workshop duration
- Marked as completed

### 2. Customer Discovery
All four discovery questions with detailed, realistic answers:
- **Who is this for?** - Target audience demographics and psychographics
- **What is being offered?** - Product details and unique value proposition
- **Why now?** - Timing, urgency, and market context
- **What is success?** - Quantitative and qualitative success metrics

### 3. Sticky Notes (Diverge Phase)
- 20 sticky notes with brainstorming content
- Positioned across the canvas
- Ready for clustering

### 4. Clusters (Converge Phase)
- 4 themed clusters with AI-generated summaries:
  - Environmental Impact & Purpose
  - Authenticity & Transparency
  - Product Performance & Quality
  - Emotional Connection & Community
- Notes automatically assigned to clusters

### 5. Spot Exercises
- **One Sentence Three Lenses**: Emotional impact, organizational goals, brand values
- **Viewers in Mirror**: Context, emotions, and watch-stopping moments
- **Story Without Pictures**: Complete 5-beat narrative structure
- **Promises & Proofs**: 5 claim-proof pairs with visual concepts
- **Constraints**: 5 constraints with style implications
- **Failures to Avoid**: 5 potential creative pitfalls

### 6. Prioritization
- **Must Have (Will)**: 6 priority requirements
- **Nice to Have (Could)**: 5 secondary requirements
- **Out of Scope (Won't)**: 4 deprioritized items
- All cards include source attribution to earlier exercises

## Usage

### Method 1: Keyboard Shortcut
1. Run the app in development mode: `npm run dev`
2. Press `Ctrl+Shift+F` (or `Cmd+Shift+F` on Mac)
3. Choose fill mode in the confirmation dialog
4. Click "Fill Mock Data"

### Method 2: Floating Button
1. Run the app in development mode: `npm run dev`
2. Look for the purple/pink gradient floating button in the bottom-right corner with a "DEV" badge
3. Click the button
4. Choose fill mode in the confirmation dialog
5. Click "Fill Mock Data"

### Hiding/Showing the Button
- To hide the floating button: Click the small "X" in the top-left corner of the button
- To show it again: Click the small code icon button that appears in its place

## Important Notes

### Data Overwriting
- **Fill All Phases** mode will **overwrite all existing session data**
- Make sure to export or save any important work before filling mock data
- The warning dialog reminds you of this before proceeding

### Development Mode Only
- DevTools are **only available in development mode** (`npm run dev`)
- They will **not appear in production builds** (`npm run build`)
- This is controlled by `import.meta.env.DEV` check in `App.tsx`

### Session Persistence
- Mock data is saved to localStorage like all other session data
- Refreshing the page will preserve the mock data
- Use the app's reset functionality to clear mock data if needed

## Testing Workflows

### Quick Full Walkthrough
1. Fill all phases with mock data
2. Navigate through each phase using the timeline
3. Verify all data displays correctly
4. Test export/download functionality with populated data

### Testing Individual Phases
1. Navigate to the phase you want to test
2. Use "Fill Current Phase Only" mode
3. Test phase-specific functionality with realistic data

### Testing Edge Cases
1. Fill mock data
2. Manually modify specific fields to test edge cases
3. Verify validation, error handling, and UI behavior

## Implementation Files

- **Mock Data Generator**: `creative-brief-wizard/src/utils/devTools.ts`
- **DevTools Component**: `creative-brief-wizard/src/components/DevTools.tsx`
- **Integration**: `creative-brief-wizard/src/App.tsx` (conditional render)

## Customizing Mock Data

To customize the mock data for different testing scenarios:

1. Edit `creative-brief-wizard/src/utils/devTools.ts`
2. Modify the exported mock data constants:
   - `mockProjectContext`
   - `mockCustomerDiscovery`
   - `mockStickyNotes`
   - `mockOneSentenceThreeLenses`
   - `mockViewersInMirror`
   - `mockStoryWithoutPictures`
   - `mockPromisesAndProofs`
   - `mockConstraints`
   - `mockFailures`
   - `mockRequirementCards`
3. Restart the dev server to see changes

## Troubleshooting

### DevTools Not Showing
- Verify you're running in development mode (`npm run dev`, not `npm run build`)
- Check browser console for errors
- Verify `import.meta.env.DEV` is `true` in console

### Keyboard Shortcut Not Working
- Make sure no browser extension is capturing the same shortcut
- Try clicking the floating button instead
- Check browser console for JavaScript errors

### Data Not Filling
- Check browser console for errors
- Verify the session context is properly initialized
- Try refreshing the page and attempting again

### Missing or Incorrect Data
- Verify all mock data constants are properly defined in `devTools.ts`
- Check that the `fillMockData()` function is correctly mapping data
- Review console for any validation errors from the session context

## Future Enhancements

Potential improvements to DevTools:

- Multiple preset scenarios (different industries/products)
- Partial fill options (specific sections only)
- Data randomization for variation
- Export/import custom mock data presets
- Clear specific phases without resetting everything
- Toggle between different "quality" levels of mock data
