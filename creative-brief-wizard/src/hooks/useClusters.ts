import { useCallback, useMemo } from 'react';
import { useSession } from './useSession';
import type { Cluster, StickyNote } from '../types';

/**
 * Hook for managing clusters
 * Provides CRUD operations and AI summary management
 */
export function useClusters() {
  const { state, addCluster, updateCluster, deleteCluster, moveCluster, resizeCluster } =
    useSession();

  const clusters = state.stickyNoteExercise.clusters;
  const notes = state.stickyNoteExercise.notes;

  /**
   * Create a new cluster
   */
  const createCluster = useCallback(
    (title: string, x = 0, y = 0, width = 300, height = 200) => {
      addCluster({
        title,
        noteIds: [],
        aiSummary: '',
        x,
        y,
        width,
        height,
      });
    },
    [addCluster]
  );

  /**
   * Update cluster title
   */
  const updateClusterTitle = useCallback(
    (id: string, title: string) => {
      updateCluster(id, { title });
    },
    [updateCluster]
  );

  /**
   * Update cluster AI summary
   */
  const updateClusterSummary = useCallback(
    (id: string, aiSummary: string) => {
      updateCluster(id, { aiSummary });
    },
    [updateCluster]
  );

  /**
   * Move cluster to position
   */
  const moveClusterTo = useCallback(
    (id: string, x: number, y: number) => {
      moveCluster(id, x, y);
    },
    [moveCluster]
  );

  /**
   * Resize cluster
   */
  const resizeClusterTo = useCallback(
    (id: string, width: number, height: number) => {
      resizeCluster(id, width, height);
    },
    [resizeCluster]
  );

  /**
   * Delete cluster
   */
  const removeCluster = useCallback(
    (id: string) => {
      deleteCluster(id);
    },
    [deleteCluster]
  );

  /**
   * Get notes in a cluster
   */
  const getClusterNotes = useCallback(
    (clusterId: string): StickyNote[] => {
      const cluster = clusters.find((c) => c.id === clusterId);
      if (!cluster) return [];
      return notes.filter((note) => cluster.noteIds.includes(note.id));
    },
    [clusters, notes]
  );

  /**
   * Get cluster by ID
   */
  const getCluster = useCallback(
    (clusterId: string): Cluster | undefined => {
      return clusters.find((c) => c.id === clusterId);
    },
    [clusters]
  );

  /**
   * Get clusters with their notes
   */
  const clustersWithNotes = useMemo(() => {
    return clusters.map((cluster) => ({
      cluster,
      notes: getClusterNotes(cluster.id),
    }));
  }, [clusters, getClusterNotes]);

  /**
   * Get clusters without AI summaries
   */
  const clustersNeedingSummary = useMemo(() => {
    return clusters.filter((c) => !c.aiSummary || c.aiSummary.trim() === '');
  }, [clusters]);

  /**
   * Check if all clusters have summaries
   */
  const allClustersHaveSummaries = useMemo(() => {
    return clusters.length > 0 && clustersNeedingSummary.length === 0;
  }, [clusters, clustersNeedingSummary]);

  /**
   * Batch update summaries
   */
  const batchUpdateSummaries = useCallback(
    (summaries: Record<string, string>) => {
      Object.entries(summaries).forEach(([clusterId, summary]) => {
        updateClusterSummary(clusterId, summary);
      });
    },
    [updateClusterSummary]
  );

  /**
   * Calculate cluster bounds based on notes
   */
  const calculateClusterBounds = useCallback(
    (clusterId: string, padding = 20) => {
      const clusterNotes = getClusterNotes(clusterId);
      if (clusterNotes.length === 0) {
        return null;
      }

      // Assuming each note has a default size (can be customized)
      const noteWidth = 100;
      const noteHeight = 100;

      const minX = Math.min(...clusterNotes.map((n) => n.x)) - padding;
      const minY = Math.min(...clusterNotes.map((n) => n.y)) - padding;
      const maxX = Math.max(...clusterNotes.map((n) => n.x + noteWidth)) + padding;
      const maxY = Math.max(...clusterNotes.map((n) => n.y + noteHeight)) + padding;

      return {
        x: minX,
        y: minY,
        width: maxX - minX,
        height: maxY - minY,
      };
    },
    [getClusterNotes]
  );

  /**
   * Auto-fit cluster bounds to its notes
   */
  const autoFitCluster = useCallback(
    (clusterId: string) => {
      const bounds = calculateClusterBounds(clusterId);
      if (bounds) {
        moveClusterTo(clusterId, bounds.x, bounds.y);
        resizeClusterTo(clusterId, bounds.width, bounds.height);
      }
    },
    [calculateClusterBounds, moveClusterTo, resizeClusterTo]
  );

  return {
    // State
    clusters,
    clustersWithNotes,
    clustersNeedingSummary,
    allClustersHaveSummaries,

    // CRUD operations
    createCluster,
    updateClusterTitle,
    updateClusterSummary,
    moveClusterTo,
    resizeClusterTo,
    removeCluster,

    // Utility
    getCluster,
    getClusterNotes,
    calculateClusterBounds,
    autoFitCluster,

    // Batch operations
    batchUpdateSummaries,
  };
}
