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
  },
  {
    id: 'aud-2',
    question: 'Are there secondary audiences?',
    placeholder: 'e.g., business decision-makers, influencers',
    answer: '',
  },
  {
    id: 'aud-3',
    question: 'What age range and profession?',
    placeholder: 'e.g., 25-45, tech professionals, entrepreneurs',
    answer: '',
  },
  {
    id: 'aud-4',
    question: 'What do they value most?',
    placeholder: 'e.g., efficiency, innovation, reliability, cost',
    answer: '',
  },
  {
    id: 'aud-5',
    question: 'Where do they spend their time?',
    placeholder: 'e.g., LinkedIn, industry conferences, podcasts, Twitter',
    answer: '',
  },

  // ============================================================================
  // OFFERING QUESTIONS (5 questions)
  // ============================================================================
  {
    id: 'off-1',
    question: 'What are you offering?',
    placeholder: 'e.g., a software product, service, event, behavior change',
    answer: '',
  },
  {
    id: 'off-2',
    question: 'What makes it different?',
    placeholder: 'e.g., unique features, approach, price point, team',
    answer: '',
  },
  {
    id: 'off-3',
    question: 'What is the core benefit?',
    placeholder: 'e.g., saves time, reduces costs, improves quality, increases revenue',
    answer: '',
  },
  {
    id: 'off-4',
    question: 'What problem does it solve?',
    placeholder: 'e.g., reduces manual work, improves collaboration, cuts waste',
    answer: '',
  },
  {
    id: 'off-5',
    question: 'How would you describe it in one sentence?',
    placeholder: 'Your elevator pitch',
    answer: '',
  },

  // ============================================================================
  // TIMING QUESTIONS (4 questions)
  // ============================================================================
  {
    id: 'time-1',
    question: 'Why now? What is the urgency?',
    placeholder: 'e.g., market shift, competitive pressure, seasonal opportunity',
    answer: '',
  },
  {
    id: 'time-2',
    question: 'Is there a specific deadline?',
    placeholder: 'e.g., Q2 launch, before competitor release, fiscal year end',
    answer: '',
  },
  {
    id: 'time-3',
    question: 'What happens if you wait?',
    placeholder: 'e.g., lose market share, miss opportunity, competitors move first',
    answer: '',
  },
  {
    id: 'time-4',
    question: 'Are there seasonal or cultural factors?',
    placeholder: 'e.g., holiday season, back-to-school, industry event',
    answer: '',
  },

  // ============================================================================
  // SUCCESS QUESTIONS (5 questions)
  // ============================================================================
  {
    id: 'succ-1',
    question: 'How will you measure success?',
    placeholder: 'e.g., 10K users, 50% conversion rate, $1M revenue',
    answer: '',
  },
  {
    id: 'succ-2',
    question: 'What does short-term success look like?',
    placeholder: 'e.g., first week metrics, initial feedback, beta signups',
    answer: '',
  },
  {
    id: 'succ-3',
    question: 'What about long-term success?',
    placeholder: 'e.g., 6 months: X users, 1 year: Y revenue',
    answer: '',
  },
  {
    id: 'succ-4',
    question: 'What would failure look like?',
    placeholder: 'e.g., less than 5% adoption, negative press, team burnout',
    answer: '',
  },
  {
    id: 'succ-5',
    question: 'Who gets to declare this a success?',
    placeholder: 'e.g., CEO, customers, market analysts',
    answer: '',
  },
];
