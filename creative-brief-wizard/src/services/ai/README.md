# AI Services

This directory contains AI-powered services that use LLMs to enhance the Creative Discovery Workshop experience.

## ProjectContextAIService

Extracts structured project context information from natural language prompts.

### Features

- Extracts project name, description, stakeholders, constraints, timeline, and recommended duration
- Provides confidence scores for each extracted field (0.0-1.0)
- Uses structured prompt engineering for consistent results
- Graceful error handling with fallback values
- Supports all LLM providers configured in LLMService (OpenAI, Anthropic, Mock)

### Usage Example

```typescript
import { ProjectContextAIService } from './services/ai';
import type { LLMConfig } from './types';

// Initialize the service with your LLM configuration
const llmConfig: LLMConfig = {
  provider: 'openai',
  apiKey: 'your-api-key',
  model: 'gpt-4',
};

const aiService = new ProjectContextAIService(llmConfig);

// Extract project context from user input
const userPrompt = `
  We need to create a promotional video for our new fitness app.
  The app helps busy professionals find quick 15-minute workouts they can do at home.
  We want something energetic and motivating that shows real people using the app.
  Budget is around $50k and we need it done in 6 weeks.
`;

const result = await aiService.extractProjectContext(userPrompt);

if (result.success) {
  console.log('Project Name:', result.projectContext.projectName);
  console.log('Description:', result.projectContext.projectDescription);
  console.log('Stakeholders:', result.projectContext.stakeholders);
  console.log('Constraints:', result.projectContext.constraints);
  console.log('Timeline:', result.projectContext.timeline);
  console.log('Workshop Duration:', result.projectContext.duration, 'minutes');

  console.log('\nConfidence Scores:');
  console.log('Project Name:', result.confidenceScores.projectName);
  console.log('Description:', result.confidenceScores.projectDescription);
  console.log('Stakeholders:', result.confidenceScores.stakeholders);
  console.log('Constraints:', result.confidenceScores.constraints);
  console.log('Timeline:', result.confidenceScores.timeline);
  console.log('Duration:', result.confidenceScores.duration);
} else {
  console.error('Error:', result.error);
}
```

### Response Format

```typescript
{
  projectContext: {
    projectName: "Fitness App Promotional Video",
    projectDescription: "A promotional video showcasing a new fitness app designed for busy professionals. The video will demonstrate quick 15-minute at-home workouts and feature real users to create an energetic and motivating experience.",
    stakeholders: "Internal: Marketing Team, Creative Director, Product Manager. External: Target Users (busy professionals), App Development Team, Video Production Crew",
    constraints: "Budget: $50,000. Timeline: 6 weeks for completion. Technical: Must showcase mobile app interface. Creative: Energetic and motivating tone required.",
    timeline: "Week 1-2: Discovery and script development. Week 3-4: Production and filming. Week 5: Post-production and editing. Week 6: Final review and delivery.",
    duration: 75,
    completed: false
  },
  confidenceScores: {
    projectName: 0.9,
    projectDescription: 0.95,
    stakeholders: 0.7,
    constraints: 0.85,
    timeline: 0.75,
    duration: 0.8
  },
  success: true
}
```

### Integration with Existing Services

The `ProjectContextAIService` follows the same patterns as `SynthesisService`:

- Extends `LLMService` with domain-specific functionality
- Uses the same `LLMServiceConfig` interface
- Supports all configured LLM providers
- Handles errors gracefully with retry logic (inherited from LLMService)
- Provides structured prompts for consistent results

### Confidence Scores

Confidence scores indicate how certain the AI is about each extraction:

- **1.0**: Explicitly stated in the user prompt
- **0.7-0.9**: Clearly implied or strongly inferred from context
- **0.5-0.6**: Reasonable inference based on project type
- **0.3-0.4**: General assumption based on common patterns
- **0.0-0.2**: Low confidence or insufficient information

### Error Handling

The service handles errors gracefully:

- Returns `success: false` with an `error` message
- Provides empty project context with zero confidence scores
- Validates all extracted data (duration range, confidence score range)
- Falls back to sensible defaults when parsing fails

### Workshop Duration Recommendation

The service recommends workshop duration (30-120 minutes) based on:

- Project complexity mentioned in the prompt
- Number of stakeholders and constraints
- Scope and scale of the project
- Common patterns for similar project types

Duration guidelines:
- **30-45 minutes**: Simple, well-defined projects
- **45-60 minutes**: Standard projects with moderate complexity
- **60-90 minutes**: Complex projects requiring deeper exploration
- **90-120 minutes**: Highly complex or multi-faceted projects
