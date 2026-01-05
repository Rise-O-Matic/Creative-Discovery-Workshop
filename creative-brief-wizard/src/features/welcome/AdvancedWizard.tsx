import { useState } from 'react';
import { ChevronRight, ChevronLeft, Check } from 'lucide-react';

interface WizardField {
  id: string;
  label: string;
  placeholder: string;
  type: 'text' | 'textarea' | 'number';
  value: string | number;
  required: boolean;
  rows?: number;
}

interface AdvancedWizardProps {
  onComplete: (data: {
    projectDescription: string;
    stakeholders: string;
    constraints: string;
    timeline: string;
    duration: number;
    projectName: string;
  }) => void;
  onCancel: () => void;
  initialPrompt: string;
}

/**
 * Step-by-step wizard for advanced project details
 * Most engaging questions first, boring/difficult ones (like naming) at the end
 */
export function AdvancedWizard({ onComplete, onCancel, initialPrompt }: AdvancedWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [fields, setFields] = useState<WizardField[]>([
    {
      id: 'projectDescription',
      label: 'Tell us about your project',
      placeholder: 'What are you creating? What problem does it solve? Who is it for?',
      type: 'textarea',
      value: initialPrompt,
      required: true,
      rows: 6,
    },
    {
      id: 'timeline',
      label: 'When does this need to be completed?',
      placeholder: 'e.g., "Launch in 3 months" or "Ongoing campaign through Q2"',
      type: 'text',
      value: '',
      required: false,
    },
    {
      id: 'stakeholders',
      label: 'Who are the key stakeholders?',
      placeholder: 'e.g., "Marketing team, CEO, external agency"',
      type: 'text',
      value: '',
      required: false,
    },
    {
      id: 'constraints',
      label: 'Any constraints or limitations?',
      placeholder: 'e.g., "Budget: $50K, Must use existing brand colors"',
      type: 'textarea',
      value: '',
      required: false,
      rows: 3,
    },
    {
      id: 'duration',
      label: 'How long should this workshop take?',
      placeholder: '60',
      type: 'number',
      value: 60,
      required: true,
    },
    {
      id: 'projectName',
      label: 'What should we call this project?',
      placeholder: 'e.g., "Q1 Video Campaign" or "Brand Refresh 2024"',
      type: 'text',
      value: '',
      required: true,
    },
  ]);

  const currentField = fields[currentStep];
  const isLastStep = currentStep === fields.length - 1;
  const canProceed = !currentField.required || (currentField.value && currentField.value.toString().trim().length > 0);

  const updateField = (value: string | number) => {
    const newFields = [...fields];
    newFields[currentStep].value = value;
    setFields(newFields);
  };

  const handleNext = () => {
    if (isLastStep) {
      // Collect all data and complete
      const data = fields.reduce((acc, field) => {
        acc[field.id] = field.value;
        return acc;
      }, {} as any);
      onComplete(data);
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    if (!currentField.required) {
      if (isLastStep) {
        const data = fields.reduce((acc, field) => {
          acc[field.id] = field.value;
          return acc;
        }, {} as any);
        onComplete(data);
      } else {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Project Details</h2>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              ✕
            </button>
          </div>
          
          {/* Progress Indicator */}
          <div className="flex items-center gap-2">
            {fields.map((_, index) => (
              <div
                key={index}
                className={`h-1.5 flex-1 rounded-full transition-all ${
                  index < currentStep
                    ? 'bg-green-500'
                    : index === currentStep
                    ? 'bg-blue-500'
                    : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Step {currentStep + 1} of {fields.length}
          </p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-8 py-8">
          <div className="space-y-4 animate-fadeIn">
            <label className="block">
              <span className="text-lg font-semibold text-gray-900 mb-2 block">
                {currentField.label}
                {currentField.required && <span className="text-red-500 ml-1">*</span>}
              </span>
              
              {currentField.type === 'textarea' ? (
                <textarea
                  value={currentField.value as string}
                  onChange={(e) => updateField(e.target.value)}
                  placeholder={currentField.placeholder}
                  rows={currentField.rows || 4}
                  className="w-full px-4 py-3 text-base border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none resize-none transition-all"
                  autoFocus
                />
              ) : currentField.type === 'number' ? (
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    value={currentField.value as number}
                    onChange={(e) => updateField(parseInt(e.target.value) || 60)}
                    min="15"
                    max="480"
                    className="w-32 px-4 py-3 text-base border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all"
                    autoFocus
                  />
                  <span className="text-gray-600">minutes</span>
                </div>
              ) : (
                <input
                  type="text"
                  value={currentField.value as string}
                  onChange={(e) => updateField(e.target.value)}
                  placeholder={currentField.placeholder}
                  className="w-full px-4 py-3 text-base border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all"
                  autoFocus
                />
              )}
            </label>

            {!currentField.required && (
              <p className="text-sm text-gray-500 italic">
                This field is optional. You can skip it if you'd like.
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                currentStep === 0
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-200'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
              Previous
            </button>

            <div className="flex items-center gap-3">
              {!currentField.required && (
                <button
                  onClick={handleSkip}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium transition-colors"
                >
                  Skip
                </button>
              )}
              
              <button
                onClick={handleNext}
                disabled={!canProceed}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                  canProceed
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md hover:shadow-lg hover:scale-105'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                {isLastStep ? (
                  <>
                    <Check className="w-5 h-5" />
                    Complete
                  </>
                ) : (
                  <>
                    Next
                    <ChevronRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
