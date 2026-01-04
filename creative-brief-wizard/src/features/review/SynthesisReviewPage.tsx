import { useState } from 'react';
import { useSession } from '../../hooks/useSession';
import { ChevronDown, ChevronRight, Edit2, CheckCircle } from 'lucide-react';

/**
 * Synthesis Review Page - allows user to review all collected data before generating brief
 * Shows summary of each completed section with ability to go back and edit
 */
export function SynthesisReviewPage() {
  const { state, setPhase } = useSession();
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const handleGenerateBrief = () => {
    setPhase('brief-complete');
  };

  const handleEditPhase = (phase: string) => {
    setPhase(phase as any);
  };

  const sections = [
    {
      id: 'project-context',
      title: 'Project Context',
      completed: state.projectContext.completed,
      phase: 'project-context',
      content: (
        <div className="space-y-3">
          <div>
            <p className="text-sm font-semibold text-gray-700">Project Name:</p>
            <p className="text-gray-900">{state.projectContext.projectName || 'Not provided'}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-700">Description:</p>
            <p className="text-gray-900">
              {state.projectContext.projectDescription || 'Not provided'}
            </p>
          </div>
          {state.projectContext.stakeholders && (
            <div>
              <p className="text-sm font-semibold text-gray-700">Stakeholders:</p>
              <p className="text-gray-900">{state.projectContext.stakeholders}</p>
            </div>
          )}
          {state.projectContext.constraints && (
            <div>
              <p className="text-sm font-semibold text-gray-700">Constraints:</p>
              <p className="text-gray-900">{state.projectContext.constraints}</p>
            </div>
          )}
          {state.projectContext.timeline && (
            <div>
              <p className="text-sm font-semibold text-gray-700">Timeline:</p>
              <p className="text-gray-900">{state.projectContext.timeline}</p>
            </div>
          )}
        </div>
      ),
    },
    {
      id: 'customer-discovery',
      title: 'Customer & Product Discovery',
      completed: state.customerDiscovery.completed,
      phase: 'customer-discovery',
      content: (
        <div className="space-y-4">
          {state.customerDiscovery.whoIsThisFor.answer && (
            <div>
              <p className="text-sm font-semibold text-gray-700">Who is this for?</p>
              <p className="text-gray-900">{state.customerDiscovery.whoIsThisFor.answer}</p>
            </div>
          )}
          {state.customerDiscovery.whatIsBeingOffered.answer && (
            <div>
              <p className="text-sm font-semibold text-gray-700">What is being offered?</p>
              <p className="text-gray-900">{state.customerDiscovery.whatIsBeingOffered.answer}</p>
            </div>
          )}
          {state.customerDiscovery.whyNow.answer && (
            <div>
              <p className="text-sm font-semibold text-gray-700">Why now?</p>
              <p className="text-gray-900">{state.customerDiscovery.whyNow.answer}</p>
            </div>
          )}
          {state.customerDiscovery.whatIsSuccess.answer && (
            <div>
              <p className="text-sm font-semibold text-gray-700">What is success?</p>
              <p className="text-gray-900">{state.customerDiscovery.whatIsSuccess.answer}</p>
            </div>
          )}
        </div>
      ),
    },
    {
      id: 'sticky-notes',
      title: 'Requirements Discovery (Sticky Notes)',
      completed: state.stickyNoteExercise.completed,
      phase: 'sticky-notes-diverge',
      content: (
        <div className="space-y-4">
          <div>
            <p className="text-sm font-semibold text-gray-700">Focus Prompt:</p>
            <p className="text-gray-900">
              {state.stickyNoteExercise.focusPrompt || 'Not provided'}
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-700">
              Notes Created: {state.stickyNoteExercise.notes.length}
            </p>
            <p className="text-sm font-semibold text-gray-700">
              Clusters: {state.stickyNoteExercise.clusters.length}
            </p>
          </div>
          {state.stickyNoteExercise.clusters.map((cluster) => (
            <div key={cluster.id} className="p-3 bg-yellow-50 rounded-lg">
              <p className="font-semibold text-gray-900">{cluster.title}</p>
              {cluster.aiSummary && (
                <p className="text-sm text-gray-700 mt-1">{cluster.aiSummary}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                {cluster.noteIds.length} note{cluster.noteIds.length !== 1 ? 's' : ''}
              </p>
            </div>
          ))}
        </div>
      ),
    },
    {
      id: 'spot-exercises',
      title: 'Creative Exercises',
      completed: state.spotExercises.completed,
      phase: 'spot-exercises',
      content: (
        <div className="space-y-4">
          {state.spotExercises.oneSentence && (
            <div>
              <p className="text-sm font-semibold text-gray-700">One Sentence, Three Lenses:</p>
              <ul className="list-disc list-inside text-gray-900 space-y-1">
                <li>Make people: {state.spotExercises.oneSentence.makePeopleFeel}</li>
                <li>Help organization: {state.spotExercises.oneSentence.helpOrganization}</li>
                <li>Show that we: {state.spotExercises.oneSentence.showThatWe}</li>
              </ul>
            </div>
          )}
          {state.spotExercises.failures.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-gray-700">Failure Scenarios:</p>
              <p className="text-gray-900">{state.spotExercises.failures.length} identified</p>
            </div>
          )}
          {state.spotExercises.constraints.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-gray-700">Constraints:</p>
              <p className="text-gray-900">{state.spotExercises.constraints.length} identified</p>
            </div>
          )}
          {state.spotExercises.aiSynthesis && (
            <div className="mt-4 p-4 bg-indigo-50 rounded-lg">
              <p className="text-sm font-semibold text-indigo-900 mb-2">AI Synthesis:</p>
              <p className="text-indigo-800">{state.spotExercises.aiSynthesis}</p>
            </div>
          )}
        </div>
      ),
    },
    {
      id: 'prioritization',
      title: "Prioritization (Will/Could/Won't)",
      completed: state.prioritization.completed,
      phase: 'prioritization',
      content: (
        <div className="space-y-4">
          <div>
            <p className="text-sm font-semibold text-green-700">
              WILL HAVE: {state.prioritization.willHave.length} items
            </p>
            {state.prioritization.willHave.slice(0, 3).map((item) => (
              <p key={item.id} className="text-sm text-gray-700 ml-4">
                • {item.description}
              </p>
            ))}
            {state.prioritization.willHave.length > 3 && (
              <p className="text-sm text-gray-500 ml-4">
                ...and {state.prioritization.willHave.length - 3} more
              </p>
            )}
          </div>
          <div>
            <p className="text-sm font-semibold text-blue-700">
              COULD HAVE: {state.prioritization.couldHave.length} items
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-700">
              WON&apos;T HAVE: {state.prioritization.wontHave.length} items
            </p>
          </div>
        </div>
      ),
    },
  ];

  const allCompleted = sections.every((s) => s.completed);
  const completedCount = sections.filter((s) => s.completed).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Review Your Work</h1>
          <p className="text-gray-600">
            Review all collected information before generating your creative brief
          </p>
          <div className="mt-4 flex items-center gap-2">
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div
                className="bg-indigo-600 h-2 rounded-full transition-all"
                style={{ width: `${(completedCount / sections.length) * 100}%` }}
              />
            </div>
            <span className="text-sm font-semibold text-gray-700">
              {completedCount}/{sections.length} Complete
            </span>
          </div>
        </div>

        {/* Completion Warning */}
        {!allCompleted && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800">
              <strong>Note:</strong> Some sections are incomplete. You can still generate a brief,
              but it may be missing important information.
            </p>
          </div>
        )}

        {/* Sections */}
        <div className="space-y-4 mb-8">
          {sections.map((section) => (
            <div
              key={section.id}
              className={`bg-white rounded-lg shadow-sm border-2 ${
                section.completed ? 'border-green-200' : 'border-gray-200'
              }`}
            >
              {/* Section Header */}
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {section.completed ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                  )}
                  <h2 className="text-lg font-semibold text-gray-900">{section.title}</h2>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditPhase(section.phase);
                    }}
                    className="px-3 py-1 text-sm text-indigo-600 hover:bg-indigo-50 rounded-lg flex items-center gap-1 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </button>
                  {expandedSections.has(section.id) ? (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </button>

              {/* Section Content */}
              {expandedSections.has(section.id) && (
                <div className="px-6 pb-6 pt-4 border-t border-gray-100">{section.content}</div>
              )}
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center">
          <button
            onClick={() => setPhase('prioritization')}
            className="px-6 py-3 text-gray-700 hover:bg-gray-100 rounded-lg font-semibold transition-colors"
          >
            Back to Prioritization
          </button>
          <button
            onClick={handleGenerateBrief}
            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-colors flex items-center gap-2"
          >
            Generate Creative Brief
          </button>
        </div>
      </div>
    </div>
  );
}
