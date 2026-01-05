import { useState } from 'react';
import { useSession } from '../../hooks/useSession';
// import type { GranularQuestion } from '../../types';

export const GranularDiscoveryPage: React.FC = () => {
  const { state, updateCustomerDiscovery, nextPhase } = useSession();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const questions = state.customerDiscovery.granularQuestions || [];
  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = questions.length > 0 ? currentQuestionIndex === questions.length - 1 : true;
  const answeredCount = questions.filter((q) => q.answer && q.answer.trim().length > 0).length;
  const progressPercent = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Loading questions...</h1>
          <button 
            onClick={() => nextPhase()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg"
          >
            Skip to next phase
          </button>
        </div>
      </div>
    );
  }

  // Get section label for current question
  const getSectionLabel = (questionId: string): string => {
    if (questionId.startsWith('aud')) return 'Audience';
    if (questionId.startsWith('off')) return 'Offering';
    if (questionId.startsWith('time')) return 'Timing';
    if (questionId.startsWith('succ')) return 'Success';
    return 'Discovery';
  };

  // Handle answer change
  const handleAnswerChange = (answer: string) => {
    const updatedQuestions = questions.map((q, idx) =>
      idx === currentQuestionIndex ? { ...q, answer } : q
    );
    updateCustomerDiscovery({ granularQuestions: updatedQuestions });
  };

  // Handle next question
  const handleNextQuestion = () => {
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

  // Handle skip question
  const handleSkipQuestion = () => {
    if (!isLastQuestion) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  // Handle completing discovery
  const handleComplete = () => {
    updateCustomerDiscovery({ completed: true });
    nextPhase();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 pb-20">
      <div className="container max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8 fade-in">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Discovery Questions</h1>
          <p className="text-sm text-gray-600">
            Let's explore your project through simple, focused questions.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
            <span className="text-sm text-gray-600">
              {answeredCount} answered
            </span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Section Badge */}
        <div className="mb-6">
          <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
            {getSectionLabel(currentQuestion.id)}
          </span>
        </div>

        {/* Question */}
        <div className="mb-8 fade-in">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{currentQuestion.question}</h2>

          {/* Answer Textarea */}
          <div className="mb-6">
            <label htmlFor="answer" className="block text-sm font-medium text-gray-700 mb-3">
              Your Answer
            </label>
            <textarea
              id="answer"
              value={currentQuestion.answer}
              onChange={(e) => handleAnswerChange(e.target.value)}
              placeholder={currentQuestion.placeholder}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={4}
            />
            <div className="mt-2 text-xs text-gray-500">
              {currentQuestion.answer.length} characters
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-3 justify-between">
            <div className="flex gap-3">
              <button
                onClick={handlePreviousQuestion}
                disabled={currentQuestionIndex === 0}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm"
              >
                ← Previous
              </button>
              <button
                onClick={handleSkipQuestion}
                disabled={isLastQuestion}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm"
              >
                Skip
              </button>
            </div>

            {!isLastQuestion && (
              <button
                onClick={handleNextQuestion}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium text-sm"
              >
                Next →
              </button>
            )}

            {isLastQuestion && (
              <button
                onClick={handleComplete}
                className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium text-sm"
              >
                Complete Discovery
              </button>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-12 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="text-sm text-blue-900">
            <strong>{answeredCount}</strong> of <strong>{questions.length}</strong> questions answered
            {answeredCount === questions.length && (
              <span className="ml-2 text-green-600">✓ Ready to continue!</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
