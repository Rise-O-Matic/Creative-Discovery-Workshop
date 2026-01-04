import React, { useState } from 'react';
import { useSession } from '../../hooks/useSession';
import { OneSentenceThreeLenses } from '../../components/OneSentenceThreeLenses';
import { ViewersInMirror } from '../../components/ViewersInMirror';
import { StoryWithoutPictures } from '../../components/StoryWithoutPictures';
import { FailuresList } from '../../components/FailuresList';
import { PromisesProofsList } from '../../components/PromisesProofsList';
import { ConstraintsList } from '../../components/ConstraintsList';
import { SynthesisService } from '../../services/llm';
import type {
  OneSentenceThreeLenses as OneSentenceType,
  ViewersInMirror as ViewersType,
  StoryWithoutPictures as StoryType,
  PromiseProof,
  Constraint,
} from '../../types';
import { ChevronLeft, ChevronRight, Loader2, Lightbulb } from 'lucide-react';

export const SpotExercisesPage: React.FC = () => {
  const { state, updateSpotExercises, nextPhase } = useSession();
  const [currentSection, setCurrentSection] = useState(0);
  const [isGeneratingSynthesis, setIsGeneratingSynthesis] = useState(false);
  const [synthesisError, setSynthesisError] = useState<string | null>(null);
  const [showSynthesis, setShowSynthesis] = useState(false);

  const sections = [
    'One Sentence',
    'Viewers in Mirror',
    'Story Beats',
    'Failures',
    'Promises & Proofs',
    'Constraints',
  ];

  // Initialize data with defaults if null
  const oneSentence: OneSentenceType = state.spotExercises.oneSentence || {
    makePeopleFeel: '',
    helpOrganization: '',
    showThatWe: '',
  };

  const viewers: ViewersType = state.spotExercises.viewersInMirror || {
    whereWatching: '',
    feelingBefore: '',
    stopWatchingIf: '',
  };

  const story: StoryType = state.spotExercises.story || {
    situation: { description: '', type: 'required' },
    problem: { description: '', type: 'required' },
    tensionReveal: { description: '', type: 'required' },
    productRole: { description: '', type: 'required' },
    resolution: { description: '', type: 'required' },
  };

  // Handle updates for each exercise
  const handleOneSentenceChange = (data: OneSentenceType) => {
    updateSpotExercises({ oneSentence: data });
  };

  const handleViewersChange = (data: ViewersType) => {
    updateSpotExercises({ viewersInMirror: data });
  };

  const handleStoryChange = (data: StoryType) => {
    updateSpotExercises({ story: data });
  };

  const handleFailuresChange = (failures: string[]) => {
    updateSpotExercises({ failures });
  };

  const handlePromisesChange = (promisesAndProofs: PromiseProof[]) => {
    updateSpotExercises({ promisesAndProofs });
  };

  const handleConstraintsChange = (constraints: Constraint[]) => {
    updateSpotExercises({ constraints });
  };

  // Navigation
  const goToPreviousSection = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  const goToNextSection = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1);
    }
  };

  // Validation disabled for QC testing - allow generating synthesis with incomplete data
  const isOneSentenceComplete = true; // oneSentence.makePeopleFeel.trim() && ...
  const isViewersComplete = true; // viewers.whereWatching.trim() && ...
  const isStoryComplete = true; // story.situation.description.trim() && ...
  const isReadyForSynthesis = true; // isOneSentenceComplete && isViewersComplete && isStoryComplete;

  // Generate AI synthesis
  const handleGenerateSynthesis = async () => {
    if (!isReadyForSynthesis) {
      setSynthesisError(
        'Please complete all required exercises (One Sentence, Viewers in Mirror, and Story Beats) before generating synthesis.'
      );
      return;
    }

    setIsGeneratingSynthesis(true);
    setSynthesisError(null);

    try {
      const service = new SynthesisService({
        provider: state.llmConfig.provider,
        apiKey: state.llmConfig.apiKey,
        model: state.llmConfig.model,
      });

      const synthesis = await service.synthesizeSpotExercises({
        oneSentence,
        viewersInMirror: viewers,
        story: {
          situation: story.situation.description,
          problem: story.problem.description,
          tensionReveal: story.tensionReveal.description,
          productRole: story.productRole.description,
          resolution: story.resolution.description,
        },
        failures: state.spotExercises.failures,
        promisesAndProofs: state.spotExercises.promisesAndProofs,
        constraints: state.spotExercises.constraints,
      });

      updateSpotExercises({ aiSynthesis: synthesis, completed: true });
      setShowSynthesis(true);
    } catch (error) {
      console.error('Synthesis generation failed:', error);
      setSynthesisError(
        error instanceof Error ? error.message : 'Failed to generate synthesis. Please try again.'
      );
    } finally {
      setIsGeneratingSynthesis(false);
    }
  };

  // Proceed to next phase
  const handleContinue = () => {
    nextPhase();
  };

  // Render current section
  const renderSection = () => {
    switch (currentSection) {
      case 0:
        return <OneSentenceThreeLenses data={oneSentence} onChange={handleOneSentenceChange} />;
      case 1:
        return <ViewersInMirror data={viewers} onChange={handleViewersChange} />;
      case 2:
        return <StoryWithoutPictures data={story} onChange={handleStoryChange} />;
      case 3:
        return (
          <FailuresList failures={state.spotExercises.failures} onChange={handleFailuresChange} />
        );
      case 4:
        return (
          <PromisesProofsList
            promisesAndProofs={state.spotExercises.promisesAndProofs}
            onChange={handlePromisesChange}
          />
        );
      case 5:
        return (
          <ConstraintsList
            constraints={state.spotExercises.constraints}
            onChange={handleConstraintsChange}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Spot Exercises</h1>
          <p className="text-gray-600">
            Complete these exercises to define your creative direction and constraints.
          </p>
        </div>

        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Section {currentSection + 1} of {sections.length}
            </span>
            <span className="text-sm text-gray-600">{sections[currentSection]}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${((currentSection + 1) / sections.length) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Section content */}
        <div className="mb-8">{renderSection()}</div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={goToPreviousSection}
            disabled={currentSection === 0}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <ChevronLeft size={16} />
            Previous
          </button>

          {currentSection === sections.length - 1 ? (
            <button
              onClick={() => setShowSynthesis(true)}
              className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
            >
              Review & Generate Insights
              <Lightbulb size={16} />
            </button>
          ) : (
            <button
              onClick={goToNextSection}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
            >
              Next
              <ChevronRight size={16} />
            </button>
          )}
        </div>

        {/* Synthesis section */}
        {showSynthesis && (
          <div className="border-t border-gray-300 pt-8 mt-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Review & AI Insights</h2>

              {/* Show completion status */}
              <div className="mb-6 space-y-2">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-4 h-4 rounded-full ${isOneSentenceComplete ? 'bg-green-500' : 'bg-gray-300'}`}
                  />
                  <span className="text-sm text-gray-700">
                    One Sentence, Three Lenses {isOneSentenceComplete ? '✓' : '(incomplete)'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-4 h-4 rounded-full ${isViewersComplete ? 'bg-green-500' : 'bg-gray-300'}`}
                  />
                  <span className="text-sm text-gray-700">
                    Viewers in Mirror {isViewersComplete ? '✓' : '(incomplete)'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-4 h-4 rounded-full ${isStoryComplete ? 'bg-green-500' : 'bg-gray-300'}`}
                  />
                  <span className="text-sm text-gray-700">
                    Story Without Pictures {isStoryComplete ? '✓' : '(incomplete)'}
                  </span>
                </div>
              </div>

              {/* Synthesis button or display */}
              {!state.spotExercises.aiSynthesis ? (
                <div>
                  <button
                    onClick={handleGenerateSynthesis}
                    disabled={!isReadyForSynthesis || isGeneratingSynthesis}
                    className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isGeneratingSynthesis ? (
                      <>
                        <Loader2 size={20} className="animate-spin" />
                        Generating Insights...
                      </>
                    ) : (
                      <>
                        <Lightbulb size={20} />
                        Generate AI Insights
                      </>
                    )}
                  </button>

                  {synthesisError && (
                    <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-700 text-sm">{synthesisError}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <div className="mb-4 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
                    <h3 className="font-semibold text-blue-900 mb-2">AI-Generated Insights</h3>
                    <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap">
                      {state.spotExercises.aiSynthesis}
                    </div>
                  </div>

                  <button
                    onClick={handleContinue}
                    className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
                  >
                    Continue to Next Phase
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
