// Core domain types for Creative Discovery Workshop

// ============================================================================
// Enums & Constants
// ============================================================================

export type SessionPhase =
  | 'ai-prompt'
  | 'project-review'
  | 'project-context'
  | 'customer-discovery'
  | 'prioritization'
  | 'synthesis-review'
  | 'brief-complete'
  | 'sticky-notes-diverge'
  | 'sticky-notes-converge'
  | 'sticky-notes-naming'
  | 'sticky-notes-synthesis'
  | 'spot-exercises';

export type LLMProvider = 'openai' | 'anthropic';

export type RequirementPriority = 'will' | 'could' | 'wont';

export type BeatType = 'required' | 'flexible';

// ============================================================================
// Sticky Notes & Clustering
// ============================================================================

export interface StickyNote {
  id: string;
  text: string;
  x: number;
  y: number;
  clusterId: string | null;
  createdAt: number;
}

export interface Cluster {
  id: string;
  title: string;
  noteIds: string[];
  aiSummary: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface StickyNoteExercise {
  focusPrompt: string;
  notes: StickyNote[];
  clusters: Cluster[];
  completed: boolean;
}

// ============================================================================
// Discovery Questions
// ============================================================================

export interface GranularQuestion {
  id: string;
  question: string;
  placeholder?: string;
  answer: string;
  rationale?: string;
}

export interface DiscoveryQuestion {
  id: string;
  question: string;
  prompts: string[];
  timeLimit: number;
  answer: string;
}

export interface CustomerDiscovery {
  granularQuestions: GranularQuestion[];
  whoIsThisFor: DiscoveryQuestion;
  whatIsBeingOffered: DiscoveryQuestion;
  whyNow: DiscoveryQuestion;
  whatIsSuccess: DiscoveryQuestion;
  completed: boolean;
}

// ============================================================================
// Spot/Deliverable Exercises
// ============================================================================

export interface OneSentenceThreeLenses {
  makePeopleFeel: string;
  helpOrganization: string;
  showThatWe: string;
}

export interface ViewersInMirror {
  whereWatching: string;
  feelingBefore: string;
  stopWatchingIf: string;
}

export interface StoryBeat {
  description: string;
  type: BeatType;
}

export interface StoryWithoutPictures {
  situation: StoryBeat;
  problem: StoryBeat;
  tensionReveal: StoryBeat;
  productRole: StoryBeat;
  resolution: StoryBeat;
}

export interface PromiseProof {
  claim: string;
  visualProof: string;
}

export interface Constraint {
  description: string;
  styleImplication: string;
}

export interface SpotExercises {
  oneSentence: OneSentenceThreeLenses | null;
  viewersInMirror: ViewersInMirror | null;
  story: StoryWithoutPictures | null;
  failures: string[];
  promisesAndProofs: PromiseProof[];
  constraints: Constraint[];
  aiSynthesis: string;
  completed: boolean;
}

// ============================================================================
// Prioritization
// ============================================================================

export interface RequirementCard {
  id: string;
  description: string;
  source: string; // which exercise/cluster it came from
}

export interface Prioritization {
  willHave: RequirementCard[];
  couldHave: RequirementCard[];
  wontHave: RequirementCard[];
  completed: boolean;
}

// ============================================================================
// Creative Brief Sections
// ============================================================================

export interface BriefSection {
  title: string;
  content: string;
  editable: boolean;
}

export interface CreativeBrief {
  projectOverview: BriefSection;
  objectives: BriefSection;
  targetAudience: BriefSection;
  keyMessageAndTone: BriefSection;
  requirements: BriefSection;
  deliverables: BriefSection;
  constraintsAndRisks: BriefSection;
  timeline: BriefSection;
  stakeholders: BriefSection;
  scope: BriefSection;
  generatedAt: number;
}

// ============================================================================
// Timer Configuration
// ============================================================================

export interface TimerConfig {
  duration: number; // in seconds
  isActive: boolean;
  startedAt: number | null;
  remainingSeconds: number | null;
  isPaused: boolean;
}

// ============================================================================
// LLM Configuration
// ============================================================================

export interface LLMConfig {
  provider: LLMProvider;
  apiKey: string;
  model: string; // e.g., 'gpt-4' or 'claude-3-5-sonnet-20241022'
}

// ============================================================================
// AI Processing State
// ============================================================================

export interface AIPromptState {
  originalPrompt: string;
  processedAt: number | null;
  processingTime: number | null;
  llmProvider: LLMProvider | null;
  modelUsed: string;
  streamingSupported: boolean;
}

export interface FieldMetadata {
  source: 'ai' | 'user' | 'hybrid';
  confidence: number; // 0-1
  lastModified: number;
  originalAIValue?: string;
}

export interface EditHistory {
  field: keyof ProjectContext;
  previousValue: string;
  newValue: string;
  timestamp: number;
  source: 'user' | 'ai-regeneration';
}

export interface ProjectContextMetadata {
  aiGenerated: boolean;
  fieldSources: {
    [K in keyof ProjectContext]?: FieldMetadata;
  };
  userEdits: EditHistory[];
}

// ============================================================================
// Project Context
// ============================================================================

export interface ProjectContext {
  projectName: string;
  projectDescription: string;
  stakeholders: string;
  constraints: string;
  timeline: string;
  duration: number; // Workshop duration in minutes
  completed: boolean;
}

// ============================================================================
// Complete Session State
// ============================================================================

export interface SessionState {
  // Session metadata
  sessionId: string;
  createdAt: number;
  lastModified: number;
  currentPhase: SessionPhase;
  completedPhases: SessionPhase[]; // Track which phases have been completed

  // Timer state
  timer: TimerConfig;

  // LLM configuration
  llmConfig: LLMConfig;

  // AI prompt state
  // Default: { originalPrompt: '', processedAt: null, processingTime: null, llmProvider: null, modelUsed: '', streamingSupported: false }
  aiPromptState: AIPromptState;

  // Project context
  projectContext: ProjectContext;

  // Project context metadata
  // Default: { aiGenerated: false, fieldSources: {}, userEdits: [] }
  projectContextMetadata: ProjectContextMetadata;

  // Discovery phases
  customerDiscovery: CustomerDiscovery;
  
  // Granular answers (mapped by question ID)
  granularAnswers: Record<string, string>;

  // Sticky note exercise
  stickyNoteExercise: StickyNoteExercise;

  // Spot-specific exercises
  spotExercises: SpotExercises;

  // Prioritization
  prioritization: Prioritization;

  // Final brief
  creativeBrief: CreativeBrief | null;
}

// ============================================================================
// Helper Types
// ============================================================================

export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface Bounds {
  x: number;
  y: number;
  width: number;
  height: number;
}
