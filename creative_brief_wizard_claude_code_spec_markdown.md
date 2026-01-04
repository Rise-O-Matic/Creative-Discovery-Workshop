# Project Brief: Creative Brief Wizard Web App

## Purpose
Build a browser-based web application that guides non-agency users (educators, coordinators, students) through a structured creative discovery process and outputs a professional, agency-quality creative brief.

The tool must:
- Teach creative thinking implicitly (without jargon)
- Discover real creative requirements
- Work for **any media type** (print, digital, video, social, experiential)
- Be usable **solo or in facilitated meetings**
- Be time-boxed and efficient
- Produce a **downloadable DOCX** creative brief
- Live as a page on an existing website (no login required)

Primary user:
- Susan Aguilar-Martinez, Career Readiness Coordinator

Secondary users:
- Student volunteers
- Facilitators / teachers

---

## Core Concept
A **step-by-step wizard** that alternates between:
1. Structured form inputs
2. Time-boxed creative exercises
3. AI-assisted synthesis

The app behaves like a **guided workshop**, not a form dump.

---

## High-Level Flow
1. Project Context
2. **Customer & Product Discovery**
3. Stakeholders & Constraints
4. **Requirements Discovery (Sticky-Note Board Exercise)**
5. **Spot / Deliverable-Specific Requirement Exercises**
6. Prioritization (Will / Could / Won’t)
7. Synthesis & Review
8. Generate Creative Brief (DOCX)

Each step:
- Has a timer
- Can be skipped if needed
- Saves state automatically

---

## Customer & Product Discovery (Guided Questions)

### Objective
Build foundational understanding of the **customer, their product or event, and the underlying motivation** before creative decisions are made.

This section prevents premature design decisions and feeds:
- Objectives
- Audience definition
- Messaging
- Success metrics

### Format
A timed, guided interview-style form that can be completed:
- Solo (reflection)
- Or live in a meeting (facilitated)

Each question is shown **one at a time** to reduce cognitive load.

---

### Core Discovery Questions

#### 1. Who is this for? (3 minutes)
- Who must this succeed for?
- Who will see it?
- Who might misunderstand it?

Prompt examples:
- “If this fails, who is disappointed?”
- “Who is this *not* for?”

---

#### 2. What is being offered? (3 minutes)
- What is the thing we are promoting or supporting?
- Is this an event, message, service, or behavior change?

Prompt examples:
- “What problem does this solve for the audience?”
- “What would happen if this didn’t exist?”

---

#### 3. Why does this matter *now*? (2 minutes)
- Why is this important at this moment?
- Is there urgency, seasonality, or risk?

---

#### 4. What does success look like? (3 minutes)
- How will we know this worked?
- What observable outcome matters?

Examples:
- Attendance
- Sign-ups
- Awareness
- Behavior change

---

### Output
Responses are summarized by an LLM into:
- Clear project objectives
- Implied audience needs
- Risks or ambiguities

User reviews and edits before proceeding.

---

## Key Exercise: Digital Sticky-Note Board (Requirements Discovery)

### Objective
Discover **creative requirements** by externalizing all perceived needs, constraints, and expectations, then clustering them into meaningful themes.

This exercise feeds directly into:
- Requirements
- Deliverables
- Constraints
- Creative Direction
- Risks / Considerations

---

### Exercise Design (Non-Negotiable)

#### Step 1 — Focus Prompt (1 minute)
User must answer:
> “What must this creative work accomplish or account for?”

The chosen focus prompt is displayed persistently during the exercise.

**Timer:** visible countdown; hard stop.

---

#### Step 2 — Silent Note Generation (5 minutes)
**Rules:**
- One idea per sticky note
- Short phrases only (3–7 words)
- No discussion (solo users also follow a silent writing phase)
- Quantity over quality

**Examples of notes:**
- “Parents need clear dates”
- “School branding required”
- “No paid printing”
- “Students as audience”
- “Must be ADA accessible”
- “Spanish language needed”

**UI Requirements:**
- Click or keyboard shortcut to create notes
- Notes auto-focus for typing
- Notes appear in a neutral “parking area”

**Timer:** visible countdown; hard stop when time expires.

---

#### Step 3 — Free Clustering (7 minutes)
Users drag notes into clusters based on perceived similarity.

**Rules:**
- No predefined categories
- Clusters emerge organically
- Duplicate ideas can stack together
- Lone notes are allowed

**UI Requirements:**
- Large canvas (pan/zoom optional; can be MVP’d later)
- Drag-and-drop notes
- Notes can overlap slightly
- Visual grouping via proximity (not containers)

**Timer:** visible countdown; gentle warning at 1 minute remaining.

---

#### Step 4 — Cluster Naming (3 minutes)
Each cluster must be given a **label**.

**Rule:** labels should describe the underlying requirement theme, not the notes themselves.

**Good labels:**
- “Audience Accessibility”
- “Brand Constraints”
- “Operational Limits”
- “Messaging Priorities”

**Bad labels:**
- “Stuff”
- “Ideas”
- “Misc”

**UI Requirements:**
- Cluster title text field
- Cluster outline appears after naming

**Timer:** visible countdown; hard stop.

---

#### Step 5 — AI Synthesis (Automatic)
The system passes the following to an LLM:
- Focus prompt
- Cluster names
- Notes within each cluster

**LLM Output (editable):**
- 1–2 sentence summary per cluster
- Identify:
  - Hard requirements
  - Soft requirements
  - Risks
  - Opportunities
- Suggest mapping to creative brief sections

**Example output:**
> **Audience Accessibility:** Multiple notes indicate the audience includes families and non-English speakers, requiring clear visuals, bilingual text, and ADA-compliant formats.

**Principle:** AI synthesizes, never decides; user always reviews.

---

### Sticky Notes Data Model (MVP)
```json
{
  "prompt": "string",
  "notes": [
    {
      "id": "uuid",
      "text": "string",
      "x": 0,
      "y": 0,
      "clusterId": "uuid | null"
    }
  ],
  "clusters": [
    {
      "id": "uuid",
      "title": "string",
      "noteIds": ["uuid"],
      "aiSummary": "string"
    }
  ]
}
```

---

## Spot / Deliverable-Specific Requirement Exercises

### Objective
Surface **practical, execution-level requirements** for a specific creative output ("the spot"), without requiring design expertise.

These exercises are modular, time-boxed, and designed specifically for **video advertising**, but remain adaptable to other media.

---

### Exercise A — One Sentence, Three Lenses (5 minutes)

**Prompt:**
Complete all three:
- “This video needs to make people ___.”
- “This video needs to help the organization ___.”
- “This video needs to show that we ___.”

**Rule:** Do not edit answers until all three are written.

**Outcome:**
- Overlapping words or ideas indicate **true core requirements**.

Feeds into:
- Objectives
- Key message
- Success criteria

---

### Exercise B — Viewers in the Mirror (4 minutes)

**Prompt:**
Imagine the viewer encountering this video.

Answer:
- Where are they when they see it?
- What are they feeling *before* it starts?
- What would make them stop watching?

**Outcome:**
- Attention constraints
- Contextual requirements

Feeds into:
- Format
- Pacing
- Platform assumptions

---

### Exercise C — Story Without Pictures (5 minutes)

**Prompt:**
Describe the video in **five beats**, using only words:
1. Situation
2. Problem
3. Tension / Reveal
4. Product or message role
5. Resolution / CTA

Then tag each beat as:
- REQUIRED
- FLEXIBLE

**Outcome:**
- Structural requirements
- Narrative constraints

Feeds into:
- Story structure
- Script guardrails

---

### Exercise D — If It Failed… (3 minutes)

**Prompt:**
> “If this video failed, what would have gone wrong?”

Examples:
- “People didn’t understand the product”
- “It felt too salesy”
- “It blended in with other ads”

**Outcome:**
Failures are inverted into **requirements** (e.g., clarity, authenticity, differentiation).

Feeds into:
- Tone constraints
- Messaging safeguards

---

### Exercise E — Promise vs Proof (4 minutes)

**Prompt:**
List every claim or promise the video makes.

For each, answer:
> “How could we *show* this visually?”

**Outcome:**
- Visual feasibility requirements
- Identification of weak or unsupported claims

Feeds into:
- Visual direction
- Production feasibility

---

### Exercise F — Constraints Are Fuel (3 minutes)

**Prompt:**
List all known constraints:
- Budget
- Time
- Talent
- Locations
- Legal / compliance

Then answer:
> “How might these limits define the style?”

**Outcome:**
- Constraint-driven creative direction

Feeds into:
- Style
- Scope

---

### Exercise G — Creative Concept Generators (Optional, 6 minutes)

Short, no-material ideation prompts to explore direction **after requirements are clear**.

**Ad in Reverse**
- Imagine the story played backward.

**One Word, Five Ways**
- Choose one core word; express it in five different tones or scenarios.

**Cut on Emotion**
- Define three emotional beats across the runtime.

**Freeze Frame**
- Identify 3–5 still frames that could represent the entire ad.

**Genre Flip**
- Reimagine the concept as a different genre.

**Rule:** These generate *ideas*, not requirements. Ideas must still pass earlier constraints.

---

### Output
An LLM synthesizes all exercises into:
- Deliverable requirements
- Narrative constraints
- Visual and tonal guardrails

User reviews and confirms before proceeding.

---

## Will / Could / Won’t Exercise

### Purpose
Convert discovered requirements into **scope clarity**.

### Structure
Three columns:
- **WILL HAVE** (non-negotiable)
- **COULD HAVE** (nice-to-have)
- **WON’T HAVE** (explicitly out of scope)

### Inputs
- Drag cards from cluster summaries
- Or create new cards

### Feeds into
- Deliverables
- Constraints
- Scope definition

---

## Creative Brief Output (DOCX)

### Sections
1. Project Overview
2. Objectives
3. Target Audience
4. Key Message & Tone
5. Requirements (from sticky-note synthesis)
6. Deliverables
7. Constraints & Risks
8. Timeline
9. Stakeholders
10. Scope (Will / Could / Won’t)

### Requirements
- Generate DOCX client-side
- Clean, professional layout
- Editable after download
- 1–2 pages ideal

---

## Session Saving & Reuse
- Auto-save state via localStorage
- Optional export/import JSON
- Session persists across reloads
- “Start New Brief” clears state

---

## Technical Constraints
- Web app; no login
- Prefer client-side operation
- LLM integration via an abstracted provider interface (OpenAI/Anthropic compatible)

### Suggested Libraries (Non-binding)
- Drag & drop: pointer events or lightweight DnD lib
- DOCX generation: `docx` (dolanmiu/docx)
- Timer: simple JS interval

---

## AI Usage Principles
- AI is an assistant for synthesis only
- User always reviews/edits AI output
- Tone: neutral, professional, concise

---

## Success Criteria
- A non-designer can produce a usable creative brief
- Student volunteers receive clear direction
- Meetings finish on time
- Output resembles agency documentation
- Tool feels helpful, not intimidating

---

## Non-Goals
- No asset creation
- No design execution
- No user accounts
- No project management suite features

---

## Implementation Notes for Claude Code
- Prefer clarity over cleverness
- Modular components
- Clean, readable code
- Comment intent, not obvious mechanics

Build this as if it will be reused for years.

