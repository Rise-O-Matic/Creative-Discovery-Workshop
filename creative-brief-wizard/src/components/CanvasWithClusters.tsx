import React, { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  type DragEndEvent,
  type DragStartEvent,
  pointerWithin,
} from '@dnd-kit/core';
import { StickyNote } from './StickyNote';
import { Cluster } from './Cluster';
import type { StickyNote as StickyNoteType, Cluster as ClusterType } from '../types';

interface CanvasWithClustersProps {
  notes: StickyNoteType[];
  clusters: ClusterType[];
  onUpdateNote: (id: string, text: string) => void;
  onDeleteNote: (id: string) => void;
  onMoveNote: (id: string, x: number, y: number) => void;
  onUpdateCluster: (id: string, title: string) => void;
  onDeleteCluster: (id: string) => void;
  onMoveCluster: (id: string, x: number, y: number) => void;
  onAssignNoteToCluster?: (noteId: string, clusterId: string | null) => void;
  disabled?: boolean;
  showClusterSummaries?: boolean;
}

export const CanvasWithClusters: React.FC<CanvasWithClustersProps> = ({
  notes,
  clusters,
  onUpdateNote,
  onDeleteNote,
  onMoveNote,
  onUpdateCluster,
  onDeleteCluster,
  onMoveCluster,
  onAssignNoteToCluster,
  disabled = false,
  showClusterSummaries = false,
}) => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeType, setActiveType] = useState<'note' | 'cluster' | null>(null);

  const handleDragStart = (event: DragStartEvent) => {
    const id = event.active.id as string;
    const data = event.active.data.current;

    if (data?.type === 'cluster') {
      setActiveType('cluster');
      setActiveId(id.replace('cluster-', ''));
    } else {
      setActiveType('note');
      setActiveId(id);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, delta, over } = event;

    if (activeType === 'note') {
      const noteId = active.id as string;
      const note = notes.find((n) => n.id === noteId);

      if (note) {
        const newX = note.x + delta.x;
        const newY = note.y + delta.y;
        onMoveNote(noteId, newX, newY);

        // Check if note was dropped on a cluster
        if (over && onAssignNoteToCluster) {
          const overData = over.data.current;
          if (overData?.type === 'cluster-drop') {
            const clusterId = overData.cluster.id;
            onAssignNoteToCluster(noteId, clusterId);
          }
        }
      }
    } else if (activeType === 'cluster') {
      const clusterId = (active.id as string).replace('cluster-', '');
      const cluster = clusters.find((c) => c.id === clusterId);

      if (cluster) {
        const newX = cluster.x + delta.x;
        const newY = cluster.y + delta.y;
        onMoveCluster(clusterId, newX, newY);
      }
    }

    setActiveId(null);
    setActiveType(null);
  };

  const handleDragCancel = () => {
    setActiveId(null);
    setActiveType(null);
  };

  const activeNote =
    activeId && activeType === 'note' ? notes.find((n) => n.id === activeId) : null;
  const activeCluster =
    activeId && activeType === 'cluster' ? clusters.find((c) => c.id === activeId) : null;

  return (
    <div
      className="relative w-full h-full bg-gray-50 overflow-auto border-2 border-gray-200 rounded-lg"
      style={{
        minHeight: '600px',
        backgroundImage:
          'linear-gradient(to right, #e5e7eb 1px, transparent 1px), linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)',
        backgroundSize: '20px 20px',
      }}
    >
      <DndContext
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
        collisionDetection={pointerWithin}
      >
        <div className="relative w-full min-h-full">
          {/* Render clusters first (behind notes) */}
          {clusters.map((cluster) => (
            <Cluster
              key={cluster.id}
              cluster={cluster}
              onUpdateTitle={onUpdateCluster}
              onDelete={onDeleteCluster}
              disabled={disabled}
              showSummary={showClusterSummaries}
            />
          ))}

          {/* Render notes on top */}
          {notes.map((note) => (
            <StickyNote
              key={note.id}
              note={note}
              onUpdate={onUpdateNote}
              onDelete={onDeleteNote}
              disabled={disabled}
            />
          ))}
        </div>

        <DragOverlay>
          {activeNote ? (
            <div className="w-48 h-48 bg-yellow-200 shadow-2xl rounded-sm p-3 opacity-80">
              <div className="text-sm leading-relaxed">{activeNote.text}</div>
            </div>
          ) : activeCluster ? (
            <div
              className="border-2 border-dashed border-blue-600 bg-blue-100 bg-opacity-50 rounded-lg"
              style={{ width: `${activeCluster.width}px`, height: `${activeCluster.height}px` }}
            >
              <div className="bg-blue-200 px-3 py-2 rounded-t-lg">
                <div className="text-sm font-semibold text-blue-900">{activeCluster.title}</div>
              </div>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};
