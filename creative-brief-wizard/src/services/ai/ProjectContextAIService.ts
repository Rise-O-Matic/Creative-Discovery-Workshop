// Project Context AI Service - Extract project information from user prompts

import { LLMService } from '../llm/LLMService';
import type { LLMServiceConfig } from '../llm/types';
import type { ProjectContext } from '../../types';

/**
 * Response from project context extraction with confidence scores
 */
export interface ProjectContextExtractionResult {
  projectContext: Partial<ProjectContext>;
  confidenceScores: {
    projectName: number;
    projectDescription: number;
    stakeholders: number;
    constraints: number;
    timeline: number;
    duration: number;
  };
  success: boolean;
  error?: string;
}

/**
 * Service for extracting project context from natural language prompts using LLM
 */
export class ProjectContextAIService {
  private llmService: LLMService;

  constructor(config: LLMServiceConfig) {
    this.llmService = new LLMService(config);
  }

  /**
   * Extract project context from a user prompt
   * Uses structured prompting to extract ProjectContext fields with confidence scores
   */
  async extractProjectContext(userPrompt: string): Promise<ProjectContextExtractionResult> {
    if (!userPrompt || userPrompt.trim().length === 0) {
      return {
        projectContext: {},
        confidenceScores: {
          projectName: 0,
          projectDescription: 0,
          stakeholders: 0,
          constraints: 0,
          timeline: 0,
          duration: 0,
        },
        success: false,
        error: 'User prompt is empty',
      };
    }

    const { prompt, systemPrompt } = this.createExtractionPrompt(userPrompt);

    try {
      const response = await this.llmService.complete({
        prompt,
        systemPrompt,
        maxTokens: 1500,
        temperature: 0.3, // Lower temperature for more deterministic extraction
      });

      return this.parseExtractionResponse(response.text);
    } catch (error) {
      console.error('Error extracting project context:', error);
      return {
        projectContext: {},
        confidenceScores: {
          projectName: 0,
          projectDescription: 0,
          stakeholders: 0,
          constraints: 0,
          timeline: 0,
          duration: 0,
        },
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Create the extraction prompt for the LLM
   */
  private createExtractionPrompt(userPrompt: string): {
    prompt: string;
    systemPrompt: string;
  } {
    const systemPrompt = `You are an expert project analyst specializing in extracting structured project information from natural language descriptions. Your role is to identify key project details, infer missing information based on common patterns, and provide confidence scores for each extraction.

Be thorough but realistic. If information isn't clearly stated, make reasonable inferences based on the project type and context. Always provide confidence scores (0.0 to 1.0) to indicate how certain you are about each extraction.`;

    const prompt = `Analyze the following project description and extract structured project information.

**User's Project Description:**
${userPrompt}

Please extract and structure the following information in JSON format:

1. **projectName** (string): A concise, professional title for the project (3-8 words). If not explicitly stated, create one based on the project description.

2. **projectDescription** (string): A clear 2-3 sentence summary capturing what the project is about, its purpose, and key aspects.

3. **stakeholders** (string): List likely stakeholders based on the project type. Include roles like:
   - Internal: Project Manager, Creative Director, Marketing Team, etc.
   - External: Clients, End Users, Partners, etc.
   Format as a comma-separated list or brief paragraph.

4. **constraints** (string): Identify any constraints mentioned or commonly associated with this type of project:
   - Budget constraints (if mentioned or typical for project type)
   - Technical constraints (platform, tools, compatibility)
   - Resource constraints (team size, expertise)
   - Legal/regulatory constraints
   Format as a paragraph or bulleted list.

5. **timeline** (string): Suggest realistic project milestones and timeline. Include:
   - Discovery/Research phase
   - Design/Development phase
   - Review/Testing phase
   - Launch/Delivery phase
   Base this on the project scope and typical timelines for similar projects.

6. **duration** (number): Recommended workshop duration in minutes (30-120). Consider:
   - 30-45 minutes: Simple, well-defined projects
   - 45-60 minutes: Standard projects with moderate complexity
   - 60-90 minutes: Complex projects requiring deeper exploration
   - 90-120 minutes: Highly complex or multi-faceted projects

For each field, also provide a confidence score (0.0 to 1.0):
- 1.0: Explicitly stated in the description
- 0.7-0.9: Clearly implied or strongly inferred
- 0.5-0.6: Reasonable inference based on context
- 0.3-0.4: General assumption based on project type
- 0.0-0.2: Complete guess or insufficient information

Return your response as valid JSON in this exact format:
{
  "projectName": "...",
  "projectDescription": "...",
  "stakeholders": "...",
  "constraints": "...",
  "timeline": "...",
  "duration": 60,
  "confidenceScores": {
    "projectName": 0.8,
    "projectDescription": 0.9,
    "stakeholders": 0.6,
    "constraints": 0.5,
    "timeline": 0.6,
    "duration": 0.7
  }
}

Ensure the JSON is valid and parseable. Do not include any text outside the JSON structure.`;

    return { prompt, systemPrompt };
  }

  /**
   * Parse the LLM response and extract the project context
   */
  private parseExtractionResponse(responseText: string): ProjectContextExtractionResult {
    try {
      // Extract JSON from response (in case there's surrounding text)
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }

      const parsed = JSON.parse(jsonMatch[0]);

      // Validate required fields
      if (!parsed.projectName || !parsed.projectDescription) {
        throw new Error('Missing required fields: projectName or projectDescription');
      }

      // Validate duration is within range
      const duration = this.validateDuration(parsed.duration);

      // Validate confidence scores
      const confidenceScores = this.validateConfidenceScores(parsed.confidenceScores);

      const projectContext: Partial<ProjectContext> = {
        projectName: parsed.projectName,
        projectDescription: parsed.projectDescription,
        stakeholders: parsed.stakeholders || '',
        constraints: parsed.constraints || '',
        timeline: parsed.timeline || '',
        duration,
        completed: false,
      };

      return {
        projectContext,
        confidenceScores,
        success: true,
      };
    } catch (error) {
      console.error('Error parsing extraction response:', error);
      return {
        projectContext: {},
        confidenceScores: {
          projectName: 0,
          projectDescription: 0,
          stakeholders: 0,
          constraints: 0,
          timeline: 0,
          duration: 0,
        },
        success: false,
        error: error instanceof Error ? error.message : 'Failed to parse response',
      };
    }
  }

  /**
   * Validate and normalize duration to be within acceptable range
   */
  private validateDuration(duration: number | undefined): number {
    if (typeof duration !== 'number' || isNaN(duration)) {
      return 60; // Default to 60 minutes
    }

    // Clamp between 30 and 120 minutes
    return Math.max(30, Math.min(120, duration));
  }

  /**
   * Validate and normalize confidence scores
   */
  private validateConfidenceScores(scores: any): ProjectContextExtractionResult['confidenceScores'] {
    const defaultScore = 0.5;

    const validateScore = (score: any): number => {
      if (typeof score !== 'number' || isNaN(score)) {
        return defaultScore;
      }
      // Clamp between 0 and 1
      return Math.max(0, Math.min(1, score));
    };

    return {
      projectName: validateScore(scores?.projectName),
      projectDescription: validateScore(scores?.projectDescription),
      stakeholders: validateScore(scores?.stakeholders),
      constraints: validateScore(scores?.constraints),
      timeline: validateScore(scores?.timeline),
      duration: validateScore(scores?.duration),
    };
  }

  /**
   * Test connection to LLM provider
   */
  async testConnection(): Promise<boolean> {
    return this.llmService.testConnection();
  }

  /**
   * Get provider info
   */
  getProviderInfo() {
    return this.llmService.getProviderInfo();
  }
}
