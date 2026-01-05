// Workshop Auto-Fill Service
// Uses backend API proxy to generate intelligent suggestions for all workshop questions

import type { SessionState } from '../../types';

/**
 * Auto-fill result containing all generated content
 */
export interface AutoFillResult {
  projectName: string;
  projectDescription: string;
  granularAnswers: Record<string, string>; // Maps question ID to answer
}

/**
 * Service to auto-fill workshop content using AI via backend proxy
 */
export class WorkshopAutoFillService {
  private backendUrl: string;

  constructor(backendUrl?: string) {
    // Use environment variable or default to localhost for development
    this.backendUrl = backendUrl || import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
  }

  /**
   * Generate all workshop content from a simple prompt
   */
  async generateFromPrompt(prompt: string): Promise<AutoFillResult> {
    try {
      const response = await fetch(`${this.backendUrl}/api/autofill`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `API request failed with status ${response.status}`
        );
      }

      const result = await response.json();

      // Validate the response structure
      if (!result.projectName || !result.projectDescription || !result.granularAnswers) {
        throw new Error('Invalid response format from AI');
      }

      return result as AutoFillResult;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('AI generation error:', errorMessage);
      
      // Fall back to mock data if backend is unavailable
      if (errorMessage.includes('fetch') || errorMessage.includes('network')) {
        console.warn('Backend unavailable, falling back to mock data');
        return this.generateMockData(prompt);
      }
      
      throw new Error(`Failed to generate workshop content: ${errorMessage}`);
    }
  }

  /**
   * Generate mock data for testing
   */
  private generateMockData(prompt: string): AutoFillResult {
    const projectName = this.extractProjectName(prompt);
    
    // Generate answers for all 19 granular questions
    const granularAnswers: Record<string, string> = {};
    
    // Audience answers
    granularAnswers['aud-1'] = 'Tech-savvy professionals aged 25-45 who are early adopters of AI technology';
    granularAnswers['aud-2'] = 'Business decision-makers and team leaders looking for productivity solutions';
    granularAnswers['aud-3'] = 'Ages 25-45, working in tech, consulting, creative industries, and startups';
    granularAnswers['aud-4'] = 'Efficiency, innovation, staying ahead of trends, and time optimization';
    granularAnswers['aud-5'] = 'LinkedIn, Twitter, tech podcasts, industry conferences, and tech blogs';
    
    // Offering answers
    granularAnswers['off-1'] = 'A comprehensive video campaign showcasing the AI productivity app\'s key features and benefits';
    granularAnswers['off-2'] = 'Intelligent automation, real-world use cases, and focus on time-saving benefits vs competitors';
    granularAnswers['off-3'] = 'Hero video (60-90 sec), short-form social clips (15-30 sec), demos, and user testimonials';
    granularAnswers['off-4'] = 'Transforms daily workflows, saves time, enhances productivity through intelligent automation';
    granularAnswers['off-5'] = 'Launch at tech conference, reach early adopters, establish market leadership position';
    
    // Timing answers
    granularAnswers['time-1'] = 'Immediate - tech conference launch provides concentrated audience of early adopters';
    granularAnswers['time-2'] = 'Q1-Q2 2024 - peak interest in AI productivity tools, before competitors launch';
    granularAnswers['time-3'] = 'High urgency - competitors launching similar products, beta waitlist growing 300%';
    granularAnswers['time-4'] = 'Media is actively covering AI innovations - window of attention is open now';
    
    // Success answers
    granularAnswers['succ-1'] = '50K+ video views across all platforms within first week of launch';
    granularAnswers['succ-2'] = '15%+ engagement rate on social media posts, 5K+ conference attendees sign up';
    granularAnswers['succ-3'] = 'Net Promoter Score of 8+, coverage in 3+ major tech publications';
    granularAnswers['succ-4'] = '20%+ share rate on key video content, 30%+ brand awareness increase';
    granularAnswers['succ-5'] = 'Video content drives 25%+ of total app sign-ups in first quarter';
    
    return {
      projectName,
      projectDescription: `${prompt}\n\nThis is an exciting project that aims to create engaging content for the target audience. The deliverable will showcase innovative approaches and creative solutions tailored to meet specific business objectives.`,
      granularAnswers,
    };
  }

  /**
   * Extract project name from prompt
   */
  private extractProjectName(prompt: string): string {
    if (!prompt.trim()) return 'Untitled Project';
    
    // Look for common patterns
    const forMatch = prompt.match(/for (?:a |an |the )?([^,.]+)/i);
    if (forMatch) return forMatch[1].trim();
    
    const calledMatch = prompt.match(/called ([^,.]+)/i);
    if (calledMatch) return calledMatch[1].trim();
    
    // Use first few words
    const words = prompt.trim().split(/\s+/).slice(0, 5);
    return words.join(' ');
  }

  /**
   * Apply auto-fill results to session state
   */
  applyToSession(result: AutoFillResult, currentState: SessionState): any {
    // Update the granularQuestions array in customerDiscovery
    const granularQuestions = currentState.customerDiscovery.granularQuestions.map(q => ({
      ...q,
      answer: result.granularAnswers[q.id] || q.answer
    }));

    return {
      projectContext: {
        ...currentState.projectContext,
        projectName: result.projectName,
        projectDescription: result.projectDescription,
      },
      granularAnswers: granularQuestions,
    };
  }

  /**
   * Test connection to backend service
   */
  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.backendUrl}/health`);
      return response.ok;
    } catch (error) {
      return false;
    }
  }
}
