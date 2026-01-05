import { useState, useEffect } from 'react';
import { useSession } from '../hooks/useSession';
import { Eye, EyeOff } from 'lucide-react';

interface BriefSection {
  id: string;
  title: string;
  content: string;
  isNew?: boolean;
}

export const BriefCanvas: React.FC = () => {
  const { state } = useSession();
  const [isVisible, setIsVisible] = useState(true);
  const [sections, setSections] = useState<BriefSection[]>([]);
  const [highlightedSection, setHighlightedSection] = useState<string | null>(null);

  // Generate brief sections from state
  useEffect(() => {
    const newSections: BriefSection[] = [];

    // Project Overview
    if (state.projectContext.projectName || state.projectContext.projectDescription) {
      newSections.push({
        id: 'overview',
        title: 'Project Overview',
        content: `${state.projectContext.projectName ? `**${state.projectContext.projectName}**\n\n` : ''}${state.projectContext.projectDescription || 'Awaiting project description...'}`,
      });
    }

    // Audience Section
    const audienceAnswers = state.customerDiscovery.granularQuestions
      .filter(q => q.id.startsWith('aud') && q.answer)
      .map(q => `• ${q.answer}`)
      .join('\n');
    
    if (audienceAnswers) {
      newSections.push({
        id: 'audience',
        title: 'Target Audience',
        content: audienceAnswers,
      });
    }

    // Offering Section
    const offeringAnswers = state.customerDiscovery.granularQuestions
      .filter(q => q.id.startsWith('off') && q.answer)
      .map(q => `• ${q.answer}`)
      .join('\n');
    
    if (offeringAnswers) {
      newSections.push({
        id: 'offering',
        title: 'What We\'re Offering',
        content: offeringAnswers,
      });
    }

    // Timing Section
    const timingAnswers = state.customerDiscovery.granularQuestions
      .filter(q => q.id.startsWith('time') && q.answer)
      .map(q => `• ${q.answer}`)
      .join('\n');
    
    if (timingAnswers) {
      newSections.push({
        id: 'timing',
        title: 'Timing & Urgency',
        content: timingAnswers,
      });
    }

    // Success Section
    const successAnswers = state.customerDiscovery.granularQuestions
      .filter(q => q.id.startsWith('succ') && q.answer)
      .map(q => `• ${q.answer}`)
      .join('\n');
    
    if (successAnswers) {
      newSections.push({
        id: 'success',
        title: 'Success Metrics',
        content: successAnswers,
      });
    }

    // Check for new sections and trigger highlight
    const previousSectionIds = sections.map(s => s.id);
    const newSectionIds = newSections.map(s => s.id);
    const addedSections = newSectionIds.filter(id => !previousSectionIds.includes(id));
    
    if (addedSections.length > 0) {
      const lastAddedSection = addedSections[addedSections.length - 1];
      setHighlightedSection(lastAddedSection);
      setTimeout(() => setHighlightedSection(null), 2000);
    }

    setSections(newSections);
  }, [state.projectContext, state.customerDiscovery.granularQuestions]);

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed right-4 top-20 z-40 p-3 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 transition-colors"
        title="Show Brief Preview"
      >
        <Eye className="w-5 h-5" />
      </button>
    );
  }

  return (
    <div className="fixed right-0 top-16 bottom-0 w-96 bg-white border-l border-gray-200 shadow-xl z-30 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
        <h3 className="font-semibold text-gray-900">Creative Brief Preview</h3>
        <button
          onClick={() => setIsVisible(false)}
          className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded transition-colors"
          title="Hide Brief Preview"
        >
          <EyeOff className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {sections.length === 0 ? (
          <div className="text-center text-gray-500 mt-12">
            <p className="text-sm">Your creative brief will appear here as you answer questions.</p>
          </div>
        ) : (
          sections.map((section) => (
            <div
              key={section.id}
              className={`transition-all duration-500 ${
                highlightedSection === section.id
                  ? 'bg-blue-50 border-l-4 border-blue-500 pl-4 -ml-4 py-2'
                  : ''
              }`}
            >
              <h4 className="font-semibold text-gray-900 mb-2">{section.title}</h4>
              <div className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
                {section.content}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <p className="text-xs text-gray-500 text-center">
          {sections.length > 0 ? `${sections.length} section${sections.length !== 1 ? 's' : ''} completed` : 'Start answering questions to build your brief'}
        </p>
      </div>
    </div>
  );
};
