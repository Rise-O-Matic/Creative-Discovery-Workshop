import { useState } from 'react';
import { useSession } from '../../hooks/useSession';
import { BriefGenerator } from '../../services/docx';
import { Download, CheckCircle, FileText, RotateCcw } from 'lucide-react';

/**
 * Brief Complete Page - final screen showing success and download options
 * Allows user to download DOCX brief or start a new session
 */
export function BriefCompletePage() {
  const { state, setPhase } = useSession();
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  const handleDownload = async () => {
    setIsGenerating(true);
    setDownloadError(null);

    try {
      await BriefGenerator.generate(state, state.projectContext.projectName);
    } catch (error) {
      console.error('Error generating brief:', error);
      setDownloadError('Failed to generate brief. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleStartNew = () => {
    if (
      confirm(
        'Are you sure you want to start a new brief? This will clear all current data. Make sure you have downloaded your current brief first.'
      )
    ) {
      // Clear session and start over
      localStorage.removeItem('creative-brief-session');
      window.location.reload();
    }
  };

  const handleBackToReview = () => {
    setPhase('synthesis-review');
  };

  // Summary stats
  const stats = [
    {
      label: 'Requirements Clusters',
      value: state.stickyNoteExercise.clusters.length,
      icon: '📌',
    },
    {
      label: 'Sticky Notes',
      value: state.stickyNoteExercise.notes.length,
      icon: '📝',
    },
    {
      label: 'Will Have Items',
      value: state.prioritization.willHave.length,
      icon: '✅',
    },
    {
      label: 'Exercises Completed',
      value: [
        state.customerDiscovery.completed,
        state.stickyNoteExercise.completed,
        state.spotExercises.completed,
        state.prioritization.completed,
      ].filter(Boolean).length,
      icon: '🎯',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500 rounded-full mb-6">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Creative Brief Complete!</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your discovery work has been compiled into a professional creative brief ready for
            download
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg p-6 shadow-sm text-center">
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Brief Preview Card */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="flex-shrink-0 w-16 h-16 bg-indigo-100 rounded-lg flex items-center justify-center">
              <FileText className="w-8 h-8 text-indigo-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {state.projectContext.projectName}
              </h2>
              <p className="text-gray-600">{state.projectContext.projectDescription}</p>
            </div>
          </div>

          {/* Brief Sections Included */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="font-semibold text-gray-900 mb-4">Your brief includes:</h3>
            <div className="grid md:grid-cols-2 gap-3">
              {[
                '1. Project Overview',
                '2. Objectives',
                '3. Target Audience',
                '4. Key Message & Tone',
                '5. Requirements',
                '6. Deliverables',
                '7. Constraints & Risks',
                '8. Timeline',
                '9. Stakeholders',
                "10. Scope (Will/Could/Won't)",
              ].map((section) => (
                <div key={section} className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{section}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Download Button */}
          <div className="mt-8">
            <button
              onClick={handleDownload}
              disabled={isGenerating}
              className="w-full px-8 py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-3 text-lg"
            >
              {isGenerating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Generating DOCX...
                </>
              ) : (
                <>
                  <Download className="w-6 h-6" />
                  Download Creative Brief (DOCX)
                </>
              )}
            </button>

            {downloadError && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 text-sm">{downloadError}</p>
              </div>
            )}

            <p className="text-center text-sm text-gray-500 mt-3">
              The brief will download as a Microsoft Word document (.docx)
            </p>
          </div>
        </div>

        {/* What's Next */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h3 className="font-semibold text-gray-900 mb-4">What's Next?</h3>
          <div className="space-y-3 text-gray-700">
            <p className="flex items-start gap-2">
              <span className="text-indigo-600 font-bold">1.</span>
              <span>Download and review your creative brief</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-indigo-600 font-bold">2.</span>
              <span>Share it with stakeholders and creative teams</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-indigo-600 font-bold">3.</span>
              <span>Use it to guide design, copywriting, and production decisions</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-indigo-600 font-bold">4.</span>
              <span>
                Return to this tool anytime you need to create a new brief for a different project
              </span>
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={handleBackToReview}
            className="flex-1 px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <FileText className="w-5 h-5" />
            Back to Review
          </button>
          <button
            onClick={handleStartNew}
            className="flex-1 px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            Start New Brief
          </button>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            Your session data is saved locally. Download your brief before starting a new project.
          </p>
        </div>
      </div>
    </div>
  );
}
