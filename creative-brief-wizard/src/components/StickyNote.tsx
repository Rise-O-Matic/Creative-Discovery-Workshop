import React, { useState, useRef, useEffect } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import type { StickyNote as StickyNoteType } from '../types';

interface StickyNoteProps {
  note: StickyNoteType;
  onUpdate: (id: string, text: string) => void;
  onDelete: (id: string) => void;
  disabled?: boolean;
  autoFocus?: boolean;
}

export const StickyNote: React.FC<StickyNoteProps> = ({
  note,
  onUpdate,
  onDelete,
  disabled = false,
  autoFocus = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(note.text);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: note.id,
    disabled: disabled || isEditing,
    data: { note },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    position: 'absolute' as const,
    left: `${note.x}px`,
    top: `${note.y}px`,
    zIndex: isDragging ? 'var(--z-modal)' : 'var(--z-base)',
  };

  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      textareaRef.current.focus();
      setIsEditing(true);
    }
  }, [autoFocus]);

  useEffect(() => {
    setText(note.text);
  }, [note.text]);

  const handleBlur = () => {
    setIsEditing(false);
    if (text !== note.text) {
      onUpdate(note.id, text);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setText(note.text);
      setIsEditing(false);
      textareaRef.current?.blur();
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`w-48 h-48 bg-yellow-200 shadow-lg rounded-sm p-3 cursor-move select-none transition-shadow ${
        isDragging ? 'shadow-2xl opacity-80' : 'hover:shadow-xl'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      {...attributes}
      {...listeners}
    >
      <div className="flex flex-col h-full">
        <div className="flex justify-end mb-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (!disabled) onDelete(note.id);
            }}
            disabled={disabled}
            className="text-gray-500 hover:text-red-600 text-sm font-bold leading-none px-1 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Delete note"
            title="Delete note"
          >
            ×
          </button>
        </div>
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onFocus={() => !disabled && setIsEditing(true)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          className="flex-1 bg-transparent resize-none outline-none text-sm leading-relaxed disabled:cursor-not-allowed"
          placeholder="Type your idea..."
          aria-label="Sticky note text"
        />
      </div>
    </div>
  );
};
