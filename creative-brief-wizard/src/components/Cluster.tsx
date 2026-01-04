import React, { useState, useRef, useEffect } from 'react';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import type { Cluster as ClusterType } from '../types';

interface ClusterProps {
  cluster: ClusterType;
  onUpdateTitle: (id: string, title: string) => void;
  onDelete: (id: string) => void;
  disabled?: boolean;
  showSummary?: boolean;
}

export const Cluster: React.FC<ClusterProps> = ({
  cluster,
  onUpdateTitle,
  onDelete,
  disabled = false,
  showSummary = false,
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [title, setTitle] = useState(cluster.title);
  const titleInputRef = useRef<HTMLInputElement>(null);

  const {
    attributes,
    listeners,
    setNodeRef: setDragRef,
    transform,
    isDragging,
  } = useDraggable({
    id: `cluster-${cluster.id}`,
    disabled: disabled || isEditingTitle,
    data: { cluster, type: 'cluster' },
  });

  const { setNodeRef: setDropRef } = useDroppable({
    id: `cluster-drop-${cluster.id}`,
    data: { cluster, type: 'cluster-drop' },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    position: 'absolute' as const,
    left: `${cluster.x}px`,
    top: `${cluster.y}px`,
    width: `${cluster.width}px`,
    height: `${cluster.height}px`,
    zIndex: isDragging ? 'var(--z-modal)' : 'var(--z-base)',
  };

  useEffect(() => {
    setTitle(cluster.title);
  }, [cluster.title]);

  useEffect(() => {
    if (isEditingTitle && titleInputRef.current) {
      titleInputRef.current.focus();
      titleInputRef.current.select();
    }
  }, [isEditingTitle]);

  const handleTitleBlur = () => {
    setIsEditingTitle(false);
    if (title.trim() !== cluster.title) {
      onUpdateTitle(cluster.id, title.trim() || 'Unnamed Cluster');
    }
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTitleBlur();
    } else if (e.key === 'Escape') {
      setTitle(cluster.title);
      setIsEditingTitle(false);
    }
  };

  // Combine drag and drop refs
  const setRefs = (element: HTMLDivElement | null) => {
    setDragRef(element);
    setDropRef(element);
  };

  return (
    <div
      ref={setRefs}
      style={style}
      className={`border-2 border-dashed border-blue-400 bg-blue-50 bg-opacity-20 rounded-lg transition-all ${
        isDragging ? 'opacity-50 border-blue-600' : 'hover:border-blue-500'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      {...attributes}
      {...listeners}
    >
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between bg-blue-100 border-b-2 border-blue-400 px-3 py-2 rounded-t-lg">
        {isEditingTitle ? (
          <input
            ref={titleInputRef}
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleTitleBlur}
            onKeyDown={handleTitleKeyDown}
            disabled={disabled}
            className="flex-1 bg-white border border-blue-300 rounded px-2 py-1 text-sm font-semibold text-blue-900 outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Cluster name..."
          />
        ) : (
          <button
            onClick={() => !disabled && setIsEditingTitle(true)}
            disabled={disabled}
            className="flex-1 text-left text-sm font-semibold text-blue-900 hover:text-blue-700 disabled:cursor-not-allowed"
            title="Click to edit cluster name"
          >
            {cluster.title || 'Unnamed Cluster'}
          </button>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (!disabled) onDelete(cluster.id);
          }}
          disabled={disabled}
          className="ml-2 text-blue-600 hover:text-red-600 text-lg font-bold leading-none px-1 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Delete cluster"
          title="Delete cluster"
        >
          ×
        </button>
      </div>

      {showSummary && cluster.aiSummary && (
        <div className="absolute bottom-2 left-2 right-2 bg-white bg-opacity-90 border border-blue-300 rounded p-2 text-xs text-gray-700">
          <strong className="text-blue-700">AI Summary:</strong>
          <p className="mt-1">{cluster.aiSummary}</p>
        </div>
      )}
    </div>
  );
};
