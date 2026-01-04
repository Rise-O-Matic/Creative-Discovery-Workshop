# Creative Brief Wizard - Buildout Plan

## Project Overview
A browser-based wizard that guides non-agency users through a structured creative discovery process to generate professional creative briefs in DOCX format.

## Architecture Overview

### Core Technology Stack
- **Frontend Framework**: React with TypeScript
- **State Management**: React Context + useReducer (session state)
- **Styling**: Tailwind CSS (rapid UI development, responsive)
- **Drag & Drop**: react-dnd or @dnd-kit/core (modern, accessible)
- **DOCX Generation**: docx library (client-side)
- **LLM Integration**: Abstracted provider interface (OpenAI/Anthropic)
- **Storage**: localStorage for session persistence
- **Build Tool**: Vite (fast, modern)

---

## Subagent Deployment Strategy

### Phase 1: Foundation & Infrastructure (Agents 1-3)

#### **Agent 1: Project Scaffolding & Configuration**
**Responsibility**: Initial project setup, build configuration, and base architecture

**Tasks**:
- Initialize Vite + React + TypeScript project
- Configure Tailwind CSS
- Set up ESLint + Prettier
- Create folder structure:
  ```
  src/
    components/      # Reusable UI components
    features/        # Feature-specific components
    contexts/        # State management
    hooks/           # Custom hooks
    services/        # LLM, DOCX generation
    types/           # TypeScript definitions
    utils/           # Helpers, validators
  ```
- Configure environment variables for LLM API keys
- Set up development and production builds
- Create base index.html and App.tsx

**Deliverables**:
- Runnable development environment
- Build scripts
- Configuration files
- Base folder structure

---

#### **Agent 2: State Management & Data Models**
**Responsibility**: Core data structures and state management system

**Tasks**:
- Define TypeScript interfaces for all data models:
  - Sticky note structure
  - Cluster structure
  - Session state
  - Exercise responses
  - Brief sections
- Create SessionContext with useReducer
- Implement actions/reducers for:
  - Note creation/editing/deletion
  - Cluster management
  - Exercise responses
  - Navigation state
- Build localStorage persistence layer:
  - Auto-save on state changes (debounced)
  - Session recovery on load
  - Export/import JSON functionality
- Create custom hooks:
  - `useSession()` - access session state
  - `useAutoSave()` - handle persistence
  - `useTimer()` - reusable timer logic

**Deliverables**:
- Complete TypeScript type definitions
- Working SessionContext
- Persistence layer with auto-save
- Core custom hooks

---

#### **Agent 3: LLM Service Abstraction**
**Responsibility**: Abstract LLM integration with provider flexibility

**Tasks**:
- Create LLM service interface:
  ```typescript
  interface LLMProvider {
    synthesizeDiscovery(): Promise<string>
    synthesizeClusters(): Promise<ClusterSummary[]>
    synthesizeExercises(): Promise<BriefSection[]>
  }
  ```
- Implement OpenAI provider adapter
- Implement Anthropic provider adapter
- Create prompt templates for:
  - Customer/product discovery synthesis
  - Sticky-note cluster analysis
  - Exercise synthesis
- Build error handling and retry logic
- Add streaming support (optional, for better UX)
- Create mock provider for development/testing

**Deliverables**:
- LLM service with provider abstraction
- OpenAI and Anthropic adapters
- Prompt templates
- Mock provider for development

---

### Phase 2: Core UI Components (Agents 4-5)

#### **Agent 4: Shared UI Component Library**
**Responsibility**: Reusable UI components used throughout the app

**Tasks**:
- Create base components:
  - `Timer` - countdown with warnings, hard stops
  - `Button` - primary, secondary, skip variants
  - `Input` / `Textarea` - form fields
  - `ProgressBar` - wizard progress indicator
  - `Card` - container component
  - `Modal` - for confirmations, AI synthesis review
- Build wizard navigation:
  - `WizardShell` - outer container
  - `StepHeader` - title, timer, progress
  - `StepFooter` - navigation buttons
- Create layout components:
  - `QuestionPrompt` - single-question display
  - `ExerciseContainer` - timed exercise wrapper
- Implement accessibility features:
  - Keyboard navigation
  - Focus management
  - ARIA labels
  - Skip links

**Deliverables**:
- 15+ reusable UI components
- Wizard navigation shell
- Accessibility-compliant components

---

#### **Agent 5: Sticky-Note Board System**
**Responsibility**: Interactive drag-and-drop sticky-note interface

**Tasks**:
- Build `StickyNote` component:
  - Inline editing
  - Draggable
  - Color variants (optional)
  - Auto-focus on creation
- Create `StickyBoard` canvas:
  - Large workspace (pan/zoom optional for MVP)
  - Drop zones for clustering
  - Visual grouping indicators
- Implement drag-and-drop:
  - Note creation and placement
  - Drag to reposition
  - Cluster formation via proximity
  - Overlap handling
- Build `Cluster` component:
  - Visual boundary (appears after naming)
  - Title input field
  - Contains multiple notes
  - AI summary display
- Create note management:
  - Add note (click or keyboard shortcut)
  - Delete note
  - Edit note text
  - Move between clusters
- Implement cluster management:
  - Auto-detect proximity groupings
  - Name clusters
  - View AI synthesis per cluster
  - Ungroup/regroup notes

**Deliverables**:
- Fully functional sticky-note board
- Drag-and-drop interaction
- Clustering system
- Note and cluster management

---

### Phase 3: Discovery Exercises (Agents 6-7)

#### **Agent 6: Customer & Product Discovery Flow**
**Responsibility**: Guided interview-style questionnaire

**Tasks**:
- Build question flow system:
  - One question at a time display
  - Progress through 4 core questions
  - Timer per question (3/3/2/3 minutes)
  - Skip option
- Create question components:
  - Question 1: "Who is this for?" (with sub-prompts)
  - Question 2: "What is being offered?"
  - Question 3: "Why does this matter now?"
  - Question 4: "What does success look like?"
- Implement response collection:
  - Text areas with character guidance
  - Auto-save responses
  - Edit previous answers
- Build synthesis step:
  - Send responses to LLM
  - Display AI-generated summary:
    - Clear project objectives
    - Implied audience needs
    - Risks or ambiguities
  - Editable summary before proceeding
- Add navigation:
  - Previous/Next buttons
  - Skip question option
  - Return to edit

**Deliverables**:
- 4-question guided discovery flow
- Response collection system
- LLM synthesis integration
- User review/edit interface

---

#### **Agent 7: Spot/Deliverable Exercise Suite**
**Responsibility**: Time-boxed creative exercises (A-G)

**Tasks**:
- Build exercise framework:
  - Modular exercise container
  - Individual timers per exercise
  - Exercise selection/sequencing
- Implement Exercise A - One Sentence, Three Lenses:
  - Three fill-in-the-blank prompts
  - No-edit rule enforcement
  - Overlap highlighting
- Implement Exercise B - Viewers in the Mirror:
  - Three contextual questions
  - Response capture
- Implement Exercise C - Story Without Pictures:
  - Five-beat structure
  - Required/Flexible tagging per beat
- Implement Exercise D - If It Failed:
  - Failure scenario collection
  - Inversion logic (convert to requirements)
- Implement Exercise E - Promise vs Proof:
  - Claim listing
  - Visual proof pairing
- Implement Exercise F - Constraints Are Fuel:
  - Constraint checklist
  - Style implication prompts
- Implement Exercise G - Creative Concept Generators (optional):
  - 5 mini-ideation prompts
  - Marked as post-requirements
- Build exercise synthesis:
  - Consolidate all exercise outputs
  - LLM synthesis into brief sections
  - User review/edit interface

**Deliverables**:
- 7 modular exercises (A-G)
- Exercise framework with timers
- Synthesis integration
- User review system

---

### Phase 4: Prioritization & Brief Generation (Agents 8-9)

#### **Agent 8: Will/Could/Won't Prioritization**
**Responsibility**: MoSCoW-style prioritization interface

**Tasks**:
- Create three-column layout:
  - WILL HAVE (non-negotiable)
  - COULD HAVE (nice-to-have)
  - WON'T HAVE (out of scope)
- Build requirement cards:
  - Import from cluster summaries
  - Create new cards manually
  - Display card content clearly
- Implement drag-and-drop:
  - Drag cards between columns
  - Reorder within columns
  - Visual feedback on drop
- Add card management:
  - Edit card text
  - Delete cards
  - Merge duplicate cards
- Create summary view:
  - Visual representation of priorities
  - Export to brief scope section

**Deliverables**:
- Three-column prioritization interface
- Draggable requirement cards
- Card management system
- Integration with brief generation

---

#### **Agent 9: DOCX Brief Generation**
**Responsibility**: Client-side creative brief document generation

**Tasks**:
- Install and configure `docx` library
- Create DOCX template structure:
  1. Project Overview
  2. Objectives
  3. Target Audience
  4. Key Message & Tone
  5. Requirements
  6. Deliverables
  7. Constraints & Risks
  8. Timeline
  9. Stakeholders
  10. Scope (Will/Could/Won't)
- Build data mapping:
  - Map session state to brief sections
  - Format clustered requirements
  - Include exercise insights
  - Add prioritization matrix
- Implement document styling:
  - Professional layout
  - Clear section headers
  - Bullet points and tables
  - 1-2 page target length
- Create generation flow:
  - Preview before download
  - Edit brief content in-app
  - Download as DOCX
  - "Generate New Version" option
- Add metadata:
  - Generated date
  - Version tracking (optional)
  - User-entered project name

**Deliverables**:
- DOCX generation service
- Template with 10 sections
- Preview interface
- Download functionality

---

### Phase 5: Wizard Flow & Integration (Agent 10)

#### **Agent 10: Wizard Orchestration & Routing**
**Responsibility**: Complete user flow from start to finish

**Tasks**:
- Define wizard step sequence:
  1. Welcome/Project Context
  2. Customer & Product Discovery
  3. Stakeholders & Constraints (basic form)
  4. Sticky-Note Board Exercise
  5. Spot/Deliverable Exercises (selectable)
  6. Will/Could/Won't Prioritization
  7. Synthesis Review
  8. Generate Brief
- Implement step routing:
  - Linear progression with back navigation
  - Skip step option
  - Jump to step (progress indicator)
- Create navigation state:
  - Current step tracking
  - Completed steps tracking
  - Validation before proceeding
- Build transition logic:
  - Save state on step change
  - Load state on step entry
  - Trigger AI synthesis at key points
- Add session management:
  - "Start New Brief" (with confirmation)
  - "Resume Session" (auto-detect)
  - "Export Session" JSON
  - "Import Session" JSON
- Create welcome screen:
  - App introduction
  - Estimated time
  - Solo vs. facilitated mode toggle
  - Begin button
- Build final review screen:
  - Summary of all inputs
  - AI synthesis review
  - Edit any section
  - Proceed to generation

**Deliverables**:
- Complete wizard flow (8 steps)
- Routing and navigation system
- Session management
- Welcome and review screens

---

### Phase 6: Polish & Deployment (Agent 11)

#### **Agent 11: Testing, Optimization & Deployment**
**Responsibility**: Quality assurance and production readiness

**Tasks**:
- Testing:
  - Manual testing of all flows
  - Edge case handling (empty inputs, skipped steps)
  - Timer accuracy and hard stops
  - Drag-and-drop across browsers
  - localStorage limits and fallbacks
  - DOCX generation validation
  - Responsive design testing (mobile/tablet/desktop)
- Performance optimization:
  - Code splitting by route
  - Lazy loading of heavy components
  - Debounce auto-save
  - Optimize re-renders
  - Compress assets
- Error handling:
  - LLM API failures (fallback messaging)
  - Network errors (retry logic)
  - Storage quota errors
  - Graceful degradation
- Accessibility audit:
  - Screen reader compatibility
  - Keyboard-only navigation
  - Color contrast
  - Focus indicators
- Production build:
  - Environment configuration
  - API key security (user-provided or proxy)
  - Build optimization
  - Deployment to hosting (Vercel/Netlify)
- Documentation:
  - README with setup instructions
  - User guide (optional)
  - Deployment guide
  - API key configuration guide

**Deliverables**:
- Tested, production-ready application
- Performance optimizations
- Error handling and fallbacks
- Deployment to hosting
- Documentation

---

## Development Workflow

### Sequential Agent Deployment
1. **Agents 1-3** (Foundation) → Must complete before Phase 2
2. **Agents 4-5** (UI Components) → Can run in parallel
3. **Agents 6-7** (Exercises) → Can run in parallel, depends on Agent 4
4. **Agents 8-9** (Prioritization & DOCX) → Can run in parallel, depends on Agent 4
5. **Agent 10** (Orchestration) → Depends on Agents 4-9
6. **Agent 11** (Polish) → Depends on all previous agents

### Integration Points
- **After Agent 2**: State management available to all feature agents
- **After Agent 3**: LLM service available to Agents 6, 7, 9
- **After Agent 4**: UI components available to Agents 5-10
- **After Agent 10**: Complete flow ready for testing (Agent 11)

---

## Key Technical Decisions

### Why React + TypeScript?
- Component modularity matches wizard step structure
- Type safety critical for complex state management
- Rich ecosystem for drag-and-drop and DOCX generation

### Why Client-Side LLM Calls?
- No backend required (per spec)
- User provides API key (or app uses proxy)
- Simpler deployment

### Why localStorage?
- No login requirement
- Session persistence across reloads
- Simple implementation

### Why Vite?
- Fastest dev experience
- Modern build tooling
- Excellent TypeScript support

---

## Risk Mitigation

### LLM API Failures
- Mock provider for development
- Clear error messaging
- Allow manual input if synthesis fails

### Browser Compatibility
- Test drag-and-drop in Safari, Chrome, Firefox
- Polyfills for older browsers (if needed)

### Storage Limits
- Monitor localStorage usage
- Compression for large sessions
- Export JSON as backup

### DOCX Complexity
- Keep template simple (1-2 pages)
- Test with Microsoft Word and Google Docs

---

## Success Metrics
- User can complete full flow in 30-40 minutes
- DOCX output is professional and editable
- App works on mobile, tablet, desktop
- No login or backend required
- Session persists across reloads

---

## Timeline Estimate (By Agent)
- **Agent 1**: Project setup → 2-3 hours
- **Agent 2**: State management → 4-5 hours
- **Agent 3**: LLM service → 3-4 hours
- **Agent 4**: UI components → 6-8 hours
- **Agent 5**: Sticky-note board → 8-10 hours (most complex)
- **Agent 6**: Customer discovery → 4-5 hours
- **Agent 7**: Spot exercises → 6-8 hours
- **Agent 8**: Prioritization → 3-4 hours
- **Agent 9**: DOCX generation → 4-5 hours
- **Agent 10**: Wizard orchestration → 5-6 hours
- **Agent 11**: Testing & deployment → 6-8 hours

**Total estimated effort**: 50-65 hours (distributed across 11 specialized agents)

---

## Next Steps
1. Review and approve this buildout plan
2. Initialize project with Agent 1
3. Deploy agents sequentially per phase
4. Integrate and test after each phase
5. Final polish and deployment

---

## Notes
- Each agent should be given the full spec + this plan
- Agents should coordinate through shared state (SessionContext)
- Code reviews happen at phase boundaries
- User testing after Agent 10 completion
