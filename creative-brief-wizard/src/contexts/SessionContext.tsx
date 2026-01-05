import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type {
  SessionState,
  SessionPhase,
  StickyNote,
  Cluster,
  LLMProvider,
  RequirementCard,
  RequirementPriority,
  CreativeBrief,
  ProjectContext,
  CustomerDiscovery,
  SpotExercises,
} from '../types';
import { loadSession, saveSession } from '../utils/storage';

// ============================================================================
// Context Value Type
// ============================================================================

export interface SessionContextValue {
  // State
  state: SessionState;

  // Phase management
  setPhase: (phase: SessionPhase) => void;
  nextPhase: () => void;
  navigateToPhase: (targetPhase: SessionPhase) => boolean;

  // Project context
  updateProjectContext: (context: Partial<ProjectContext>) => void;

  // Customer discovery
  updateCustomerDiscovery: (discovery: Partial<CustomerDiscovery>) => void;

  // Sticky notes CRUD
  addStickyNote: (note: Omit<StickyNote, 'id' | 'createdAt'>) => void;
  updateStickyNote: (id: string, updates: Partial<StickyNote>) => void;
  deleteStickyNote: (id: string) => void;
  moveStickyNote: (id: string, x: number, y: number) => void;
  assignNoteToCluster: (noteId: string, clusterId: string | null) => void;

  // Clusters CRUD
  addCluster: (cluster: Omit<Cluster, 'id'>) => void;
  updateCluster: (id: string, updates: Partial<Cluster>) => void;
  deleteCluster: (id: string) => void;
  moveCluster: (id: string, x: number, y: number) => void;
  resizeCluster: (id: string, width: number, height: number) => void;

  // Sticky note exercise
  setFocusPrompt: (prompt: string) => void;
  setStickyNoteSynthesis: (synthesis: string) => void;

  // Spot exercises
  updateSpotExercises: (exercises: Partial<SpotExercises>) => void;

  // Prioritization
  addRequirementCard: (card: Omit<RequirementCard, 'id'>) => void;
  moveRequirementCard: (cardId: string, priority: RequirementPriority) => void;
  deleteRequirementCard: (cardId: string) => void;

  // Timer management
  startTimer: (durationSeconds: number) => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  stopTimer: () => void;

  // LLM configuration
  setLLMConfig: (provider: LLMProvider, apiKey: string, model: string) => void;

  // Creative brief
  setCreativeBrief: (brief: CreativeBrief) => void;
  updateBriefSection: (sectionKey: keyof CreativeBrief, content: string) => void;

  // Session management
  resetSession: () => void;
  forceUpdate: () => void;
}

// ============================================================================
// Default State Factory
// ============================================================================

function createDefaultState(): SessionState {
  return {
    sessionId: uuidv4(),
    createdAt: Date.now(),
    lastModified: Date.now(),
    currentPhase: 'project-context',
    completedPhases: [],
    timer: {
      duration: 0,
      isActive: false,
      startedAt: null,
      remainingSeconds: null,
      isPaused: false,
    },
    llmConfig: {
      provider: 'openai',
      apiKey: '',
      model: 'gpt-4',
    },
    projectContext: {
      projectName: '',
      projectDescription: '',
      stakeholders: '',
      constraints: '',
      timeline: '',
      duration: 60, // Default to 60 minutes
      completed: false,
    },
    customerDiscovery: {
      whoIsThisFor: {
        id: 'who-is-this-for',
        question: "Let's start with your audience. Who is this really for?",
        prompts: [
          'Tell me about your primary audience - who absolutely must connect with this for it to succeed?',
          "What about secondary audiences? Who else will encounter this, even if they're not the main target?",
          'Think about demographics: age range, profession, income level, education - what defines them?',
          'Now the psychographics: what do they value? What keeps them up at night? What are their aspirations?',
          'Where do they spend their time? What media do they consume? How do they make decisions?',
          'Who might see this and completely misunderstand it? Who could react negatively?',
          'What assumptions are they bringing to the table? What do they already believe about your brand or category?',
          "Is there anyone we're specifically NOT trying to reach? Sometimes who it's NOT for is just as important.",
        ],
        timeLimit: 180,
        answer: '',
      },
      whatIsBeingOffered: {
        id: 'what-is-being-offered',
        question:
          "Now, let's talk about what you're actually offering. What are we promoting here?",
        prompts: [
          "In the simplest terms possible, what is the thing we're creating this for? A product, service, event, idea, or behavior change?",
          'What makes this offering different from what already exists? Why does it deserve attention?',
          "What's the core benefit - not the features, but the real transformation or value people get?",
          'If you had to describe this in one sentence to a friend, what would you say?',
          'What problem does this solve, or what desire does it fulfill?',
          'Are we focusing on the tangibles they can see and touch, or something intangible like awareness, attitude shift, or action?',
          "What's the experience of using or engaging with this? Walk me through it.",
          'What are the proof points? Why should anyone believe this offering will deliver on its promise?',
        ],
        timeLimit: 180,
        answer: '',
      },
      whyNow: {
        id: 'why-now',
        question: "Here's a critical one: Why does this matter RIGHT NOW? What's the urgency?",
        prompts: [
          "What's happening in the world, your industry, or your organization that makes this timely?",
          'Is there a specific deadline, event, or milestone driving this? What happens if we miss it?',
          'Are there seasonal factors at play? Cultural moments? News cycles we can leverage or need to avoid?',
          "What's the competitive landscape? Are competitors doing something that forces our hand?",
          'Has there been a shift in customer behavior, expectations, or needs that makes this urgent?',
          "What's the risk of waiting? What opportunity might we lose if we don't act now?",
          'Is there internal momentum or pressure - leadership priorities, budget cycles, organizational change?',
          'If this could wait six months, would it? If not, why not? Make the case for NOW.',
        ],
        timeLimit: 120,
        answer: '',
      },
      whatIsSuccess: {
        id: 'what-is-success',
        question:
          "Finally, let's get specific about success. How will we actually know this worked?",
        prompts: [
          'What specific, measurable outcomes are we aiming for? Give me numbers if you can.',
          'Think about different types of success: awareness metrics, engagement, conversion, sales, behavior change - which matters most?',
          'What does success look like in the short term - the first week or month after launch?',
          'What about long-term success - three months out, six months, a year?',
          "Beyond the metrics, what's the qualitative success? What will people be saying, thinking, or feeling?",
          'How will we measure it? What tools, surveys, analytics, or feedback mechanisms will we use?',
          'What would make you personally feel proud of this? What would make your team celebrate?',
          "Let's flip it: what would failure look like? What outcome would mean we missed the mark?",
          "Are there any leading indicators we can track early to know if we're on the right path?",
          'Who gets to declare this a success? Whose approval or validation matters most?',
        ],
        timeLimit: 180,
        answer: '',
      },
      completed: false,
    },
    stickyNoteExercise: {
      focusPrompt: '',
      notes: [],
      clusters: [],
      completed: false,
    },
    spotExercises: {
      oneSentence: null,
      viewersInMirror: null,
      story: null,
      failures: [],
      promisesAndProofs: [],
      constraints: [],
      aiSynthesis: '',
      completed: false,
    },
    prioritization: {
      willHave: [],
      couldHave: [],
      wontHave: [],
      completed: false,
    },
    creativeBrief: null,
  };
}

// ============================================================================
// Context
// ============================================================================

export const SessionContext = createContext<SessionContextValue | undefined>(undefined);

// ============================================================================
// Provider Component
// ============================================================================

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<SessionState>(() => {
    const loaded = loadSession();
    return loaded || createDefaultState();
  });

  // Auto-save on state changes
  useEffect(() => {
    saveSession(state);
  }, [state]);

  // Validate current phase on mount - fix if stuck on removed phase
  useEffect(() => {
    const validPhases: SessionPhase[] = [
      'project-context',
      'customer-discovery',
      'prioritization',
      'synthesis-review',
      'brief-complete',
    ];
    
    const removedPhases: SessionPhase[] = [
      'sticky-notes-diverge',
      'sticky-notes-converge',
      'sticky-notes-naming',
      'sticky-notes-synthesis',
      'spot-exercises',
    ];

    // If current phase is one of the removed phases, reset to customer-discovery
    if (removedPhases.includes(state.currentPhase)) {
      console.log(`Resetting from removed phase ${state.currentPhase} to customer-discovery`);
      setState((prev) => ({ ...prev, currentPhase: 'customer-discovery' }));
    }
  }, []); // Only run once on mount

  // Update last modified timestamp on every state change
  const updateState = useCallback((updater: (prev: SessionState) => SessionState) => {
    setState((prev) => ({
      ...updater(prev),
      lastModified: Date.now(),
    }));
  }, []);

  // Phase management
  const setPhase = useCallback(
    (phase: SessionPhase) => {
      updateState((prev) => ({ ...prev, currentPhase: phase }));
    },
    [updateState]
  );

  const nextPhase = useCallback(() => {
    updateState((prev) => {
      // Only active phases (sticky notes phases temporarily shelved)
      const phases: SessionPhase[] = [
        'project-context',
        'customer-discovery',
        // 'sticky-notes-diverge',
        // 'sticky-notes-converge',
        // 'sticky-notes-naming',
        // 'sticky-notes-synthesis',
        // 'spot-exercises',
        'prioritization',
        'synthesis-review',
        'brief-complete',
      ];
      const currentIndex = phases.indexOf(prev.currentPhase);
      const nextIndex = Math.min(currentIndex + 1, phases.length - 1);
      return { ...prev, currentPhase: phases[nextIndex] };
    });
  }, [updateState]);

  const navigateToPhase = useCallback(
    (targetPhase: SessionPhase): boolean => {
      const phases: SessionPhase[] = [
        'project-context',
        'customer-discovery',
        'sticky-notes-diverge',
        'sticky-notes-converge',
        'sticky-notes-naming',
        'sticky-notes-synthesis',
        'spot-exercises',
        'prioritization',
        'synthesis-review',
        'brief-complete',
      ];

      const currentIndex = phases.indexOf(state.currentPhase);
      const targetIndex = phases.indexOf(targetPhase);

      // Progressive navigation rules
      if (targetIndex <= currentIndex) {
        // Can always go back
        setPhase(targetPhase);
        return true;
      } else if (targetIndex === currentIndex + 1) {
        // Can go forward one
        setPhase(targetPhase);
        return true;
      } else {
        // Cannot skip ahead
        return false;
      }
    },
    [state.currentPhase, setPhase]
  );

  // Project context
  const updateProjectContext = useCallback(
    (context: Partial<ProjectContext>) => {
      updateState((prev) => ({
        ...prev,
        projectContext: { ...prev.projectContext, ...context },
      }));
    },
    [updateState]
  );

  // Customer discovery
  const updateCustomerDiscovery = useCallback(
    (discovery: Partial<CustomerDiscovery>) => {
      updateState((prev) => ({
        ...prev,
        customerDiscovery: { ...prev.customerDiscovery, ...discovery },
      }));
    },
    [updateState]
  );

  // Sticky notes CRUD
  const addStickyNote = useCallback(
    (note: Omit<StickyNote, 'id' | 'createdAt'>) => {
      updateState((prev) => ({
        ...prev,
        stickyNoteExercise: {
          ...prev.stickyNoteExercise,
          notes: [
            ...prev.stickyNoteExercise.notes,
            { ...note, id: uuidv4(), createdAt: Date.now() },
          ],
        },
      }));
    },
    [updateState]
  );

  const updateStickyNote = useCallback(
    (id: string, updates: Partial<StickyNote>) => {
      updateState((prev) => ({
        ...prev,
        stickyNoteExercise: {
          ...prev.stickyNoteExercise,
          notes: prev.stickyNoteExercise.notes.map((note) =>
            note.id === id ? { ...note, ...updates } : note
          ),
        },
      }));
    },
    [updateState]
  );

  const deleteStickyNote = useCallback(
    (id: string) => {
      updateState((prev) => ({
        ...prev,
        stickyNoteExercise: {
          ...prev.stickyNoteExercise,
          notes: prev.stickyNoteExercise.notes.filter((note) => note.id !== id),
          clusters: prev.stickyNoteExercise.clusters.map((cluster) => ({
            ...cluster,
            noteIds: cluster.noteIds.filter((noteId) => noteId !== id),
          })),
        },
      }));
    },
    [updateState]
  );

  const moveStickyNote = useCallback(
    (id: string, x: number, y: number) => {
      updateStickyNote(id, { x, y });
    },
    [updateStickyNote]
  );

  const assignNoteToCluster = useCallback(
    (noteId: string, clusterId: string | null) => {
      updateState((prev) => {
        const note = prev.stickyNoteExercise.notes.find((n) => n.id === noteId);
        if (!note) return prev;

        const oldClusterId = note.clusterId;

        return {
          ...prev,
          stickyNoteExercise: {
            ...prev.stickyNoteExercise,
            notes: prev.stickyNoteExercise.notes.map((n) =>
              n.id === noteId ? { ...n, clusterId } : n
            ),
            clusters: prev.stickyNoteExercise.clusters.map((cluster) => {
              // Remove from old cluster
              if (cluster.id === oldClusterId) {
                return {
                  ...cluster,
                  noteIds: cluster.noteIds.filter((id) => id !== noteId),
                };
              }
              // Add to new cluster
              if (cluster.id === clusterId) {
                return {
                  ...cluster,
                  noteIds: [...cluster.noteIds, noteId],
                };
              }
              return cluster;
            }),
          },
        };
      });
    },
    [updateState]
  );

  // Clusters CRUD
  const addCluster = useCallback(
    (cluster: Omit<Cluster, 'id'>) => {
      updateState((prev) => ({
        ...prev,
        stickyNoteExercise: {
          ...prev.stickyNoteExercise,
          clusters: [...prev.stickyNoteExercise.clusters, { ...cluster, id: uuidv4() }],
        },
      }));
    },
    [updateState]
  );

  const updateCluster = useCallback(
    (id: string, updates: Partial<Cluster>) => {
      updateState((prev) => ({
        ...prev,
        stickyNoteExercise: {
          ...prev.stickyNoteExercise,
          clusters: prev.stickyNoteExercise.clusters.map((cluster) =>
            cluster.id === id ? { ...cluster, ...updates } : cluster
          ),
        },
      }));
    },
    [updateState]
  );

  const deleteCluster = useCallback(
    (id: string) => {
      updateState((prev) => ({
        ...prev,
        stickyNoteExercise: {
          ...prev.stickyNoteExercise,
          clusters: prev.stickyNoteExercise.clusters.filter((cluster) => cluster.id !== id),
          notes: prev.stickyNoteExercise.notes.map((note) =>
            note.clusterId === id ? { ...note, clusterId: null } : note
          ),
        },
      }));
    },
    [updateState]
  );

  const moveCluster = useCallback(
    (id: string, x: number, y: number) => {
      updateCluster(id, { x, y });
    },
    [updateCluster]
  );

  const resizeCluster = useCallback(
    (id: string, width: number, height: number) => {
      updateCluster(id, { width, height });
    },
    [updateCluster]
  );

  // Sticky note exercise
  const setFocusPrompt = useCallback(
    (prompt: string) => {
      updateState((prev) => ({
        ...prev,
        stickyNoteExercise: { ...prev.stickyNoteExercise, focusPrompt: prompt },
      }));
    },
    [updateState]
  );

  const setStickyNoteSynthesis = useCallback(
    (synthesis: string) => {
      updateState((prev) => ({
        ...prev,
        stickyNoteExercise: {
          ...prev.stickyNoteExercise,
          clusters: prev.stickyNoteExercise.clusters.map((cluster) =>
            cluster.aiSummary === '' ? { ...cluster, aiSummary: synthesis } : cluster
          ),
        },
      }));
    },
    [updateState]
  );

  // Spot exercises
  const updateSpotExercises = useCallback(
    (exercises: Partial<SpotExercises>) => {
      updateState((prev) => ({
        ...prev,
        spotExercises: { ...prev.spotExercises, ...exercises },
      }));
    },
    [updateState]
  );

  // Prioritization
  const addRequirementCard = useCallback(
    (card: Omit<RequirementCard, 'id'>) => {
      updateState((prev) => ({
        ...prev,
        prioritization: {
          ...prev.prioritization,
          willHave: [...prev.prioritization.willHave, { ...card, id: uuidv4() }],
        },
      }));
    },
    [updateState]
  );

  const moveRequirementCard = useCallback(
    (cardId: string, priority: RequirementPriority) => {
      updateState((prev) => {
        // Find the card in all priorities
        const allCards = [
          ...prev.prioritization.willHave,
          ...prev.prioritization.couldHave,
          ...prev.prioritization.wontHave,
        ];
        const card = allCards.find((c) => c.id === cardId);
        if (!card) return prev;

        // Remove from all priorities
        const willHave = prev.prioritization.willHave.filter((c) => c.id !== cardId);
        const couldHave = prev.prioritization.couldHave.filter((c) => c.id !== cardId);
        const wontHave = prev.prioritization.wontHave.filter((c) => c.id !== cardId);

        // Add to target priority
        if (priority === 'will') {
          willHave.push(card);
        } else if (priority === 'could') {
          couldHave.push(card);
        } else {
          wontHave.push(card);
        }

        return {
          ...prev,
          prioritization: { ...prev.prioritization, willHave, couldHave, wontHave },
        };
      });
    },
    [updateState]
  );

  const deleteRequirementCard = useCallback(
    (cardId: string) => {
      updateState((prev) => ({
        ...prev,
        prioritization: {
          ...prev.prioritization,
          willHave: prev.prioritization.willHave.filter((c) => c.id !== cardId),
          couldHave: prev.prioritization.couldHave.filter((c) => c.id !== cardId),
          wontHave: prev.prioritization.wontHave.filter((c) => c.id !== cardId),
        },
      }));
    },
    [updateState]
  );

  // Timer management
  const startTimer = useCallback(
    (durationSeconds: number) => {
      updateState((prev) => ({
        ...prev,
        timer: {
          duration: durationSeconds,
          isActive: true,
          startedAt: Date.now(),
          remainingSeconds: durationSeconds,
          isPaused: false,
        },
      }));
    },
    [updateState]
  );

  const pauseTimer = useCallback(() => {
    updateState((prev) => ({
      ...prev,
      timer: { ...prev.timer, isPaused: true },
    }));
  }, [updateState]);

  const resumeTimer = useCallback(() => {
    updateState((prev) => ({
      ...prev,
      timer: { ...prev.timer, isPaused: false },
    }));
  }, [updateState]);

  const stopTimer = useCallback(() => {
    updateState((prev) => ({
      ...prev,
      timer: {
        duration: 0,
        isActive: false,
        startedAt: null,
        remainingSeconds: null,
        isPaused: false,
      },
    }));
  }, [updateState]);

  // LLM configuration
  const setLLMConfig = useCallback(
    (provider: LLMProvider, apiKey: string, model: string) => {
      updateState((prev) => ({
        ...prev,
        llmConfig: { provider, apiKey, model },
      }));
    },
    [updateState]
  );

  // Creative brief
  const setCreativeBrief = useCallback(
    (brief: CreativeBrief) => {
      updateState((prev) => ({ ...prev, creativeBrief: brief }));
    },
    [updateState]
  );

  const updateBriefSection = useCallback(
    (sectionKey: keyof CreativeBrief, content: string) => {
      updateState((prev) => {
        if (!prev.creativeBrief) return prev;
        return {
          ...prev,
          creativeBrief: {
            ...prev.creativeBrief,
            [sectionKey]:
              typeof prev.creativeBrief[sectionKey] === 'object'
                ? { ...prev.creativeBrief[sectionKey], content }
                : prev.creativeBrief[sectionKey],
          },
        };
      });
    },
    [updateState]
  );

  // Session management
  const resetSession = useCallback(() => {
    setState(createDefaultState());
  }, []);

  const forceUpdate = useCallback(() => {
    updateState((prev) => ({ ...prev }));
  }, [updateState]);

  // Context value
  const value = useMemo<SessionContextValue>(
    () => ({
      state,
      setPhase,
      nextPhase,
      navigateToPhase,
      updateProjectContext,
      updateCustomerDiscovery,
      addStickyNote,
      updateStickyNote,
      deleteStickyNote,
      moveStickyNote,
      assignNoteToCluster,
      addCluster,
      updateCluster,
      deleteCluster,
      moveCluster,
      resizeCluster,
      setFocusPrompt,
      setStickyNoteSynthesis,
      updateSpotExercises,
      addRequirementCard,
      moveRequirementCard,
      deleteRequirementCard,
      startTimer,
      pauseTimer,
      resumeTimer,
      stopTimer,
      setLLMConfig,
      setCreativeBrief,
      updateBriefSection,
      resetSession,
      forceUpdate,
    }),
    [
      state,
      setPhase,
      nextPhase,
      navigateToPhase,
      updateProjectContext,
      updateCustomerDiscovery,
      addStickyNote,
      updateStickyNote,
      deleteStickyNote,
      moveStickyNote,
      assignNoteToCluster,
      addCluster,
      updateCluster,
      deleteCluster,
      moveCluster,
      resizeCluster,
      setFocusPrompt,
      setStickyNoteSynthesis,
      updateSpotExercises,
      addRequirementCard,
      moveRequirementCard,
      deleteRequirementCard,
      startTimer,
      pauseTimer,
      resumeTimer,
      stopTimer,
      setLLMConfig,
      setCreativeBrief,
      updateBriefSection,
      resetSession,
      forceUpdate,
    ]
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}
