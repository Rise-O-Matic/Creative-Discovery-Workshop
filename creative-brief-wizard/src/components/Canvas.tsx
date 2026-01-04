import React, { useState, useRef } from 'react';
import { DndContext, DragOverlay, type DragEndEvent, type DragStartEvent } from '@dnd-kit/core';
import { StickyNote } from './StickyNote';
import type { StickyNote as StickyNoteType } from '../types';

interface CanvasProps {
  notes: StickyNoteType[];
  onUpdateNote: (id: string, text: string) => void;
  onDeleteNote: (id: string) => void;
  onMoveNote: (id: string, x: number, y: number) => void;
  disabled?: boolean;
}

export const Canvas: React.FC<CanvasProps> = ({
  notes,
  onUpdateNote,
  onDeleteNote,
  onMoveNote,
  disabled = false,
}) => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, delta } = event;
    const noteId = active.id as string;
    const note = notes.find((n) => n.id === noteId);

    if (note) {
      const newX = note.x + delta.x;
      const newY = note.y + delta.y;
      onMoveNote(noteId, newX, newY);
    }

    setActiveId(null);
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  const activeNote = activeId ? notes.find((n) => n.id === activeId) : null;

  return (
    <div
      ref={canvasRef}
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
      >
        <div className="relative w-full min-h-full">
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
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};
