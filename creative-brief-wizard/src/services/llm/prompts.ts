// Prompt templates for LLM synthesis

import type { StickyNote } from '../../types';

/**
 * Generate a prompt for synthesizing a cluster of sticky notes
 */
export function createClusterSynthesisPrompt(
  clusterTitle: string,
  notes: StickyNote[]
): { prompt: string; systemPrompt: string } {
  const noteTexts = notes.map((note, idx) => `${idx + 1}. ${note.text}`).join('\n');

  const systemPrompt = `You are a creative strategist helping to synthesize insights from brainstorming sessions. Your role is to identify patterns, themes, and key insights from groups of related ideas.

Be concise, insightful, and actionable. Focus on the "so what" - what do these ideas mean for the creative brief being developed?`;

  const prompt = `I have a cluster of sticky notes from a brainstorming session titled "${clusterTitle}". Please provide a concise 2-3 sentence synthesis that captures the key theme and insights from these notes.

Sticky notes in this cluster:
${noteTexts}

Provide a synthesis that:
1. Identifies the core theme or pattern across these notes
2. Highlights what's important or actionable about this group of ideas
3. Is written in a clear, professional tone suitable for a creative brief

Synthesis:`;

  return { prompt, systemPrompt };
}

/**
 * Generate a prompt for synthesizing customer discovery responses
 */
export function createCustomerDiscoverySynthesisPrompt(
  whoIsThisFor: string,
  whatIsBeingOffered: string,
  whyNow: string,
  whatIsSuccess: string
): { prompt: string; systemPrompt: string } {
  const systemPrompt = `You are a creative strategist synthesizing customer discovery insights into actionable guidance for a creative project. Focus on clarity, strategic insight, and practical implications.`;

  const prompt = `Based on the following customer discovery responses, provide a strategic synthesis that will guide the creative brief development.

**Who is this for?**
${whoIsThisFor}

**What is being offered?**
${whatIsBeingOffered}

**Why now?**
${whyNow}

**What does success look like?**
${whatIsSuccess}

Provide a 3-4 paragraph synthesis that:
1. Summarizes the target audience and their needs
2. Clarifies the core offering and its value proposition
3. Explains the timing and context
4. Defines success criteria and strategic objectives

Write in a clear, professional tone suitable for a creative brief.

Synthesis:`;

  return { prompt, systemPrompt };
}

/**
 * Generate a prompt for synthesizing spot/deliverable exercises
 */
export function createSpotExercisesSynthesisPrompt(exercises: {
  oneSentence?: { makePeopleFeel: string; helpOrganization: string; showThatWe: string };
  viewersInMirror?: { whereWatching: string; feelingBefore: string; stopWatchingIf: string };
  story?: {
    situation: string;
    problem: string;
    tensionReveal: string;
    productRole: string;
    resolution: string;
  };
  failures?: string[];
  promisesAndProofs?: { claim: string; visualProof: string }[];
  constraints?: { description: string; styleImplication: string }[];
}): { prompt: string; systemPrompt: string } {
  const systemPrompt = `You are a creative strategist synthesizing creative direction from multiple exercises. Focus on creating actionable creative guidance that balances ambition with constraints.`;

  let prompt = `Based on the following creative exercises, provide a synthesis that will guide the creative brief and production.

`;

  if (exercises.oneSentence) {
    prompt += `**One Sentence Through Three Lenses:**
- Make people feel: ${exercises.oneSentence.makePeopleFeel}
- Help organization: ${exercises.oneSentence.helpOrganization}
- Show that we: ${exercises.oneSentence.showThatWe}

`;
  }

  if (exercises.viewersInMirror) {
    prompt += `**Viewers in Mirror:**
- Where watching: ${exercises.viewersInMirror.whereWatching}
- Feeling before: ${exercises.viewersInMirror.feelingBefore}
- Stop watching if: ${exercises.viewersInMirror.stopWatchingIf}

`;
  }

  if (exercises.story) {
    prompt += `**Story Without Pictures:**
- Situation: ${exercises.story.situation}
- Problem: ${exercises.story.problem}
- Tension/Reveal: ${exercises.story.tensionReveal}
- Product Role: ${exercises.story.productRole}
- Resolution: ${exercises.story.resolution}

`;
  }

  if (exercises.failures && exercises.failures.length > 0) {
    prompt += `**Ways This Could Fail:**
${exercises.failures.map((f, idx) => `${idx + 1}. ${f}`).join('\n')}

`;
  }

  if (exercises.promisesAndProofs && exercises.promisesAndProofs.length > 0) {
    prompt += `**Promises & Visual Proofs:**
${exercises.promisesAndProofs.map((pp, idx) => `${idx + 1}. ${pp.claim} → Proof: ${pp.visualProof}`).join('\n')}

`;
  }

  if (exercises.constraints && exercises.constraints.length > 0) {
    prompt += `**Constraints:**
${exercises.constraints.map((c, idx) => `${idx + 1}. ${c.description} → Style: ${c.styleImplication}`).join('\n')}

`;
  }

  prompt += `Provide a 3-4 paragraph synthesis that:
1. Identifies the core creative direction and emotional goals
2. Outlines the narrative structure and key story beats
3. Highlights important constraints and how they shape the creative
4. Summarizes the promises being made and how to prove them visually

Write in a clear, professional tone suitable for a creative brief.

Synthesis:`;

  return { prompt, systemPrompt };
}

/**
 * Generate a prompt for creating the final creative brief
 */
export function createCreativeBriefPrompt(sessionData: {
  projectName: string;
  projectDescription: string;
  customerDiscoverySynthesis?: string;
  clusterSummaries?: { title: string; summary: string }[];
  spotExercisesSynthesis?: string;
  stakeholders?: string;
  constraints?: string;
  timeline?: string;
  requirements?: { description: string; priority: 'will' | 'could' | 'wont' }[];
}): { prompt: string; systemPrompt: string } {
  const systemPrompt = `You are an expert creative strategist creating a comprehensive creative brief. Write in a clear, professional, and actionable style. The brief should be inspiring yet practical, guiding the creative team effectively.`;

  let prompt = `Create a comprehensive creative brief for the following project:

**Project Name:** ${sessionData.projectName}

**Project Description:** ${sessionData.projectDescription}

`;

  if (sessionData.customerDiscoverySynthesis) {
    prompt += `**Customer Discovery Insights:**
${sessionData.customerDiscoverySynthesis}

`;
  }

  if (sessionData.clusterSummaries && sessionData.clusterSummaries.length > 0) {
    prompt += `**Key Themes from Brainstorming:**
${sessionData.clusterSummaries.map((cs) => `- **${cs.title}:** ${cs.summary}`).join('\n')}

`;
  }

  if (sessionData.spotExercisesSynthesis) {
    prompt += `**Creative Direction:**
${sessionData.spotExercisesSynthesis}

`;
  }

  if (sessionData.stakeholders) {
    prompt += `**Stakeholders:**
${sessionData.stakeholders}

`;
  }

  if (sessionData.timeline) {
    prompt += `**Timeline:**
${sessionData.timeline}

`;
  }

  if (sessionData.constraints) {
    prompt += `**Constraints:**
${sessionData.constraints}

`;
  }

  if (sessionData.requirements && sessionData.requirements.length > 0) {
    const willHave = sessionData.requirements.filter((r) => r.priority === 'will');
    const couldHave = sessionData.requirements.filter((r) => r.priority === 'could');

    if (willHave.length > 0) {
      prompt += `**Must-Have Requirements:**
${willHave.map((r, idx) => `${idx + 1}. ${r.description}`).join('\n')}

`;
    }

    if (couldHave.length > 0) {
      prompt += `**Nice-to-Have Requirements:**
${couldHave.map((r, idx) => `${idx + 1}. ${r.description}`).join('\n')}

`;
    }
  }

  prompt += `Create a creative brief with the following sections. Each section should be 2-4 paragraphs of clear, actionable content:

1. **Project Overview** - High-level summary of what this project is and why it matters
2. **Objectives** - What we're trying to achieve (business and creative goals)
3. **Target Audience** - Who we're speaking to and what matters to them
4. **Key Message & Tone** - What we want to communicate and how
5. **Requirements** - What must be included (deliverables, features, specs)
6. **Deliverables** - Specific outputs expected from this project
7. **Constraints & Risks** - Limitations and potential challenges
8. **Timeline** - Key milestones and deadlines
9. **Stakeholders** - Who's involved and their roles
10. **Scope** - What's in and out of scope

Format your response as JSON with this structure:
{
  "projectOverview": "...",
  "objectives": "...",
  "targetAudience": "...",
  "keyMessageAndTone": "...",
  "requirements": "...",
  "deliverables": "...",
  "constraintsAndRisks": "...",
  "timeline": "...",
  "stakeholders": "...",
  "scope": "..."
}`;

  return { prompt, systemPrompt };
}
