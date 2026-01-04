import { useState, useEffect } from 'react';
import { useSession } from '../../hooks/useSession';
import { useToast } from '../../contexts/ToastContext';
import {
  CheckCircle2,
  Edit3,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Clock,
  AlertCircle
} from 'lucide-react';
import type { ProjectContext, FieldMetadata } from '../../types';

/**
 * Project Review Page - Review and edit AI-generated project context
 * Displays AI-generated project information with confidence indicators
 * Allows manual editing and regeneration
 */
export function ProjectReviewPage() {
  const { state, updateProjectContext, setPhase } = useSession();
  const { addToast } = useToast();

  // Local state for form inputs
  const [projectName, setProjectName] = useState(state.projectContext.projectName);
  const [projectDescription, setProjectDescription] = useState(
    state.projectContext.projectDescription
  );
  const [stakeholders, setStakeholders] = useState(state.projectContext.stakeholders);
  const [constraints, setConstraints] = useState(state.projectContext.constraints);
  const [timeline, setTimeline] = useState(state.projectContext.timeline);
  const [duration, setDuration] = useState(state.projectContext.duration);
  const [durationError, setDurationError] = useState('');

  // Track which fields have been edited
  const [editedFields, setEditedFields] = useState<Set<keyof ProjectContext>>(new Set());

  // Update local state when session state changes
  useEffect(() => {
    setProjectName(state.projectContext.projectName);
    setProjectDescription(state.projectContext.projectDescription);
    setStakeholders(state.projectContext.stakeholders);
    setConstraints(state.projectContext.constraints);
    setTimeline(state.projectContext.timeline);
    setDuration(state.projectContext.duration);
  }, [state.projectContext]);

  // Validate duration input
  const validateDuration = (value: number): boolean => {
    if (!value || value < 15) {
      setDurationError('Workshop duration must be at least 15 minutes');
      return false;
    }
    if (value > 480) {
      setDurationError('Workshop duration cannot exceed 8 hours (480 minutes)');
      return false;
    }
    setDurationError('');
    return true;
  };

  // Handle duration input change
  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numValue = value === '' ? 0 : parseInt(value, 10);
    setDuration(numValue);
    setEditedFields((prev) => new Set(prev).add('duration'));

    if (value !== '') {
      validateDuration(numValue);
    } else {
      setDurationError('');
    }
  };

  // Track field edits
  const handleFieldEdit = (field: keyof ProjectContext, value: string | number) => {
    setEditedFields((prev) => new Set(prev).add(field));

    // Update local state based on field
    switch (field) {
      case 'projectName':
        setProjectName(value as string);
        break;
      case 'projectDescription':
        setProjectDescription(value as string);
        break;
      case 'stakeholders':
        setStakeholders(value as string);
        break;
      case 'constraints':
        setConstraints(value as string);
        break;
      case 'timeline':
        setTimeline(value as string);
        break;
    }
  };

  // Get confidence level for a field
  const getConfidence = (field: keyof ProjectContext): number => {
    return state.projectContextMetadata.fieldSources[field]?.confidence || 0;
  };

  // Get confidence badge
  const getConfidenceBadge = (confidence: number) => {
    if (confidence >= 0.8) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          High Confidence
        </span>
      );
    } else if (confidence >= 0.5) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          Medium Confidence
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          Low Confidence
        </span>
      );
    }
  };

  // Get source indicator
  const getSourceIndicator = (field: keyof ProjectContext) => {
    const fieldMeta = state.projectContextMetadata.fieldSources[field];
    const isEdited = editedFields.has(field);

    if (isEdited) {
      return (
        <span className="inline-flex items-center text-xs text-blue-600">
          <Edit3 className="w-3 h-3 mr-1" />
          Edited
        </span>
      );
    } else if (fieldMeta?.source === 'ai') {
      return (
        <span className="inline-flex items-center text-xs text-purple-600">
          <Sparkles className="w-3 h-3 mr-1" />
          AI Generated
        </span>
      );
    }
    return null;
  };

  // Calculate average confidence
  const calculateAverageConfidence = (): number => {
    const fields = Object.keys(state.projectContextMetadata.fieldSources) as (keyof ProjectContext)[];
    if (fields.length === 0) return 0;

    const sum = fields.reduce((acc, field) => {
      return acc + (state.projectContextMetadata.fieldSources[field]?.confidence || 0);
    }, 0);

    return sum / fields.length;
  };

  // Handle regenerate all
  const handleRegenerateAll = async () => {
    addToast('Regeneration feature coming soon', 'info', 3000);
    // TODO: Implement AI regeneration
    // This would call the AI service again with the original prompt
    // and update all fields with new values
  };

  // Handle continue to discovery
  const handleContinue = () => {
    // Validate duration before proceeding
    if (!validateDuration(duration)) {
      addToast('Please fix the duration error before continuing', 'error', 3000);
      return;
    }

    // Save all changes to session
    updateProjectContext({
      projectName,
      projectDescription,
      stakeholders,
      constraints,
      timeline,
      duration,
      completed: true,
    });

    // Track user edits in metadata
    // TODO: Update projectContextMetadata.userEdits with edit history

    addToast('Project context saved successfully', 'success', 2000);
    setPhase('customer-discovery');
  };

  // Handle back to AI prompt
  const handleBack = () => {
    setPhase('ai-prompt');
  };

  // Calculate estimated end time
  const calculateEstimatedEndTime = (): string => {
    if (!duration || duration <= 0) return '';
    const now = new Date();
    const endTime = new Date(now.getTime() + duration * 60000);

    return endTime.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const avgConfidence = calculateAverageConfidence();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-12 fade-in">
          <div
            className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 elevated"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            <CheckCircle2 className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Review AI-Generated Context</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto text-balance">
            Review and refine the project information generated from your prompt. Edit any field to
            customize it to your needs.
          </p>
        </div>

        {/* Summary Card */}
        <div className="card scale-in mb-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Processing Summary</h2>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-500" />
                  <span>
                    <strong>AI Model:</strong>{' '}
                    {state.aiPromptState.modelUsed || state.llmConfig.model}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-500" />
                  <span>
                    <strong>Processing Time:</strong>{' '}
                    {state.aiPromptState.processingTime
                      ? `${(state.aiPromptState.processingTime / 1000).toFixed(2)}s`
                      : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600 mb-2">Overall Confidence</div>
              {getConfidenceBadge(avgConfidence)}
            </div>
          </div>

          {/* Original Prompt */}
          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Original Prompt</h3>
            <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 max-h-32 overflow-y-auto">
              {state.aiPromptState.originalPrompt || 'No prompt recorded'}
            </div>
          </div>
        </div>

        {/* Editable Fields */}
        <div className="card scale-in">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Project Information</h2>
            <button
              onClick={handleRegenerateAll}
              className="btn btn-secondary flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Regenerate All
            </button>
          </div>

          <div className="space-y-6">
            {/* Project Name */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="projectName" className="form-label mb-0">
                  Project Name <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-3">
                  {getSourceIndicator('projectName')}
                  {getConfidenceBadge(getConfidence('projectName'))}
                </div>
              </div>
              <input
                type="text"
                id="projectName"
                value={projectName}
                onChange={(e) => handleFieldEdit('projectName', e.target.value)}
                placeholder="Product Launch Video Campaign"
                className="form-input"
              />
            </div>

            {/* Project Description */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="projectDescription" className="form-label mb-0">
                  Project Description <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-3">
                  {getSourceIndicator('projectDescription')}
                  {getConfidenceBadge(getConfidence('projectDescription'))}
                </div>
              </div>
              <textarea
                id="projectDescription"
                value={projectDescription}
                onChange={(e) => handleFieldEdit('projectDescription', e.target.value)}
                placeholder="Detailed description of the project..."
                rows={4}
                className="form-textarea"
              />
              <p className="text-sm text-gray-500 mt-1">
                This will appear in the brief's Project Overview section
              </p>
            </div>

            {/* Stakeholders */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="stakeholders" className="form-label mb-0">
                  Key Stakeholders <span className="text-gray-400">(Optional)</span>
                </label>
                <div className="flex items-center gap-3">
                  {getSourceIndicator('stakeholders')}
                  {stakeholders && getConfidenceBadge(getConfidence('stakeholders'))}
                </div>
              </div>
              <textarea
                id="stakeholders"
                value={stakeholders}
                onChange={(e) => handleFieldEdit('stakeholders', e.target.value)}
                placeholder="Key stakeholders and decision makers..."
                rows={2}
                className="form-textarea"
              />
            </div>

            {/* Constraints */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="constraints" className="form-label mb-0">
                  Known Constraints <span className="text-gray-400">(Optional)</span>
                </label>
                <div className="flex items-center gap-3">
                  {getSourceIndicator('constraints')}
                  {constraints && getConfidenceBadge(getConfidence('constraints'))}
                </div>
              </div>
              <textarea
                id="constraints"
                value={constraints}
                onChange={(e) => handleFieldEdit('constraints', e.target.value)}
                placeholder="Budget, brand guidelines, technical requirements..."
                rows={3}
                className="form-textarea"
              />
            </div>

            {/* Timeline */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="timeline" className="form-label mb-0">
                  Timeline <span className="text-gray-400">(Optional)</span>
                </label>
                <div className="flex items-center gap-3">
                  {getSourceIndicator('timeline')}
                  {timeline && getConfidenceBadge(getConfidence('timeline'))}
                </div>
              </div>
              <input
                type="text"
                id="timeline"
                value={timeline}
                onChange={(e) => handleFieldEdit('timeline', e.target.value)}
                placeholder="Kickoff: Feb 1 | First draft: Feb 20 | Final delivery: Mar 10"
                className="form-input"
              />
            </div>

            {/* Workshop Duration */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="duration" className="form-label mb-0">
                  Workshop Duration <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-3">
                  {getSourceIndicator('duration')}
                  {getConfidenceBadge(getConfidence('duration'))}
                </div>
              </div>
              <div className="space-y-2">
                <input
                  type="number"
                  id="duration"
                  value={duration || ''}
                  onChange={handleDurationChange}
                  placeholder="90"
                  min="15"
                  max="480"
                  className={`form-input ${durationError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                />
                {durationError && (
                  <div className="flex items-center gap-2 text-sm text-red-500">
                    <AlertCircle className="w-4 h-4" />
                    <span>{durationError}</span>
                  </div>
                )}
                {duration && duration > 0 && !durationError && (
                  <p className="text-sm text-gray-500">
                    Estimated completion time:{' '}
                    <span className="font-semibold text-gray-700">
                      {calculateEstimatedEndTime()}
                    </span>
                  </p>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Enter workshop duration in minutes (15-480 minutes). This helps schedule the
                discovery workshop effectively.
              </p>
            </div>
          </div>

          {/* Help Text */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start gap-3">
              <Edit3 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-1">Edit Manually</h3>
                <p className="text-sm text-blue-800">
                  Feel free to edit any field above. Your changes will be tracked and saved
                  automatically. The AI-generated values serve as a starting point that you can
                  refine based on your specific needs.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex items-center justify-between">
            <button
              onClick={handleBack}
              className="btn btn-secondary flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Prompt
            </button>
            <button
              onClick={handleContinue}
              className="btn btn-primary flex items-center gap-2"
            >
              Continue to Discovery
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Your edits are automatically saved. You can return to this page anytime.</p>
        </div>
      </div>
    </div>
  );
}
