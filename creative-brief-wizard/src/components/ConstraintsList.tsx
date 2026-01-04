import React, { useState } from 'react';
import { Trash2, Plus } from 'lucide-react';
import type { Constraint } from '../types';

interface ConstraintsListProps {
  constraints: Constraint[];
  onChange: (constraints: Constraint[]) => void;
  disabled?: boolean;
}

export const ConstraintsList: React.FC<ConstraintsListProps> = ({
  constraints,
  onChange,
  disabled = false,
}) => {
  const [newDescription, setNewDescription] = useState('');
  const [newImplication, setNewImplication] = useState('');

  const addConstraint = () => {
    if (newDescription.trim() && newImplication.trim()) {
      onChange([
        ...constraints,
        {
          description: newDescription.trim(),
          styleImplication: newImplication.trim(),
        },
      ]);
      setNewDescription('');
      setNewImplication('');
    }
  };

  const removeConstraint = (index: number) => {
    onChange(constraints.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4 text-left">
      <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 text-left">
        <h3 className="font-semibold text-lg mb-2">Constraints & Style Implications</h3>
        <p className="text-sm text-gray-700">
          Identify constraints and what they mean for your creative approach.
        </p>
      </div>

      <div className="space-y-3">
        {constraints.map((item, index) => (
          <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 text-left">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 text-left">
                <div className="mb-2">
                  <span className="text-xs font-semibold text-gray-500 uppercase">Constraint</span>
                  <p className="text-sm text-gray-900 mt-1">{item.description}</p>
                </div>
                <div>
                  <span className="text-xs font-semibold text-gray-500 uppercase">
                    Style Implication
                  </span>
                  <p className="text-sm text-gray-900 mt-1">{item.styleImplication}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeConstraint(index)}
                disabled={disabled}
                className="ml-3 text-red-500 hover:text-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Remove constraint"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}

        {constraints.length === 0 && (
          <p className="text-sm text-gray-500 italic p-4 text-center">
            No constraints added yet. Add items to define creative boundaries.
          </p>
        )}
      </div>

      <div className="border border-gray-300 rounded-lg p-4 bg-gray-50 space-y-3">
        <div>
          <label htmlFor="newDescription" className="block text-sm font-medium text-gray-700 mb-1">
            Constraint Description
          </label>
          <textarea
            id="newDescription"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            disabled={disabled}
            placeholder="Video must work with sound off (60% of viewers watch muted on social media)"
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed resize-none"
          />
        </div>

        <div>
          <label htmlFor="newImplication" className="block text-sm font-medium text-gray-700 mb-1">
            Style Implication
          </label>
          <textarea
            id="newImplication"
            value={newImplication}
            onChange={(e) => setNewImplication(e.target.value)}
            disabled={disabled}
            placeholder="We need strong visual storytelling with text overlays, kinetic typography, and expressive animations. The story must be clear without any dialogue or narration. Focus on clear visual metaphors and on-screen text to convey key messages."
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed resize-none"
          />
        </div>

        <button
          type="button"
          onClick={addConstraint}
          disabled={disabled || !newDescription.trim() || !newImplication.trim()}
          className="w-full px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Plus size={16} />
          Add Constraint
        </button>
      </div>
    </div>
  );
};
