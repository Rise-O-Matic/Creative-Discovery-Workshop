import React from 'react';
import type { OneSentenceThreeLenses as OneSentenceType } from '../types';

interface OneSentenceThreeLensesProps {
  data: OneSentenceType;
  onChange: (data: OneSentenceType) => void;
  disabled?: boolean;
}

export const OneSentenceThreeLenses: React.FC<OneSentenceThreeLensesProps> = ({
  data,
  onChange,
  disabled = false,
}) => {
  const handleChange =
    (field: keyof OneSentenceType) => (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange({
        ...data,
        [field]: e.target.value,
      });
    };

  return (
    <div className="space-y-6 text-left">
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 text-left">
        <h3 className="font-semibold text-lg mb-2">One Sentence, Three Lenses</h3>
        <p className="text-sm text-gray-700">
          Express your project's purpose through three different perspectives.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="makePeopleFeel" className="block text-sm font-medium text-gray-700 mb-2">
            1. Make people feel...
          </label>
          <textarea
            id="makePeopleFeel"
            value={data.makePeopleFeel}
            onChange={handleChange('makePeopleFeel')}
            disabled={disabled}
            placeholder="Relieved and empowered - like they've finally found a solution to their chaos. We want them to feel hopeful that they can regain control of their workday and reduce their stress."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed resize-none"
          />
        </div>

        <div>
          <label
            htmlFor="helpOrganization"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            2. Help our organization...
          </label>
          <textarea
            id="helpOrganization"
            value={data.helpOrganization}
            onChange={handleChange('helpOrganization')}
            disabled={disabled}
            placeholder="Establish ourselves as leaders in AI-powered productivity tools, increase market share by 15%, and achieve 50,000 active users in our first quarter post-launch."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed resize-none"
          />
        </div>

        <div>
          <label htmlFor="showThatWe" className="block text-sm font-medium text-gray-700 mb-2">
            3. Show that we...
          </label>
          <textarea
            id="showThatWe"
            value={data.showThatWe}
            onChange={handleChange('showThatWe')}
            disabled={disabled}
            placeholder="Understand the real struggles of modern professionals, combine cutting-edge AI technology with thoughtful user experience design, and genuinely care about helping people work smarter, not harder."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed resize-none"
          />
        </div>
      </div>
    </div>
  );
};
