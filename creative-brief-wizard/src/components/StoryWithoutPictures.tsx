import React from 'react';
import type { StoryWithoutPictures as StoryType, BeatType } from '../types';

interface StoryWithoutPicturesProps {
  data: StoryType;
  onChange: (data: StoryType) => void;
  disabled?: boolean;
}

export const StoryWithoutPictures: React.FC<StoryWithoutPicturesProps> = ({
  data,
  onChange,
  disabled = false,
}) => {
  const handleBeatChange =
    (beatName: keyof StoryType) => (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange({
        ...data,
        [beatName]: {
          ...data[beatName],
          description: e.target.value,
        },
      });
    };

  const handleBeatTypeChange = (beatName: keyof StoryType) => (type: BeatType) => {
    onChange({
      ...data,
      [beatName]: {
        ...data[beatName],
        type,
      },
    });
  };

  const beatLabels = {
    situation: {
      title: '1. Situation',
      description: 'Set the scene - where are we and what is normal?',
    },
    problem: {
      title: '2. Problem',
      description: 'What challenge or need disrupts the situation?',
    },
    tensionReveal: {
      title: '3. Tension/Reveal',
      description: 'What makes this urgent or important?',
    },
    productRole: {
      title: '4. Product Role',
      description: 'How does your product/service address this?',
    },
    resolution: {
      title: '5. Resolution',
      description: 'What is the new reality after using your solution?',
    },
  };

  const renderBeat = (beatKey: keyof StoryType) => {
    const beat = data[beatKey];
    const label = beatLabels[beatKey];

    return (
      <div key={beatKey} className="border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900">{label.title}</h4>
            <p className="text-sm text-gray-600">{label.description}</p>
          </div>
          <div className="flex gap-2 ml-4 flex-shrink-0">
            <button
              type="button"
              onClick={() => handleBeatTypeChange(beatKey)('required')}
              disabled={disabled}
              className={`px-3 py-1 text-xs rounded-full transition-colors ${
                beat.type === 'required'
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              Required
            </button>
            <button
              type="button"
              onClick={() => handleBeatTypeChange(beatKey)('flexible')}
              disabled={disabled}
              className={`px-3 py-1 text-xs rounded-full transition-colors ${
                beat.type === 'flexible'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              Flexible
            </button>
          </div>
        </div>
        <textarea
          value={beat.description}
          onChange={handleBeatChange(beatKey)}
          disabled={disabled}
          placeholder={
            beatKey === 'situation'
              ? 'A project manager sits at their desk surrounded by sticky notes, with multiple browser tabs and apps open. Their calendar is a rainbow of conflicting meetings. This is their daily reality.'
              : beatKey === 'problem'
                ? 'They miss a critical deadline because an important task was buried in one of five different tools. Their team is frustrated. Their boss is concerned.'
                : beatKey === 'tensionReveal'
                  ? "It's not just one person - millions of professionals are drowning in digital chaos. The cost of this disorganization: wasted time, missed opportunities, burnout."
                  : beatKey === 'productRole'
                    ? 'Our AI-powered app learns their workflow patterns, automatically prioritizes tasks across all their tools, and provides a single unified dashboard. Smart notifications only when it matters.'
                    : "The same professional now starts their day with clarity. One glance shows what truly matters. They leave work on time, confident nothing is falling through the cracks. They're in control again."
          }
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed resize-none mt-2"
        />
      </div>
    );
  };

  return (
    <div className="space-y-6 text-left">
      <div className="bg-green-50 border-l-4 border-green-500 p-4 text-left">
        <h3 className="font-semibold text-lg mb-2">Story Without Pictures</h3>
        <p className="text-sm text-gray-700">
          Map out your narrative arc using the five-beat structure. Mark each beat as "Required"
          (must be shown) or "Flexible" (can be implied).
        </p>
      </div>

      <div className="space-y-4">
        {renderBeat('situation')}
        {renderBeat('problem')}
        {renderBeat('tensionReveal')}
        {renderBeat('productRole')}
        {renderBeat('resolution')}
      </div>
    </div>
  );
};
