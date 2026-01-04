import React, { useState } from 'react';
import { useSession } from '../../hooks/useSession';
import { DiscoveryQuestion } from '../../components/DiscoveryQuestion';
import type { DiscoveryQuestion as DiscoveryQuestionType } from '../../types';

export const CustomerDiscoveryPage: React.FC = () => {
  const { state, updateCustomerDiscovery, nextPhase } = useSession();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const questions: DiscoveryQuestionType[] = [
    state.customerDiscovery.whoIsThisFor,
    state.customerDiscovery.whatIsBeingOffered,
    state.customerDiscovery.whyNow,
    state.customerDiscovery.whatIsSuccess,
  ];

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const allQuestionsAnswered = questions.every((q) => q.answer.trim().length > 0);

  // Handle answer change
  const handleAnswerChange = (answer: string) => {
    // Map question IDs to their keys in the customerDiscovery state
    const keyMap: Record<string, keyof typeof state.customerDiscovery> = {
      'who-is-this-for': 'whoIsThisFor',
      'what-is-being-offered': 'whatIsBeingOffered',
      'why-now': 'whyNow',
      'what-is-success': 'whatIsSuccess',
    };

    const stateKey = keyMap[currentQuestion.id];
    if (stateKey && stateKey !== 'completed') {
      updateCustomerDiscovery({
        [stateKey]: {
          ...state.customerDiscovery[stateKey],
          answer,
        },
      });
    }
  };

  // Handle next question
  const handleNextQuestion = () => {
    if (!isLastQuestion) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  // Handle skip question
  const handleSkipQuestion = () => {
    if (!isLastQuestion) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  // Handle previous question
  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // Handle completing the discovery phase
  const handleComplete = () => {
    updateCustomerDiscovery({ completed: true });
    nextPhase();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4">
      <div className="container">
        {/* Header */}
        <div className="mb-6 fade-in">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Customer Discovery</h1>
          <p className="text-sm text-gray-600 text-balance">
            Answer these four fundamental questions to clarify the project's purpose and audience.
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-6 slide-in">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
            <span className="text-sm text-gray-500">
              {questions.filter((q) => q.answer.trim().length > 0).length} answered
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div
              className="h-2 rounded-full smooth-transition"
              style={{
                width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`,
                backgroundColor: 'var(--color-primary)',
              }}
            />
          </div>
        </div>

        {/* Question Display */}
        <DiscoveryQuestion
          question={currentQuestion}
          answer={currentQuestion.answer}
          onAnswerChange={handleAnswerChange}
          disabled={false}
        />

        {/* Controls */}
        <div className="mt-8 flex flex-col gap-4">
          {/* Navigation Controls */}
          <div className="flex justify-between items-center gap-4">
            <button
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
              className="btn btn-secondary"
              style={currentQuestionIndex === 0 ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
            >
              Previous
            </button>

            <div className="flex gap-2">
              {!isLastQuestion && (
                <>
                  <button onClick={handleSkipQuestion} className="btn btn-ghost">
                    Skip
                  </button>
                  <button onClick={handleNextQuestion} className="btn btn-primary">
                    Next Question
                  </button>
                </>
              )}

              {isLastQuestion && allQuestionsAnswered && (
                <button onClick={handleComplete} className="btn btn-primary">
                  Continue to Next Phase
                </button>
              )}
            </div>
          </div>

          {/* Hint about answering all questions */}
          {isLastQuestion && !allQuestionsAnswered && (
            <div className="p-4 bg-yellow-50 border-l-4 border-yellow-500 text-yellow-700 rounded">
              <p className="text-sm">
                Please answer all questions before continuing. You can navigate back to previous
                questions using the "Previous" button.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
