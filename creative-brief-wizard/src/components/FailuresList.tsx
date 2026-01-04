import React, { useState } from 'react';
import { Trash2, Plus } from 'lucide-react';

interface FailuresListProps {
  failures: string[];
  onChange: (failures: string[]) => void;
  disabled?: boolean;
}

export const FailuresList: React.FC<FailuresListProps> = ({
  failures,
  onChange,
  disabled = false,
}) => {
  const [newFailure, setNewFailure] = useState('');

  const addFailure = () => {
    if (newFailure.trim()) {
      onChange([...failures, newFailure.trim()]);
      setNewFailure('');
    }
  };

  const removeFailure = (index: number) => {
    onChange(failures.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      addFailure();
    }
  };

  return (
    <div className="space-y-4 text-left">
      <div className="bg-red-50 border-l-4 border-red-500 p-4 text-left">
        <h3 className="font-semibold text-lg mb-2">Failures to Avoid</h3>
        <p className="text-sm text-gray-700">
          List past creative failures or pitfalls to avoid in this project.
        </p>
      </div>

      <div className="space-y-2">
        {failures.map((failure, index) => (
          <div
            key={index}
            className="flex items-start gap-2 bg-white border border-gray-200 rounded-lg p-3 text-left"
          >
            <span className="flex-1 text-sm text-gray-900 text-left">{failure}</span>
            <button
              type="button"
              onClick={() => removeFailure(index)}
              disabled={disabled}
              className="text-red-500 hover:text-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Remove failure"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}

        {failures.length === 0 && (
          <p className="text-sm text-gray-500 italic p-4 text-center">
            No failures added yet. Add items to avoid past mistakes.
          </p>
        )}
      </div>

      <div className="flex gap-2">
        <textarea
          value={newFailure}
          onChange={(e) => setNewFailure(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder="Our last product video was too technical and lost viewers in the first 10 seconds. The demo focused on features instead of benefits, and we didn't show any real users or emotional connection."
          rows={2}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed resize-none"
        />
        <button
          type="button"
          onClick={addFailure}
          disabled={disabled || !newFailure.trim()}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <Plus size={16} />
          Add
        </button>
      </div>
    </div>
  );
};
