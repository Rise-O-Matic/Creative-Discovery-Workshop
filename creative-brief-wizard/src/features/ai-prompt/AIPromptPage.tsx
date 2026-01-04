import { useState, useRef, useEffect } from 'react';
import { useSession } from '../../hooks/useSession';
import { useToast } from '../../contexts/ToastContext';
import { Sparkles, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import type { LLMProvider } from '../../types';

/**
 * AI Prompt Page - Entry point for AI-powered project brief generation
 * Allows users to describe their project in natural language
 */
export function AIPromptPage() {
  const { state, setLLMConfig, setPhase } = useSession();
  const { addToast } = useToast();

  // Form state
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showApiConfig, setShowApiConfig] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // API Configuration state
  const [provider, setProvider] = useState<LLMProvider>(state.llmConfig.provider);
  const [apiKey, setApiKey] = useState(state.llmConfig.apiKey);
  const [model, setModel] = useState(state.llmConfig.model);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [prompt]);

  // Model options based on provider
  const getModelOptions = (): string[] => {
    if (provider === 'openai') {
      return ['gpt-4', 'gpt-4-turbo', 'gpt-3.5-turbo'];
    } else {
      return [
        'claude-3-5-sonnet-20241022',
        'claude-3-opus-20240229',
        'claude-3-sonnet-20240229',
      ];
    }
  };

  // Example prompts
  const examplePrompts = [
    {
      title: 'Video Production',
      text: "We need a 60-second promotional video to announce our new AI-powered productivity app. The video will be used across social media, our website, and at industry conferences. We want to showcase the app's key features while connecting emotionally with busy professionals who struggle with task management. Our target audience is project managers and team leads aged 28-45 in tech and consulting industries.",
    },
    {
      title: 'Website Redesign',
      text: 'We are redesigning our e-commerce website to improve conversion rates and mobile experience. The site needs to feel modern, trustworthy, and easy to navigate. We sell sustainable home goods to environmentally conscious millennials. Key goals include reducing cart abandonment, improving product discovery, and showcasing our sustainability story. Budget is $75k with a 3-month timeline.',
    },
    {
      title: 'Marketing Campaign',
      text: "Launch campaign for our new plant-based protein bar targeting fitness enthusiasts and health-conscious consumers. We want to position ourselves as the premium, science-backed alternative to existing brands. Campaign should span social media, influencer partnerships, in-store displays, and digital ads. Looking to achieve 10,000 trial purchases in the first quarter and establish brand awareness in the natural foods space.",
    },
    {
      title: 'Brand Identity',
      text: "Rebranding project for a 15-year-old consulting firm transitioning from traditional strategy work to AI and digital transformation services. Need new logo, visual identity system, messaging framework, and website. Want to maintain credibility with enterprise clients while appealing to innovative startups. The rebrand should feel forward-thinking but not trendy, professional but not corporate.",
    },
  ];

  // Handle example prompt click
  const handleExampleClick = (exampleText: string) => {
    setPrompt(exampleText);
  };

  // Save API configuration
  const handleSaveConfig = () => {
    if (!apiKey.trim()) {
      addToast('Please enter an API key', 'error', 3000);
      return;
    }

    setLLMConfig(provider, apiKey, model);
    addToast('API configuration saved successfully', 'success', 3000);
    setShowApiConfig(false);
  };

  // Handle provider change
  const handleProviderChange = (newProvider: LLMProvider) => {
    setProvider(newProvider);
    // Set default model for the provider
    if (newProvider === 'openai') {
      setModel('gpt-4');
    } else {
      setModel('claude-3-5-sonnet-20241022');
    }
  };

  // Submit AI prompt
  const handleSubmit = async () => {
    // Validation
    if (!prompt.trim()) {
      addToast('Please enter a project description', 'error', 3000);
      return;
    }

    if (!state.llmConfig.apiKey) {
      addToast('Please configure your API key first', 'error', 3000);
      setShowApiConfig(true);
      return;
    }

    setIsProcessing(true);

    try {
      // TODO: Implement actual AI processing
      // This will call the LLM API to process the prompt and populate project context
      // For now, we'll simulate the process
      await new Promise((resolve) => setTimeout(resolve, 2000));

      addToast(
        'AI processing complete! Review the generated project information.',
        'success',
        4000
      );

      // Navigate to project review phase
      setPhase('project-review');
    } catch (error) {
      console.error('AI processing error:', error);
      addToast(
        error instanceof Error ? error.message : 'Failed to process your request. Please try again.',
        'error',
        5000
      );
    } finally {
      setIsProcessing(false);
    }
  };

  // Character count
  const charCount = prompt.length;
  const recommendedMin = 100;
  const recommendedMax = 1000;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container">
        {/* Hero Section */}
        <div className="text-center mb-12 fade-in">
          <div
            className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 elevated"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AI-Powered Creative Brief Generator
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto text-balance">
            Describe your creative project in your own words, and let AI help structure your
            discovery workshop
          </p>
        </div>

        {/* Main Prompt Input Area */}
        <div className="card scale-in mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Describe Your Project</h2>
          <p className="text-gray-600 mb-6">
            Tell us about your creative project. Include details about what you are creating, who
            it is for, your goals, constraints, timeline, and anything else that seems relevant.
          </p>

          <div className="space-y-4">
            <div>
              <textarea
                ref={textareaRef}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Example: We need a 60-second promotional video for our new mobile app launch. The video should appeal to busy professionals aged 25-40 who struggle with productivity. We want to highlight our AI-powered features and build emotional connection. Budget is $50k, and we need the final video in 6 weeks for our conference debut..."
                className="form-textarea min-h-[200px] resize-none overflow-hidden"
                disabled={isProcessing}
                style={{
                  maxHeight: '500px',
                  overflowY: prompt.length > 500 ? 'auto' : 'hidden',
                }}
              />

              {/* Character Count */}
              <div className="flex justify-between items-center mt-2">
                <p className="text-sm text-gray-500">
                  {charCount < recommendedMin && (
                    <span className="text-amber-600">
                      Add more details for better results (min {recommendedMin} characters
                      recommended)
                    </span>
                  )}
                  {charCount >= recommendedMin && charCount <= recommendedMax && (
                    <span className="text-green-600">Good level of detail</span>
                  )}
                  {charCount > recommendedMax && (
                    <span className="text-gray-600">
                      Very detailed - consider focusing on key points
                    </span>
                  )}
                </p>
                <p className="text-sm text-gray-400">{charCount} characters</p>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                onClick={handleSubmit}
                disabled={isProcessing || !prompt.trim()}
                className="btn btn-primary flex items-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing your request...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generate Project Brief
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Example Prompts Section */}
        <div className="card scale-in mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Example Prompts</h3>
          <p className="text-sm text-gray-600 mb-6">
            Not sure where to start? Click any example below to use it as a template.
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            {examplePrompts.map((example, index) => (
              <button
                key={index}
                onClick={() => handleExampleClick(example.text)}
                disabled={isProcessing}
                className="text-left p-4 rounded-lg border-2 border-gray-200 hover:border-primary hover:bg-blue-50 transition-all duration-200"
              >
                <h4 className="font-semibold text-gray-900 mb-2">{example.title}</h4>
                <p className="text-sm text-gray-600 line-clamp-3">{example.text}</p>
              </button>
            ))}
          </div>
        </div>

        {/* API Configuration Section (Collapsible) */}
        <div className="card scale-in">
          <button
            onClick={() => setShowApiConfig(!showApiConfig)}
            className="w-full flex items-center justify-between text-left"
          >
            <div>
              <h3 className="text-xl font-bold text-gray-900">API Configuration</h3>
              <p className="text-sm text-gray-600 mt-1">
                {state.llmConfig.apiKey
                  ? `Configured: ${state.llmConfig.provider} - ${state.llmConfig.model}`
                  : 'Set up your AI provider to get started'}
              </p>
            </div>
            {showApiConfig ? (
              <ChevronUp className="w-6 h-6 text-gray-400" />
            ) : (
              <ChevronDown className="w-6 h-6 text-gray-400" />
            )}
          </button>

          {showApiConfig && (
            <div className="mt-6 space-y-6 border-t border-gray-200 pt-6">
              {/* Provider Selection */}
              <div>
                <label htmlFor="provider" className="form-label">
                  AI Provider <span className="text-red-500">*</span>
                </label>
                <select
                  id="provider"
                  value={provider}
                  onChange={(e) => handleProviderChange(e.target.value as LLMProvider)}
                  className="form-input"
                  disabled={isProcessing}
                >
                  <option value="openai">OpenAI</option>
                  <option value="anthropic">Anthropic (Claude)</option>
                </select>
              </div>

              {/* API Key Input */}
              <div>
                <label htmlFor="apiKey" className="form-label">
                  API Key <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  id="apiKey"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder={
                    provider === 'openai' ? 'sk-...' : 'sk-ant-...'
                  }
                  className="form-input"
                  disabled={isProcessing}
                />
                <p className="text-sm text-gray-500 mt-1">
                  Your API key is stored locally in your browser and never sent to our servers.
                </p>
              </div>

              {/* Model Selection */}
              <div>
                <label htmlFor="model" className="form-label">
                  Model <span className="text-red-500">*</span>
                </label>
                <select
                  id="model"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="form-input"
                  disabled={isProcessing}
                >
                  {getModelOptions().map((modelOption) => (
                    <option key={modelOption} value={modelOption}>
                      {modelOption}
                    </option>
                  ))}
                </select>
              </div>

              {/* Save Configuration Button */}
              <div className="flex justify-end">
                <button
                  onClick={handleSaveConfig}
                  disabled={isProcessing}
                  className="btn btn-primary"
                >
                  Save Configuration
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            AI will analyze your description and pre-populate the discovery workshop with relevant
            context, saving you time while ensuring nothing important is missed.
          </p>
        </div>
      </div>
    </div>
  );
}
