import { useCallback, useMemo } from 'react';
import { useSession } from './useSession';
import type { StickyNote } from '../types';

/**
 * Hook for managing sticky notes
 * Provides CRUD operations and utility functions
 */
export function useStickyNotes() {
  const {
    state,
    addStickyNote,
    updateStickyNote,
    deleteStickyNote,
    moveStickyNote,
    assignNoteToCluster,
  } = useSession();

  const notes = state.stickyNoteExercise.notes;

  /**
   * Create a new sticky note
   */
  const createNote = useCallback(
    (text: string, x = 0, y = 0) => {
      addStickyNote({ text, x, y, clusterId: null });
    },
    [addStickyNote]
  );

  /**
   * Update note text
   */
  const updateNoteText = useCallback(
    (id: string, text: string) => {
      updateStickyNote(id, { text });
    },
    [updateStickyNote]
  );

  /**
   * Move note to position
   */
  const moveNote = useCallback(
    (id: string, x: number, y: number) => {
      moveStickyNote(id, x, y);
    },
    [moveStickyNote]
  );

  /**
   * Delete a note
   */
  const deleteNote = useCallback(
    (id: string) => {
      deleteStickyNote(id);
    },
    [deleteStickyNote]
  );

  /**
   * Assign note to cluster
   */
  const assignToCluster = useCallback(
    (noteId: string, clusterId: string | null) => {
      assignNoteToCluster(noteId, clusterId);
    },
    [assignNoteToCluster]
  );

  /**
   * Get notes by cluster
   */
  const getNotesByCluster = useCallback(
    (clusterId: string | null): StickyNote[] => {
      return notes.filter((note) => note.clusterId === clusterId);
    },
    [notes]
  );

  /**
   * Get unclustered notes
   */
  const unclusteredNotes = useMemo(() => {
    return notes.filter((note) => note.clusterId === null);
  }, [notes]);

  /**
   * Get clustered notes
   */
  const clusteredNotes = useMemo(() => {
    return notes.filter((note) => note.clusterId !== null);
  }, [notes]);

  /**
   * Batch create notes
   */
  const batchCreateNotes = useCallback(
    (texts: string[], startX = 0, startY = 0, spacing = 120) => {
      texts.forEach((text, index) => {
        const x = startX + (index % 5) * spacing;
        const y = startY + Math.floor(index / 5) * spacing;
        createNote(text, x, y);
      });
    },
    [createNote]
  );

  /**
   * Batch delete notes
   */
  const batchDeleteNotes = useCallback(
    (noteIds: string[]) => {
      noteIds.forEach((id) => deleteNote(id));
    },
    [deleteNote]
  );

  /**
   * Batch assign notes to cluster
   */
  const batchAssignToCluster = useCallback(
    (noteIds: string[], clusterId: string | null) => {
      noteIds.forEach((id) => assignToCluster(id, clusterId));
    },
    [assignToCluster]
  );

  return {
    // State
    notes,
    unclusteredNotes,
    clusteredNotes,

    // CRUD operations
    createNote,
    updateNoteText,
    moveNote,
    deleteNote,
    assignToCluster,

    // Utility
    getNotesByCluster,

    // Batch operations
    batchCreateNotes,
    batchDeleteNotes,
    batchAssignToCluster,
  };
}
