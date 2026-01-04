import React from 'react';
import type { ViewersInMirror as ViewersType } from '../types';

interface ViewersInMirrorProps {
  data: ViewersType;
  onChange: (data: ViewersType) => void;
  disabled?: boolean;
}

export const ViewersInMirror: React.FC<ViewersInMirrorProps> = ({
  data,
  onChange,
  disabled = false,
}) => {
  const handleChange =
    (field: keyof ViewersType) => (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange({
        ...data,
        [field]: e.target.value,
      });
    };

  return (
    <div className="space-y-6 text-left">
      <div className="bg-purple-50 border-l-4 border-purple-500 p-4 text-left">
        <h3 className="font-semibold text-lg mb-2">Viewers in the Mirror</h3>
        <p className="text-sm text-gray-700">Understand your audience's context and motivations.</p>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="whereWatching" className="block text-sm font-medium text-gray-700 mb-2">
            1. Where are they watching?
          </label>
          <textarea
            id="whereWatching"
            value={data.whereWatching}
            onChange={handleChange('whereWatching')}
            disabled={disabled}
            placeholder="They're scrolling through LinkedIn during their morning commute or watching on our website during a quick work break. On mobile devices primarily, with sound often off initially. They're in a distracted environment - multitasking or looking for a reason to engage."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed resize-none"
          />
        </div>

        <div>
          <label htmlFor="feelingBefore" className="block text-sm font-medium text-gray-700 mb-2">
            2. How are they feeling before?
          </label>
          <textarea
            id="feelingBefore"
            value={data.feelingBefore}
            onChange={handleChange('feelingBefore')}
            disabled={disabled}
            placeholder="Stressed and overwhelmed. They're already thinking about their overflowing to-do list. Slightly cynical about 'another productivity tool' - they've been disappointed before. Curious but guarded about new solutions."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed resize-none"
          />
        </div>

        <div>
          <label htmlFor="stopWatchingIf" className="block text-sm font-medium text-gray-700 mb-2">
            3. They'll stop watching if...
          </label>
          <textarea
            id="stopWatchingIf"
            value={data.stopWatchingIf}
            onChange={handleChange('stopWatchingIf')}
            disabled={disabled}
            placeholder="It feels like a generic sales pitch, uses too much jargon, doesn't show real results quickly, or if it doesn't acknowledge their specific pain points. They'll scroll past if the first 3 seconds don't grab them emotionally."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed resize-none"
          />
        </div>
      </div>
    </div>
  );
};
