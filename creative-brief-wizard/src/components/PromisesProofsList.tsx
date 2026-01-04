import React, { useState } from 'react';
import { Trash2, Plus } from 'lucide-react';
import type { PromiseProof } from '../types';

interface PromisesProofsListProps {
  promisesAndProofs: PromiseProof[];
  onChange: (promisesAndProofs: PromiseProof[]) => void;
  disabled?: boolean;
}

export const PromisesProofsList: React.FC<PromisesProofsListProps> = ({
  promisesAndProofs,
  onChange,
  disabled = false,
}) => {
  const [newClaim, setNewClaim] = useState('');
  const [newProof, setNewProof] = useState('');

  const addPromiseProof = () => {
    if (newClaim.trim() && newProof.trim()) {
      onChange([
        ...promisesAndProofs,
        {
          claim: newClaim.trim(),
          visualProof: newProof.trim(),
        },
      ]);
      setNewClaim('');
      setNewProof('');
    }
  };

  const removePromiseProof = (index: number) => {
    onChange(promisesAndProofs.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4 text-left">
      <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 text-left">
        <h3 className="font-semibold text-lg mb-2">Promises & Proofs</h3>
        <p className="text-sm text-gray-700">
          For each claim you make, provide visual proof to back it up.
        </p>
      </div>

      <div className="space-y-3">
        {promisesAndProofs.map((item, index) => (
          <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 text-left">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 text-left">
                <div className="mb-2">
                  <span className="text-xs font-semibold text-gray-500 uppercase">Claim</span>
                  <p className="text-sm text-gray-900 mt-1 text-left">{item.claim}</p>
                </div>
                <div>
                  <span className="text-xs font-semibold text-gray-500 uppercase">
                    Visual Proof
                  </span>
                  <p className="text-sm text-gray-900 mt-1 text-left">{item.visualProof}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => removePromiseProof(index)}
                disabled={disabled}
                className="ml-3 text-red-500 hover:text-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Remove promise and proof"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}

        {promisesAndProofs.length === 0 && (
          <p className="text-sm text-gray-500 italic p-4 text-center">
            No promises & proofs added yet. Add items to support your claims.
          </p>
        )}
      </div>

      <div className="border border-gray-300 rounded-lg p-4 bg-gray-50 space-y-3">
        <div>
          <label htmlFor="newClaim" className="block text-sm font-medium text-gray-700 mb-1">
            Claim / Promise
          </label>
          <textarea
            id="newClaim"
            value={newClaim}
            onChange={(e) => setNewClaim(e.target.value)}
            disabled={disabled}
            placeholder="Our app saves users 2 hours per day on task management"
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed resize-none"
          />
        </div>

        <div>
          <label htmlFor="newProof" className="block text-sm font-medium text-gray-700 mb-1">
            Visual Proof
          </label>
          <textarea
            id="newProof"
            value={newProof}
            onChange={(e) => setNewProof(e.target.value)}
            disabled={disabled}
            placeholder="Show time-lapse animation of a cluttered task board transforming into a clean, organized dashboard. Display before/after metrics showing '47 scattered tasks → 3 priority actions'. Include testimonial overlay with real user stats."
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed resize-none"
          />
        </div>

        <button
          type="button"
          onClick={addPromiseProof}
          disabled={disabled || !newClaim.trim() || !newProof.trim()}
          className="w-full px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Plus size={16} />
          Add Promise & Proof
        </button>
      </div>
    </div>
  );
};
