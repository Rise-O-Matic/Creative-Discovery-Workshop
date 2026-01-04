// Mock Provider for Development/Testing

import type { ILLMProvider, LLMRequest, LLMResponse } from '../types';
import type { LLMProvider } from '../../../types';

/**
 * Mock provider for development and testing
 * Returns simulated responses without calling external APIs
 */
export class MockProvider implements ILLMProvider {
  readonly provider: LLMProvider = 'openai'; // Pretend to be OpenAI
  readonly model: string = 'mock-model';

  /**
   * Generate a mock completion
   */
  async complete(request: LLMRequest): Promise<LLMResponse> {
    // Simulate network delay
    await this.delay(500 + Math.random() * 1000);

    // Generate a mock response based on the prompt
    const text = this.generateMockResponse(request.prompt);

    return {
      text,
      provider: this.provider,
      model: this.model,
      tokensUsed: Math.floor(Math.random() * 500) + 100,
    };
  }

  /**
   * Test connection (always succeeds for mock)
   */
  async testConnection(): Promise<boolean> {
    await this.delay(100);
    return true;
  }

  /**
   * Generate a contextual mock response
   */
  private generateMockResponse(prompt: string): string {
    // Check if this is a cluster synthesis request
    if (prompt.includes('sticky notes') || prompt.includes('cluster')) {
      return this.generateClusterSummary(prompt);
    }

    // Generic mock response
    return 'This is a mock response from the development LLM service. In production, this would be replaced with actual AI-generated content.';
  }

  /**
   * Generate a mock cluster summary
   */
  private generateClusterSummary(_prompt: string): string {
    const summaries = [
      'This cluster focuses on user experience and interface design considerations. The notes emphasize intuitive navigation, visual clarity, and accessibility features that will enhance user engagement.',
      'This group of ideas centers around technical implementation and architecture. Key themes include scalability, performance optimization, and integration with existing systems.',
      'These notes highlight stakeholder needs and business objectives. Common threads include ROI, timeline constraints, and alignment with strategic goals.',
      'This cluster captures creative concepts and visual direction. The ideas suggest a modern, bold aesthetic with emphasis on brand consistency and emotional impact.',
      'These notes revolve around content strategy and messaging. Key themes include audience targeting, tone of voice, and narrative structure.',
    ];

    // Return a random summary
    return summaries[Math.floor(Math.random() * summaries.length)];
  }

  /**
   * Simulate network delay
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
