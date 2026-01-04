import { useState } from 'react';
import { useSession } from '../../hooks/useSession';
import { Clock, Sparkles, Users, FileText } from 'lucide-react';

/**
 * Welcome screen - introduces the app and collects initial project context
 * First screen users see when starting a new brief
 */
export function WelcomePage() {
  const { state, updateProjectContext, setPhase } = useSession();
  const [projectName, setProjectName] = useState(state.projectContext.projectName);
  const [projectDescription, setProjectDescription] = useState(
    state.projectContext.projectDescription
  );
  const [stakeholders, setStakeholders] = useState(state.projectContext.stakeholders);
  const [constraints, setConstraints] = useState(state.projectContext.constraints);
  const [timeline, setTimeline] = useState(state.projectContext.timeline);
  const [duration, setDuration] = useState(state.projectContext.duration);
  const [durationError, setDurationError] = useState('');

  // Validate duration input
  const validateDuration = (value: number): boolean => {
    if (!value || value < 15) {
      setDurationError('Workshop duration must be at least 15 minutes');
      return false;
    }
    if (value > 480) {
      // 8 hours max
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

    // Only validate if user has entered a value
    if (value !== '') {
      validateDuration(numValue);
    } else {
      setDurationError('');
    }
  };

  // Calculate estimated end time based on duration
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

  const handleBegin = () => {
    // Validate duration before proceeding
    if (!validateDuration(duration)) {
      return;
    }
    updateProjectContext({
      projectName,
      projectDescription,
      stakeholders,
      constraints,
      timeline,
      duration,
      completed: true,
    });
    setPhase('customer-discovery');
  };

  // Validation disabled for QC testing - allow skipping fields
  const canProceed = true; // projectName.trim() !== '' && projectDescription.trim() !== '';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-12 fade-in">
          <div
            className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 elevated"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Creative Discovery Workshop</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto text-balance">
            A guided workshop to discover creative requirements and generate a professional brief
          </p>
        </div>

        {/* Features Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="card stagger-item">
            <div className="flex items-center mb-3">
              <Clock className="w-6 h-6 mr-2" style={{ color: 'var(--color-primary)' }} />
              <h3 className="font-semibold text-gray-900">Time-Boxed</h3>
            </div>
            <p className="text-sm text-gray-600">
              Guided exercises with timers keep sessions focused and efficient (30-40 minutes total)
            </p>
          </div>

          <div className="card stagger-item">
            <div className="flex items-center mb-3">
              <Users className="w-6 h-6 mr-2" style={{ color: 'var(--color-primary)' }} />
              <h3 className="font-semibold text-gray-900">Solo or Group</h3>
            </div>
            <p className="text-sm text-gray-600">
              Use independently for reflection or in facilitated meetings with stakeholders
            </p>
          </div>

          <div className="card stagger-item">
            <div className="flex items-center mb-3">
              <FileText className="w-6 h-6 mr-2" style={{ color: 'var(--color-primary)' }} />
              <h3 className="font-semibold text-gray-900">Professional Output</h3>
            </div>
            <p className="text-sm text-gray-600">
              Generate a downloadable DOCX brief ready for designers and stakeholders
            </p>
          </div>
        </div>

        {/* Project Context Form */}
        <div className="card scale-in">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Project Information</h2>
          <div className="space-y-6">
            {/* Project Name */}
            <div>
              <label htmlFor="projectName" className="form-label">
                Project Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="projectName"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="Product Launch Video Campaign"
                className="form-input"
              />
            </div>

            {/* Project Description */}
            <div>
              <label htmlFor="projectDescription" className="form-label">
                Project Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="projectDescription"
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                placeholder="We need a 60-second promotional video to announce our new AI-powered productivity app. The video will be used across social media, our website, and at industry conferences. We want to showcase the app's key features while connecting emotionally with busy professionals who struggle with task management."
                rows={4}
                className="form-textarea"
              />
              <p className="text-sm text-gray-500 mt-1">
                This will appear in the brief's Project Overview section
              </p>
            </div>

            {/* Stakeholders */}
            <div>
              <label htmlFor="stakeholders" className="form-label">
                Key Stakeholders <span className="text-gray-400">(Optional)</span>
              </label>
              <textarea
                id="stakeholders"
                value={stakeholders}
                onChange={(e) => setStakeholders(e.target.value)}
                placeholder="CMO Sarah Chen (final approval), Product Manager David Rodriguez (technical accuracy), Brand Director Maya Patel (brand compliance), and our target users: project managers aged 28-45 in tech and consulting industries"
                rows={2}
                className="form-textarea"
              />
            </div>

            {/* Constraints */}
            <div>
              <label htmlFor="constraints" className="form-label">
                Known Constraints <span className="text-gray-400">(Optional)</span>
              </label>
              <textarea
                id="constraints"
                value={constraints}
                onChange={(e) => setConstraints(e.target.value)}
                placeholder="Budget: $25,000 for production. Must use company brand colors (navy blue #1A365D, teal #0694A2). Video must be under 60 seconds for Instagram/LinkedIn. Must include accessibility features (captions, audio descriptions). No stock footage - all content must be original or app screen recordings."
                rows={3}
                className="form-textarea"
              />
            </div>

            {/* Timeline */}
            <div>
              <label htmlFor="timeline" className="form-label">
                Timeline <span className="text-gray-400">(Optional)</span>
              </label>
              <input
                type="text"
                id="timeline"
                value={timeline}
                onChange={(e) => setTimeline(e.target.value)}
                placeholder="Kickoff: February 1, 2026 | First draft: February 20, 2026 | Final delivery: March 10, 2026 | Public launch: March 25, 2026 at TechCon Conference"
                className="form-input"
              />
            </div>

            {/* Workshop Duration */}
            <div>
              <label htmlFor="duration" className="form-label">
                Workshop Duration <span className="text-red-500">*</span>
              </label>
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
                {durationError && <p className="text-sm text-red-500">{durationError}</p>}
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

          {/* Begin Button */}
          <div className="mt-8 flex justify-end">
            <button
              onClick={handleBegin}
              disabled={!canProceed}
              className={`btn ${canProceed ? 'btn-primary' : 'btn-secondary'}`}
              style={!canProceed ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
            >
              Begin Discovery Process
            </button>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Your progress is automatically saved. You can return anytime to continue.</p>
        </div>
      </div>
    </div>
  );
}
