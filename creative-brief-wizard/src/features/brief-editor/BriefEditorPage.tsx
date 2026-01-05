import { useState } from 'react';
import { useSession } from '../../hooks/useSession';
import { RichTextEditor } from '../../components/RichTextEditor';
import { ChevronRight, ChevronLeft, Download, Info } from 'lucide-react';
import { GRANULAR_QUESTIONS } from '../../data/granularQuestions';
import { exportAsMarkdown, exportAsDocx, exportAsPdf } from '../../utils/exportBrief';

export const BriefEditorPage: React.FC = () => {
  const { state, updateCustomerDiscovery } = useSession();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [briefSections, setBriefSections] = useState({
    overview: state.creativeBrief?.overview || '',
    audience: state.creativeBrief?.audience || '',
    keyMessage: state.creativeBrief?.keyMessage || '',
    objectives: state.creativeBrief?.objectives || '',
    deliverables: state.creativeBrief?.deliverables || '',
    toneAndStyle: state.creativeBrief?.toneAndStyle || '',
    timeline: state.creativeBrief?.timeline || '',
    successMetrics: state.creativeBrief?.successMetrics || '',
  });

  const handleSectionChange = (section: string, content: string) => {
    setBriefSections(prev => ({ ...prev, [section]: content }));
  };

  const handleQuestionAnswer = (questionId: string, answer: string) => {
    const updatedQuestions = state.customerDiscovery.granularQuestions.map(q =>
      q.id === questionId ? { ...q, answer } : q
    );
    updateCustomerDiscovery({ granularQuestions: updatedQuestions });
  };

  const handleExport = async (format: 'md' | 'docx' | 'pdf') => {
    const briefData = {
      projectName: state.projectContext.projectName || 'Creative Brief',
      ...briefSections,
    };

    try {
      if (format === 'md') {
        exportAsMarkdown(briefData);
      } else if (format === 'docx') {
        await exportAsDocx(briefData);
      } else if (format === 'pdf') {
        exportAsPdf(briefData);
      }
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export brief. Please try again.');
    }
  };

  return (
    <div className="flex h-full">
      {/* Main Brief Editor */}
      <div className="flex-1 overflow-auto bg-gray-50">
        <div className="max-w-4xl mx-auto p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              {state.projectContext.projectName || 'Creative Brief'}
            </h1>
            <div className="flex gap-2">
              <button
                onClick={() => handleExport('md')}
                className="px-4 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export as Markdown
              </button>
              <button
                onClick={() => handleExport('docx')}
                className="px-4 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export as Word
              </button>
              <button
                onClick={() => handleExport('pdf')}
                className="px-4 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export as PDF
              </button>
            </div>
          </div>

          {/* Brief Sections */}
          <div className="space-y-8">
            <Section
              title="Project Overview"
              content={briefSections.overview}
              onChange={(content) => handleSectionChange('overview', content)}
            />
            <Section
              title="Target Audience"
              content={briefSections.audience}
              onChange={(content) => handleSectionChange('audience', content)}
            />
            <Section
              title="Key Message & Value Proposition"
              content={briefSections.keyMessage}
              onChange={(content) => handleSectionChange('keyMessage', content)}
            />
            <Section
              title="Objectives & Goals"
              content={briefSections.objectives}
              onChange={(content) => handleSectionChange('objectives', content)}
            />
            <Section
              title="Deliverables"
              content={briefSections.deliverables}
              onChange={(content) => handleSectionChange('deliverables', content)}
            />
            <Section
              title="Tone & Style"
              content={briefSections.toneAndStyle}
              onChange={(content) => handleSectionChange('toneAndStyle', content)}
            />
            <Section
              title="Timeline & Milestones"
              content={briefSections.timeline}
              onChange={(content) => handleSectionChange('timeline', content)}
            />
            <Section
              title="Success Metrics"
              content={briefSections.successMetrics}
              onChange={(content) => handleSectionChange('successMetrics', content)}
            />
          </div>
        </div>
      </div>

      {/* Refinement Questions Sidebar */}
      {isSidebarOpen ? (
        <div className="w-96 bg-white border-l border-gray-200 shadow-xl flex flex-col h-full overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
            <h3 className="font-semibold text-gray-900">Refinement Questions</h3>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {GRANULAR_QUESTIONS.map((question) => {
              const answer = state.customerDiscovery.granularQuestions.find(q => q.id === question.id)?.answer || '';
              
              return (
                <div key={question.id} className="space-y-2">
                  <div className="flex items-start gap-2">
                    <label className="text-sm font-medium text-gray-700 flex-1">
                      {question.question}
                    </label>
                    {question.rationale && (
                      <div className="group relative">
                        <Info className="w-4 h-4 text-gray-400 hover:text-blue-500 cursor-help" />
                        <div className="absolute right-0 top-full mt-2 w-64 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                          {question.rationale}
                        </div>
                      </div>
                    )}
                  </div>
                  <textarea
                    value={answer}
                    onChange={(e) => handleQuestionAnswer(question.id, e.target.value)}
                    placeholder={question.placeholder}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows={3}
                  />
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="fixed right-4 top-20 z-40 p-3 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 transition-colors"
          title="Show Refinement Questions"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

interface SectionProps {
  title: string;
  content: string;
  onChange: (content: string) => void;
}

const Section: React.FC<SectionProps> = ({ title, content, onChange }) => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">{title}</h2>
      <RichTextEditor
        content={content}
        onChange={onChange}
        placeholder={`Enter ${title.toLowerCase()}...`}
      />
    </div>
  );
};
