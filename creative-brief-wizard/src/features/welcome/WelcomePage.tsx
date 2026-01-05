import { useState } from 'react';
import { useSession } from '../../hooks/useSession';
import { Sparkles, Loader2 } from 'lucide-react';

/**
 * Welcome screen - minimal prompt-based interface
 * Generates complete creative brief from a simple prompt
 */
export function WelcomePage() {
  const { state, updateProjectContext, setCreativeBrief, updateCustomerDiscovery, setPhase } = useSession();
  const [projectPrompt, setProjectPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const examplePrompts = [
    "Create a video campaign for a new AI productivity app launching at a tech conference",
    "Design a brand identity for an eco-friendly water bottle startup targeting millennials",
    "Develop a social media campaign for a local coffee shop's seasonal menu launch",
    "Build a website for a freelance photographer specializing in wedding photography",
  ];

  const handleGenerate = async () => {
    if (!projectPrompt.trim()) {
      setError('Please enter a project description');
      return;
    }

    setError(null);
    setIsGenerating(true);

    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
      const response = await fetch(`${backendUrl}/api/generate-brief`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: projectPrompt }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate brief');
      }

      const result = await response.json();

      // Update project context
      updateProjectContext({
        projectName: result.projectName,
        projectDescription: projectPrompt,
        completed: true,
      });

      // Store the generated brief
      setCreativeBrief({
        overview: result.brief.overview,
        audience: result.brief.audience,
        keyMessage: result.brief.keyMessage,
        objectives: Array.isArray(result.brief.objectives) 
          ? `<ul>${result.brief.objectives.map((obj: string) => `<li>${obj}</li>`).join('')}</ul>`
          : result.brief.objectives,
        deliverables: result.brief.deliverables,
        toneAndStyle: result.brief.toneAndStyle,
        timeline: result.brief.timeline,
        successMetrics: Array.isArray(result.brief.successMetrics)
          ? `<ul>${result.brief.successMetrics.map((metric: string) => `<li>${metric}</li>`).join('')}</ul>`
          : result.brief.successMetrics,
      });

      // Store refinement question answers
      if (result.refinementQuestions) {
        const updatedQuestions = state.customerDiscovery.granularQuestions.map(q => ({
          ...q,
          answer: result.refinementQuestions[q.id] || '',
        }));
        updateCustomerDiscovery({
          granularQuestions: updatedQuestions,
          completed: false,
        });
      }

      // Move to brief editor
      setPhase('brief-complete');
    } catch (err) {
      console.error('Error generating brief:', err);
      setError('Failed to generate brief. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExampleClick = (example: string) => {
    setProjectPrompt(example);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        {/* Header */}
        <div className="text-center mb-12 fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500 rounded-2xl mb-6">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Creative Discovery Workshop
          </h1>
          <p className="text-xl text-gray-600">
            Discover your creative brief
          </p>
        </div>

        {/* Main Prompt Area */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6 fade-in-up">
          <p className="text-gray-700 mb-6 text-center">
            Describe your project in a few sentences. Our AI will generate a complete workshop with intelligent suggestions for you to review and refine.
          </p>

          <div className="space-y-4">
            <div className="relative">
              <textarea
                value={projectPrompt}
                onChange={(e) => setProjectPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                    handleGenerate();
                  }
                }}
                placeholder="Describe your creative project... (e.g., 'Create a video campaign for a new AI productivity app launching at a tech conference')"
                className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-lg transition-all"
                rows={4}
                disabled={isGenerating}
              />
              <div className="absolute bottom-4 right-4 text-sm text-gray-400">
                {projectPrompt.length} characters
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            <button
              onClick={handleGenerate}
              disabled={isGenerating || !projectPrompt.trim()}
              className="w-full px-8 py-4 bg-blue-500 text-white rounded-xl hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold text-lg flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating your brief...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate Creative Brief
                </>
              )}
            </button>
          </div>
        </div>

        {/* Example Prompts */}
        <div className="text-center fade-in-up" style={{ animationDelay: '0.2s' }}>
          <p className="text-sm text-gray-600 mb-4">Try an example:</p>
          <div className="flex flex-wrap gap-3 justify-center">
            {examplePrompts.map((example, index) => (
              <button
                key={index}
                onClick={() => handleExampleClick(example)}
                disabled={isGenerating}
                className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all text-sm text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow"
              >
                "{example}"
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-sm text-gray-500 fade-in-up" style={{ animationDelay: '0.4s' }}>
          Powered by OpenAI • Generate a complete workshop in seconds
        </div>
      </div>
    </div>
  );
}
