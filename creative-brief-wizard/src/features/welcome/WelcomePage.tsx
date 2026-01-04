import { useState } from 'react';
import { useSession } from '../../hooks/useSession';
import { Sparkles, Loader2 } from 'lucide-react';
import { WorkshopAutoFillService } from '../../services/ai/WorkshopAutoFillService';

/**
 * Welcome screen - minimal prompt-based interface with AI auto-fill
 * Inspired by modern AI tools like ChatGPT, Gemini, and Figma Make
 */
export function WelcomePage() {
  const { state, updateProjectContext, updateCustomerDiscovery, addStickyNote, setPhase } = useSession();
  const [projectPrompt, setProjectPrompt] = useState('');
  const [duration, setDuration] = useState(60);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleBegin = async () => {
    setError(null);
    setIsGenerating(true);

    try {
      // Get API key from environment
      const apiKey = import.meta.env.VITE_OPENAI_API_KEY || 'mock';
      
      // Create auto-fill service
      const autoFillService = new WorkshopAutoFillService(apiKey);
      
      // Generate content from prompt
      const result = await autoFillService.generateFromPrompt(projectPrompt);
      
      // Apply results to session
      const updates = autoFillService.applyToSession(result, state);
      
      // Update all sections
      if (updates.projectContext) {
        updateProjectContext({
          ...updates.projectContext,
          duration,
          completed: true,
        });
      }
      
      if (updates.customerDiscovery) {
        updateCustomerDiscovery(updates.customerDiscovery);
      }
      
      if (updates.stickyNotesDiverge && updates.stickyNotesDiverge.notes) {
        // Add each sticky note individually
        updates.stickyNotesDiverge.notes.forEach((note) => {
          addStickyNote(note);
        });
      }
      
      // Navigate to discovery phase
      setPhase('customer-discovery');
    } catch (err) {
      console.error('Auto-fill error:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate workshop content');
      setIsGenerating(false);
    }
  };

  const canProceed = projectPrompt.trim().length > 10 && !isGenerating;

  // Example prompts for inspiration
  const examplePrompts = [
    "Create a video campaign for a new AI productivity app launching at a tech conference",
    "Design a brand identity for an eco-friendly water bottle startup targeting millennials",
    "Develop a social media campaign for a local coffee shop's seasonal menu launch",
    "Build a website for a freelance photographer specializing in wedding photography",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex flex-col">
      {/* Header */}
      <header className="w-full px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: 'var(--color-primary)' }}
            >
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-gray-900">Creative Discovery Workshop</span>
          </div>
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            {showAdvanced ? 'Simple' : 'Advanced'}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 pb-20">
        <div className="max-w-3xl w-full">
          {/* Hero Text */}
          <div className="text-center mb-12 fade-in">
            <h1 className="text-5xl font-bold text-gray-900 mb-4 tracking-tight">
              Discover your creative brief
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Describe your project in a few sentences. Our AI will generate a complete workshop
              with intelligent suggestions for you to review and refine.
            </p>
          </div>

          {/* Prompt Input */}
          <div className="scale-in">
            <div className="relative">
              <textarea
                value={projectPrompt}
                onChange={(e) => setProjectPrompt(e.target.value)}
                disabled={isGenerating}
                placeholder="Describe your creative project... (e.g., 'Create a video campaign for a new AI productivity app launching at a tech conference')"
                className={`w-full px-6 py-5 text-base rounded-2xl border-2 ${
                  error ? 'border-red-300' : 'border-gray-200'
                } focus:border-blue-500 focus:outline-none resize-none transition-all shadow-sm hover:shadow-md focus:shadow-lg ${
                  isGenerating ? 'bg-gray-50 cursor-not-allowed' : ''
                }`}
                rows={4}
                style={{ fontFamily: 'inherit' }}
              />
              
              {/* Character count */}
              <div className="absolute bottom-4 right-4 text-xs text-gray-400">
                {projectPrompt.length} characters
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">{error}</p>
                <p className="text-xs text-red-600 mt-1">
                  Try simplifying your prompt or check your internet connection.
                </p>
              </div>
            )}

            {/* Duration Selector (Simple) */}
            {!showAdvanced && !isGenerating && (
              <div className="mt-4 flex items-center justify-center gap-2">
                <label className="text-sm text-gray-600">Workshop duration:</label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(parseInt(e.target.value))}
                  className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                >
                  <option value={30}>30 minutes</option>
                  <option value={45}>45 minutes</option>
                  <option value={60}>60 minutes</option>
                  <option value={90}>90 minutes</option>
                  <option value={120}>2 hours</option>
                </select>
              </div>
            )}

            {/* Advanced Options */}
            {showAdvanced && !isGenerating && (
              <div className="mt-6 p-6 bg-white rounded-xl border border-gray-200 space-y-4 slide-in">
                <h3 className="font-semibold text-gray-900 text-sm">Advanced Options</h3>
                
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Workshop Duration (minutes)
                  </label>
                  <input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(parseInt(e.target.value) || 60)}
                    min="15"
                    max="480"
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* Action Button */}
            <div className="mt-6 flex justify-center">
              <button
                onClick={handleBegin}
                disabled={!canProceed}
                className={`px-8 py-4 rounded-xl font-semibold text-base transition-all flex items-center gap-2 ${
                  canProceed
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-100'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating with AI...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generate Workshop with AI
                  </>
                )}
              </button>
            </div>

            {/* Helper Text */}
            {!canProceed && !isGenerating && projectPrompt.length > 0 && (
              <p className="mt-3 text-center text-sm text-gray-500">
                Please provide a bit more detail (at least 10 characters)
              </p>
            )}

            {/* AI Generation Info */}
            {isGenerating && (
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600">
                  Our AI is analyzing your project and generating personalized workshop content...
                </p>
                <p className="text-xs text-gray-500 mt-1">This usually takes 5-10 seconds</p>
              </div>
            )}
          </div>

          {/* Example Prompts */}
          {!isGenerating && (
            <div className="mt-16 fade-in">
              <p className="text-center text-sm text-gray-500 mb-4">Try an example:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {examplePrompts.map((example, index) => (
                  <button
                    key={index}
                    onClick={() => setProjectPrompt(example)}
                    className="text-left px-4 py-3 text-sm text-gray-700 bg-white border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all"
                  >
                    "{example}"
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full px-6 py-4 text-center">
        <p className="text-xs text-gray-500">
          {isGenerating 
            ? 'Powered by OpenAI • Generating your personalized workshop...'
            : 'Powered by OpenAI • Generate a complete workshop in seconds'}
        </p>
      </footer>
    </div>
  );
}
