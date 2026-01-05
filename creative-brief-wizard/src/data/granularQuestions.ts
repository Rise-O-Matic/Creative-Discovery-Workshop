import type { GranularQuestion } from '../types';

export const GRANULAR_QUESTIONS: GranularQuestion[] = [
  // ============================================================================
  // AUDIENCE QUESTIONS (5 questions)
  // ============================================================================
  {
    id: 'aud-1',
    question: 'Who is your primary audience?',
    placeholder: 'e.g., busy professionals aged 25-45',
    answer: '',
    rationale: 'Understanding your primary audience helps focus your creative strategy and ensures your message resonates with the people who matter most.',
  },
  {
    id: 'aud-2',
    question: 'Are there secondary audiences?',
    placeholder: 'e.g., business decision-makers, influencers',
    answer: '',
    rationale: 'Secondary audiences can influence your primary audience or have different needs. Identifying them helps create more comprehensive messaging.',
  },
  {
    id: 'aud-3',
    question: 'What age range and profession?',
    placeholder: 'e.g., 25-45, tech professionals, entrepreneurs',
    answer: '',
    rationale: 'Demographics and professional context shape how people consume content, make decisions, and what language resonates with them.',
  },
  {
    id: 'aud-4',
    question: 'What do they value most?',
    placeholder: 'e.g., efficiency, innovation, reliability, cost',
    answer: '',
    rationale: 'Knowing what your audience values helps you emphasize the right benefits and connect emotionally with their priorities.',
  },
  {
    id: 'aud-5',
    question: 'Where do they spend their time?',
    placeholder: 'e.g., LinkedIn, industry conferences, podcasts, Twitter',
    answer: '',
    rationale: 'Understanding where your audience consumes content informs distribution strategy and helps you meet them where they already are.',
  },

  // ============================================================================
  // OFFERING QUESTIONS (5 questions)
  // ============================================================================
  {
    id: 'off-1',
    question: 'What are you offering?',
    placeholder: 'e.g., a software product, service, event, behavior change',
    answer: '',
    rationale: 'Clearly defining what you\'re offering ensures everyone on the team shares the same understanding of the deliverable.',
  },
  {
    id: 'off-2',
    question: 'What makes it different?',
    placeholder: 'e.g., unique features, approach, price point, team',
    answer: '',
    rationale: 'Your differentiation is what makes people choose you over alternatives. This becomes the foundation of your positioning.',
  },
  {
    id: 'off-3',
    question: 'What is the core benefit?',
    placeholder: 'e.g., saves time, reduces costs, improves quality, increases revenue',
    answer: '',
    rationale: 'People don\'t buy features, they buy outcomes. The core benefit is the transformation or value your offering provides.',
  },
  {
    id: 'off-4',
    question: 'What problem does it solve?',
    placeholder: 'e.g., reduces manual work, improves collaboration, cuts waste',
    answer: '',
    rationale: 'Understanding the problem helps you speak to pain points and demonstrate empathy with your audience\'s challenges.',
  },
  {
    id: 'off-5',
    question: 'How would you describe it in one sentence?',
    placeholder: 'Your elevator pitch',
    answer: '',
    rationale: 'A clear one-sentence description forces clarity and becomes the foundation for all other messaging and communication.',
  },

  // ============================================================================
  // TIMING QUESTIONS (4 questions)
  // ============================================================================
  {
    id: 'time-1',
    question: 'Why now? What is the urgency?',
    placeholder: 'e.g., market shift, competitive pressure, seasonal opportunity',
    answer: '',
    rationale: 'Urgency drives action. Understanding why timing matters helps create compelling calls-to-action and prioritize resources.',
  },
  {
    id: 'time-2',
    question: 'Is there a specific deadline?',
    placeholder: 'e.g., Q2 launch, before competitor release, fiscal year end',
    answer: '',
    rationale: 'Deadlines create structure for planning and help teams coordinate efforts. They also create natural momentum in campaigns.',
  },
  {
    id: 'time-3',
    question: 'What happens if you wait?',
    placeholder: 'e.g., lose market share, miss opportunity, competitors move first',
    answer: '',
    rationale: 'Understanding the cost of delay helps justify investment and creates urgency for both your team and your audience.',
  },
  {
    id: 'time-4',
    question: 'Are there seasonal or cultural factors?',
    placeholder: 'e.g., holiday season, back-to-school, industry event',
    answer: '',
    rationale: 'Timing your message around cultural moments or seasons can amplify impact and make your offering more relevant.',
  },

  // ============================================================================
  // SUCCESS QUESTIONS (5 questions)
  // ============================================================================
  {
    id: 'succ-1',
    question: 'How will you measure success?',
    placeholder: 'e.g., 10K users, 50% conversion rate, $1M revenue',
    answer: '',
    rationale: 'Clear success metrics ensure everyone is working toward the same goal and provide a way to evaluate effectiveness.',
  },
  {
    id: 'succ-2',
    question: 'What does short-term success look like?',
    placeholder: 'e.g., first week metrics, initial feedback, beta signups',
    answer: '',
    rationale: 'Short-term wins build momentum and provide early signals about what\'s working, allowing for quick adjustments.',
  },
  {
    id: 'succ-3',
    question: 'What about long-term success?',
    placeholder: 'e.g., 6 months: X users, 1 year: Y revenue',
    answer: '',
    rationale: 'Long-term goals ensure you\'re building something sustainable, not just optimizing for immediate results.',
  },
  {
    id: 'succ-4',
    question: 'What would failure look like?',
    placeholder: 'e.g., less than 5% adoption, negative press, team burnout',
    answer: '',
    rationale: 'Defining failure helps identify risks early and creates guardrails to prevent worst-case scenarios.',
  },
  {
    id: 'succ-5',
    question: 'Who gets to declare this a success?',
    placeholder: 'e.g., CEO, customers, market analysts',
    answer: '',
    rationale: 'Knowing whose opinion matters most helps you focus on the right metrics and stakeholders throughout the project.',
  },
];
