import React, { useEffect, useRef } from 'react';
import type { DiscoveryQuestion as DiscoveryQuestionType } from '../types';

interface DiscoveryQuestionProps {
  question: DiscoveryQuestionType;
  answer: string;
  onAnswerChange: (answer: string) => void;
  disabled?: boolean;
}

export const DiscoveryQuestion: React.FC<DiscoveryQuestionProps> = ({
  question,
  answer,
  onAnswerChange,
  disabled = false,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-focus when component mounts
  useEffect(() => {
    if (textareaRef.current && !disabled) {
      textareaRef.current.focus();
    }
  }, [disabled]);

  return (
    <div className="flex flex-col gap-6 max-w-3xl w-full mx-auto">
      {/* Question */}
      <div className="card scale-in">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">{question.question}</h2>

        {/* Prompts */}
        <div
          className="mb-6 p-4 rounded"
          style={{
            backgroundColor: 'var(--color-primary-light)',
            borderLeft: '4px solid var(--color-primary)',
          }}
        >
          <p className="text-sm font-semibold text-gray-900 mb-2">Consider:</p>
          <ul className="list-disc list-inside space-y-1">
            {question.prompts.map((prompt, index) => (
              <li key={index} className="text-gray-800 text-sm">
                {prompt}
              </li>
            ))}
          </ul>
        </div>

        {/* Answer Textarea */}
        <div>
          <label htmlFor={`answer-${question.id}`} className="form-label">
            Your Answer
          </label>
          <textarea
            ref={textareaRef}
            id={`answer-${question.id}`}
            value={answer}
            onChange={(e) => onAnswerChange(e.target.value)}
            disabled={disabled}
            placeholder="Our target audience is busy professionals, primarily project managers and team leads in tech companies, aged 28-45. They're overwhelmed with scattered tasks across multiple tools and platforms. They value efficiency, organization, and work-life balance. They're tech-savvy early adopters who are willing to try new solutions if they save time and reduce stress..."
            className={`form-textarea ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
            style={{ minHeight: '200px' }}
            aria-label={`Answer for: ${question.question}`}
          />
          <div className="mt-2 text-sm text-gray-500">{answer.length} characters</div>
        </div>
      </div>
    </div>
  );
};
