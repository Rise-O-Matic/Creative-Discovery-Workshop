// Workshop Auto-Fill Service
// Uses OpenAI API to generate intelligent suggestions for all workshop questions

import type { SessionState, DiscoveryQuestion } from '../../types';

/**
 * Auto-fill result containing all generated content
 */
export interface AutoFillResult {
  // Customer Discovery Questions
  whoIsThisFor: string;
  whatIsBeingOffered: string;
  whyNow: string;
  whatIsSuccess: string;

  // Diverge Phase - Sticky Notes
  stickyNotes: Array<{
    id: string;
    text: string;
    color: string;
  }>;

  // Additional context
  projectName: string;
  projectDescription: string;
}

/**
 * Service to auto-fill workshop content using AI
 */
export class WorkshopAutoFillService {
  private apiKey: string;
  // private model: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    // this.model = 'gpt-4o-mini'; // Fast and cost-effective
  }

  /**
   * Generate all workshop content from a simple prompt
   */
  async generateFromPrompt(prompt: string): Promise<AutoFillResult> {
    // For now, use mock data since browser CORS prevents direct API calls
    // TODO: Implement backend proxy for production
    if (true) { // Always use mock for now
      return this.generateMockData(prompt);
    }
    
    // The rest of the code is kept for future implementation when backend is ready
    /*
    const systemPrompt = `You are an expert creative strategist...`;
    const userPrompt = `Project description: "${prompt}"...`;

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', { ... });
      // ... parsing logic ...
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to generate workshop content: ${errorMessage}`);
    }
    */
  }

  /**
   * Generate mock data for testing
   */
  private generateMockData(prompt: string): AutoFillResult {
    const projectName = this.extractProjectName(prompt);
    
    return {
      projectName,
      projectDescription: `${prompt}\n\nThis is an exciting project that aims to create engaging content for the target audience. The deliverable will showcase innovative approaches and creative solutions tailored to meet specific business objectives.`,
      whoIsThisFor: `Primary Audience: Tech-savvy professionals aged 25-45 who are early adopters of AI technology and productivity tools. They value efficiency, innovation, and staying ahead of industry trends.\n\nSecondary Audience: Business decision-makers and team leaders looking for solutions to improve their team's productivity.\n\nDemographics: Urban professionals, college-educated, mid to high income, working in tech, consulting, or creative industries.\n\nPsychographics: Value time optimization, interested in cutting-edge technology, active on LinkedIn and Twitter, consume tech podcasts and blogs, make data-driven decisions.`,
      whatIsBeingOffered: `A comprehensive video campaign that showcases the AI productivity app's key features and benefits. The campaign will include:\n\n- A hero video (60-90 seconds) highlighting the app's unique value proposition\n- Short-form social media clips (15-30 seconds each)\n- Demo videos showing real-world use cases\n- Testimonial-style content from beta users\n\nThe campaign will emphasize how the app transforms daily workflows, saves time, and enhances productivity through intelligent automation.`,
      whyNow: `Timing is critical for several reasons:\n\n1. Tech Conference Launch: The conference provides a concentrated audience of early adopters and industry influencers\n2. Market Momentum: AI productivity tools are experiencing peak interest and investment\n3. Competitive Landscape: Several competitors are launching similar products in Q1-Q2\n4. User Demand: Beta waitlist has grown 300% in the past month\n5. Media Attention: Tech media is actively covering AI productivity innovations\n\nLaunching now positions the product as a leader rather than a follower in this rapidly evolving space.`,
      whatIsSuccess: `Success Metrics:\n\n1. Awareness: 50K+ video views across all platforms within first week\n2. Engagement: 15%+ engagement rate on social media posts\n3. Conversion: 5K+ conference attendees sign up for beta access\n4. Quality: Net Promoter Score of 8+ from video viewers\n5. Media: Coverage in at least 3 major tech publications\n6. Viral Potential: 20%+ share rate on key video content\n7. Brand Lift: 30%+ increase in brand awareness among target audience\n\nLong-term: Video content drives 25%+ of total app sign-ups in first quarter.`,
      stickyNotes: [
        { id: 'note-1', text: 'Emphasize time-saving benefits', color: '#FEF3C7' },
        { id: 'note-2', text: 'Show real-world use cases', color: '#DBEAFE' },
        { id: 'note-3', text: 'Modern, sleek visual style', color: '#FCE7F3' },
        { id: 'note-4', text: 'Professional yet approachable tone', color: '#D1FAE5' },
        { id: 'note-5', text: 'Track video completion rates', color: '#E0E7FF' },
        { id: 'note-6', text: 'Launch during conference keynote', color: '#FEF3C7' },
        { id: 'note-7', text: 'Budget: $50K production + $20K promotion', color: '#DBEAFE' },
        { id: 'note-8', text: 'Competitor analysis: Notion AI, Mem', color: '#FCE7F3' },
        { id: 'note-9', text: 'Feature demo: Smart task prioritization', color: '#D1FAE5' },
        { id: 'note-10', text: 'Include customer testimonials', color: '#E0E7FF' },
        { id: 'note-11', text: 'Mobile-first video format', color: '#FEF3C7' },
        { id: 'note-12', text: 'Call-to-action: "Join the beta"', color: '#DBEAFE' },
      ],
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
   * Generate default sticky notes if AI fails
   */
  /*
  private generateDefaultStickyNotes(_prompt: string): AutoFillResult['stickyNotes'] {
    const colors = ['#FEF3C7', '#DBEAFE', '#FCE7F3', '#D1FAE5', '#E0E7FF'];
    
    return [
      { id: 'note-1', text: 'Target audience needs', color: colors[0] },
      { id: 'note-2', text: 'Key message', color: colors[1] },
      { id: 'note-3', text: 'Visual style direction', color: colors[2] },
      { id: 'note-4', text: 'Tone and voice', color: colors[3] },
      { id: 'note-5', text: 'Success metrics', color: colors[4] },
      { id: 'note-6', text: 'Timeline considerations', color: colors[0] },
      { id: 'note-7', text: 'Budget constraints', color: colors[1] },
      { id: 'note-8', text: 'Competitive landscape', color: colors[2] },
    ];
  }
  */

  /**
   * Apply auto-fill results to session state
   */
  applyToSession(result: AutoFillResult, currentState: SessionState): Partial<SessionState> {
    const createDiscoveryQuestion = (id: string, question: string, answer: string, timeLimit: number): DiscoveryQuestion => ({
      id,
      question,
      prompts: [],
      timeLimit,
      answer,
    });

    return {
      projectContext: {
        ...currentState.projectContext,
        projectName: result.projectName,
        projectDescription: result.projectDescription,
      },
      customerDiscovery: {
        ...currentState.customerDiscovery,
        whoIsThisFor: createDiscoveryQuestion('who-is-this-for', "Let's start with your audience. Who is this really for?", result.whoIsThisFor, 180),
        whatIsBeingOffered: createDiscoveryQuestion('what-is-being-offered', "What exactly are you creating? What's the deliverable?", result.whatIsBeingOffered, 180),
        whyNow: createDiscoveryQuestion('why-now', 'Why does this need to exist right now?', result.whyNow, 120),
        whatIsSuccess: createDiscoveryQuestion('what-is-success', 'How will you know this worked?', result.whatIsSuccess, 180),
        completed: false,
      },
    };
  }

  /**
   * Test connection to AI service
   */
  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch('https://api.openai.com/v1/models', {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  }
}
