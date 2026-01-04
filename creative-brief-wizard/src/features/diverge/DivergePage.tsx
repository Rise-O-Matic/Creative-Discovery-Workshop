import React, { useEffect, useCallback } from 'react';
import { Canvas } from '../../components/Canvas';
import { useStickyNotes } from '../../hooks/useStickyNotes';
import { useSession } from '../../hooks/useSession';

export const DivergePage: React.FC = () => {
  const { state, setPhase } = useSession();
  const { notes, createNote, updateNoteText, moveNote, deleteNote } = useStickyNotes();

  // Get the current exercise
  const currentExercise = state.stickyNoteExercise;

  const handleAddNote = useCallback(() => {
    // Create note at center of viewport with some randomness
    const x = window.innerWidth / 2 + Math.random() * 200 - 100;
    const y = window.innerHeight / 2 + Math.random() * 200 - 100;

    createNote('', x, y);
  }, [createNote]);

  // Keyboard shortcut for adding notes
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Ctrl/Cmd + N to add new note
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        handleAddNote();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleAddNote]);

  const focusPrompt =
    currentExercise.focusPrompt ||
    'What ideas, questions, or concerns come to mind about this project?';

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Diverge Phase</h1>
          <p className="text-gray-600 mb-4">{focusPrompt}</p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                {notes.length} {notes.length === 1 ? 'note' : 'notes'}
              </div>

              <button
                onClick={handleAddNote}
                className="px-4 py-2 bg-yellow-400 text-gray-900 font-medium rounded-lg hover:bg-yellow-500 transition-colors shadow-sm"
                aria-label="Add new sticky note (Ctrl+N)"
                title="Add new sticky note (Ctrl+N)"
              >
                + Add Note
              </button>

              <button
                onClick={() => setPhase('sticky-notes-converge')}
                className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
              >
                Continue to Clustering →
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Canvas */}
      <main className="flex-1 overflow-hidden">
        <div className="h-full max-w-7xl mx-auto">
          <Canvas
            notes={notes}
            onUpdateNote={updateNoteText}
            onDeleteNote={deleteNote}
            onMoveNote={moveNote}
            disabled={false}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 px-6 py-3">
        <div className="max-w-7xl mx-auto text-center text-sm text-gray-600">
          <p>
            Press <kbd className="px-2 py-1 bg-gray-200 rounded">Ctrl+N</kbd> to add a new note
          </p>
        </div>
      </footer>
    </div>
  );
};
