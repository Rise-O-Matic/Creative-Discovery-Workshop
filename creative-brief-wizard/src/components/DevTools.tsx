import { useEffect, useState } from 'react';
import { useSession } from '../hooks/useSession';
import { useToast } from '../contexts/ToastContext';
import { fillMockData } from '../utils/devTools';

/**
 * DevTools Component
 *
 * Provides developer utilities for testing the Creative Brief Wizard.
 * Only rendered in development mode (import.meta.env.DEV).
 *
 * Features:
 * - Keyboard shortcut (Ctrl/Cmd + Shift + F) to trigger mock data fill
 * - Floating button UI for manual triggering
 * - Confirmation modal before filling data
 * - Options to fill all phases or current phase only
 * - Visual feedback via toast notifications
 */

interface ConfirmationModalProps {
  isOpen: boolean;
  onConfirm: (fillAll: boolean) => void;
  onCancel: () => void;
}

function ConfirmationModal({ isOpen, onConfirm, onCancel }: ConfirmationModalProps) {
  const [fillAll, setFillAll] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onCancel} />

      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Fill Mock Data?</h2>

        <p className="text-gray-700 mb-6">
          This will populate the Creative Brief Wizard with realistic test data for the "EcoBottle Launch Campaign" project.
        </p>

        {/* Options */}
        <div className="mb-6 space-y-3">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="radio"
              name="fillScope"
              checked={fillAll}
              onChange={() => setFillAll(true)}
              className="w-4 h-4 text-blue-600"
            />
            <div>
              <div className="font-medium text-gray-900">Fill All Phases</div>
              <div className="text-sm text-gray-600">
                Populate all sections with complete mock data
              </div>
            </div>
          </label>

          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="radio"
              name="fillScope"
              checked={!fillAll}
              onChange={() => setFillAll(false)}
              className="w-4 h-4 text-blue-600"
            />
            <div>
              <div className="font-medium text-gray-900">Fill Current Phase Only</div>
              <div className="text-sm text-gray-600">
                Only populate data for the current phase (preserves existing data)
              </div>
            </div>
          </label>
        </div>

        {/* Warning */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-6">
          <div className="flex items-start">
            <svg
              className="w-5 h-5 text-yellow-600 mt-0.5 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <div className="text-sm text-yellow-800">
              This will overwrite existing session data. Make sure to export any work you want to keep.
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(fillAll)}
            className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
          >
            Fill Mock Data
          </button>
        </div>
      </div>
    </div>
  );
}

export function DevTools() {
  const [showModal, setShowModal] = useState(false);
  const [showButton, setShowButton] = useState(true);
  const { state, forceUpdate } = useSession();
  const { addToast } = useToast();

  // Keyboard shortcut handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + Shift + F
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'F') {
        e.preventDefault();
        setShowModal(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleConfirm = (fillAll: boolean) => {
    try {
      // Generate mock data
      const updatedState = fillMockData(state, {
        fillAll,
        overwrite: true,
      });

      // Update the session state
      // We need to manually update because we're replacing the entire state
      Object.assign(state, updatedState);
      forceUpdate();

      // Show success toast
      addToast(
        `Mock data filled successfully! ${fillAll ? 'All phases' : 'Current phase'} populated with EcoBottle campaign data.`,
        'success',
        5000
      );

      setShowModal(false);
    } catch (error) {
      console.error('Error filling mock data:', error);
      addToast('Failed to fill mock data. Check console for details.', 'error', 5000);
    }
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  return (
    <>
      {/* Floating Button */}
      {showButton && (
        <div className="fixed bottom-6 right-6 z-40">
          <button
            onClick={() => setShowModal(true)}
            className="group relative bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
            title="Fill Mock Data (Ctrl/Cmd + Shift + F)"
          >
            {/* Icon: Flask/Test Tube */}
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
              />
            </svg>

            {/* Tooltip */}
            <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block">
              <div className="bg-gray-900 text-white text-sm rounded-md px-3 py-2 whitespace-nowrap">
                Fill Mock Data
                <div className="text-xs text-gray-400 mt-1">
                  Ctrl/Cmd + Shift + F
                </div>
              </div>
            </div>

            {/* DEV Badge */}
            <div className="absolute -top-1 -right-1 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
              DEV
            </div>
          </button>

          {/* Close button for the floating button */}
          <button
            onClick={() => setShowButton(false)}
            className="absolute -top-2 -left-2 bg-gray-700 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-gray-800 transition-colors"
            title="Hide dev tools button"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      )}

      {/* Show button toggle if hidden */}
      {!showButton && (
        <button
          onClick={() => setShowButton(true)}
          className="fixed bottom-6 right-6 z-40 bg-gray-700 text-white rounded-full p-3 shadow-lg hover:bg-gray-800 transition-colors"
          title="Show dev tools"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showModal}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </>
  );
}
