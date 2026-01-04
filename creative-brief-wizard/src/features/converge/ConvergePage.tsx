import React, { useEffect, useState } from 'react';
import { CanvasWithClusters } from '../../components/CanvasWithClusters';
import { useStickyNotes } from '../../hooks/useStickyNotes';
import { useClusters } from '../../hooks/useClusters';
import { useSession } from '../../hooks/useSession';
import { SynthesisService } from '../../services/llm';

export const ConvergePage: React.FC = () => {
  const { assignNoteToCluster, state, setPhase } = useSession();
  const { notes, updateNoteText, deleteNote, moveNote, unclusteredNotes, clusteredNotes } =
    useStickyNotes();
  const {
    clusters,
    createCluster,
    updateClusterTitle,
    removeCluster,
    moveClusterTo,
    getClusterNotes,
    updateClusterSummary,
  } = useClusters();

  const [isCreatingCluster, setIsCreatingCluster] = useState(false);
  const [newClusterTitle, setNewClusterTitle] = useState('');
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [synthesisError, setSynthesisError] = useState<string | null>(null);
  const [showSummaries, setShowSummaries] = useState(false);

  // Auto-focus on cluster title input when creating
  useEffect(() => {
    if (isCreatingCluster) {
      document.getElementById('new-cluster-title')?.focus();
    }
  }, [isCreatingCluster]);

  const handleCreateCluster = () => {
    if (newClusterTitle.trim()) {
      // Find a good position for the new cluster (offset from last cluster or default position)
      const lastCluster = clusters[clusters.length - 1];
      const x = lastCluster ? lastCluster.x + 350 : 100;
      const y = lastCluster ? lastCluster.y : 100;

      createCluster(newClusterTitle.trim(), x, y, 400, 300);
      setNewClusterTitle('');
      setIsCreatingCluster(false);
    }
  };

  const handleCancelCreate = () => {
    setNewClusterTitle('');
    setIsCreatingCluster(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCreateCluster();
    } else if (e.key === 'Escape') {
      handleCancelCreate();
    }
  };

  const handleRemoveNoteFromCluster = (noteId: string) => {
    assignNoteToCluster(noteId, null);
  };

  const handleSynthesizeClusters = async () => {
    if (clusters.length === 0) {
      setSynthesisError('No clusters to synthesize');
      return;
    }

    setIsSynthesizing(true);
    setSynthesisError(null);

    try {
      // Create synthesis service with current LLM config
      const synthesisService = new SynthesisService({
        provider: state.llmConfig.provider,
        apiKey: state.llmConfig.apiKey,
        model: state.llmConfig.model,
      });

      // Synthesize each cluster
      for (const cluster of clusters) {
        const clusterNotes = getClusterNotes(cluster.id);
        if (clusterNotes.length > 0) {
          try {
            const summary = await synthesisService.synthesizeCluster(cluster.title, clusterNotes);
            updateClusterSummary(cluster.id, summary);
          } catch (error) {
            console.error(`Failed to synthesize cluster ${cluster.id}:`, error);
            // Continue with other clusters even if one fails
          }
        }
      }

      setShowSummaries(true);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to synthesize clusters';
      setSynthesisError(errorMessage);
    } finally {
      setIsSynthesizing(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b-2 border-blue-200">
        <div className="flex-1 mr-80">
          <h1 className="text-2xl font-bold text-gray-800">Converge Phase</h1>
          <p className="text-sm text-gray-600 mt-1">
            Drag sticky notes into clusters to organize your ideas by theme
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between px-6 py-3 bg-gray-50 border-b border-gray-200 mr-80">
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-700">
            <span className="font-semibold">{unclusteredNotes.length}</span> unclustered notes
            <span className="mx-2">•</span>
            <span className="font-semibold">{clusters.length}</span> clusters
            <span className="mx-2">•</span>
            <span className="font-semibold">{clusteredNotes.length}</span> notes in clusters
          </div>
        </div>

        <div className="flex items-center gap-3">
          {!isCreatingCluster ? (
            <>
              <button
                onClick={() => setIsCreatingCluster(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              >
                + Create Cluster
              </button>
              <button
                onClick={handleSynthesizeClusters}
                disabled={isSynthesizing || clusters.length === 0}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Generate AI summaries for all clusters"
              >
                {isSynthesizing ? 'Synthesizing...' : '✨ Generate Summaries'}
              </button>
              <button
                onClick={() => setShowSummaries(!showSummaries)}
                disabled={clusters.length === 0}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Toggle AI summary display"
              >
                {showSummaries ? 'Hide' : 'Show'} Summaries
              </button>
              <button
                onClick={() => setPhase('spot-exercises')}
                className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors shadow-sm"
              >
                Continue to Exercises →
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <input
                id="new-cluster-title"
                type="text"
                value={newClusterTitle}
                onChange={(e) => setNewClusterTitle(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter cluster name..."
                className="px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleCreateCluster}
                disabled={!newClusterTitle.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create
              </button>
              <button
                onClick={handleCancelCreate}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Synthesis Error */}
      {synthesisError && (
        <div className="mx-6 mt-2 mr-80 px-4 py-2 bg-red-50 border border-red-300 rounded-md text-red-700 text-sm">
          <strong>Error:</strong> {synthesisError}
          <button
            onClick={() => setSynthesisError(null)}
            className="ml-2 text-red-500 hover:text-red-700 font-bold"
          >
            ×
          </button>
        </div>
      )}

      {/* Main Canvas */}
      <div className="flex-1 overflow-hidden p-6 mr-80">
        <CanvasWithClusters
          notes={notes}
          clusters={clusters}
          onUpdateNote={updateNoteText}
          onDeleteNote={deleteNote}
          onMoveNote={moveNote}
          onUpdateCluster={updateClusterTitle}
          onDeleteCluster={removeCluster}
          onMoveCluster={moveClusterTo}
          onAssignNoteToCluster={assignNoteToCluster}
          disabled={false}
          showClusterSummaries={showSummaries}
        />
      </div>

      {/* Sidebar: Cluster List */}
      <div className="fixed right-0 top-0 bottom-0 w-80 bg-white border-l border-gray-200 shadow-lg overflow-y-auto" style={{ zIndex: 'var(--z-sticky)' }}>
        <div className="p-4 bg-blue-50 border-b border-blue-200">
          <h2 className="text-lg font-semibold text-gray-800">Clusters</h2>
          <p className="text-xs text-gray-600 mt-1">Click on clusters to see their notes</p>
        </div>

        <div className="p-4 space-y-3">
          {clusters.length === 0 ? (
            <div className="text-center text-gray-500 text-sm py-8">
              No clusters yet. Create one to start organizing!
            </div>
          ) : (
            clusters.map((cluster) => {
              const clusterNotes = getClusterNotes(cluster.id);
              return (
                <div
                  key={cluster.id}
                  className="border border-blue-200 rounded-lg p-3 bg-blue-50 hover:bg-blue-100 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 text-sm">{cluster.title}</h3>
                      <p className="text-xs text-gray-600 mt-1">
                        {clusterNotes.length} {clusterNotes.length === 1 ? 'note' : 'notes'}
                      </p>
                    </div>
                    <button
                      onClick={() => removeCluster(cluster.id)}
                      className="text-gray-400 hover:text-red-600 text-lg font-bold leading-none"
                      aria-label="Delete cluster"
                      title="Delete cluster"
                    >
                      ×
                    </button>
                  </div>

                  {clusterNotes.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {clusterNotes.map((note) => (
                        <div
                          key={note.id}
                          className="text-xs bg-white rounded p-2 border border-gray-200 flex items-start justify-between"
                        >
                          <span className="flex-1 text-gray-700 line-clamp-2">{note.text}</span>
                          <button
                            onClick={() => handleRemoveNoteFromCluster(note.id)}
                            className="ml-2 text-gray-400 hover:text-red-500 text-sm"
                            title="Remove from cluster"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Instructions Overlay (show if no clusters exist) */}
      {clusters.length === 0 && notes.length > 0 && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white border-2 border-blue-400 rounded-lg shadow-xl p-6 max-w-md" style={{ zIndex: 'var(--z-modal)', marginRight: '320px' }}>
          <h3 className="text-lg font-bold text-gray-800 mb-2">Get Started</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
            <li>Click "Create Cluster" to create a new group</li>
            <li>Give your cluster a descriptive name</li>
            <li>Drag sticky notes into the cluster boundary</li>
            <li>Repeat to organize all your ideas by theme</li>
          </ol>
          <button
            onClick={() => setIsCreatingCluster(true)}
            className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Create Your First Cluster
          </button>
        </div>
      )}
    </div>
  );
};
