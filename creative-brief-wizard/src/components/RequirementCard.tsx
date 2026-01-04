import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2 } from 'lucide-react';
import type { RequirementCard } from '../types';

interface RequirementCardProps {
  card: RequirementCard;
  onDelete: (cardId: string) => void;
  disabled?: boolean;
}

export default function RequirementCardComponent({
  card,
  onDelete,
  disabled = false,
}: RequirementCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: card.id,
    disabled,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        group relative flex items-start gap-2 rounded-lg border border-gray-300
        bg-white p-3 shadow-sm transition-shadow hover:shadow-md
        ${isDragging ? 'z-50 shadow-xl' : ''}
        ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-grab active:cursor-grabbing'}
      `}
    >
      {/* Drag Handle */}
      <button
        {...attributes}
        {...listeners}
        disabled={disabled}
        className={`
          flex-shrink-0 cursor-grab active:cursor-grabbing
          ${disabled ? 'cursor-not-allowed opacity-30' : 'text-gray-400 hover:text-gray-600'}
        `}
        aria-label="Drag to reorder"
      >
        <GripVertical className="h-5 w-5" />
      </button>

      {/* Card Content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900">{card.description}</p>
        {card.source && <p className="mt-1 text-xs text-gray-500">Source: {card.source}</p>}
      </div>

      {/* Delete Button */}
      <button
        onClick={() => onDelete(card.id)}
        disabled={disabled}
        className={`
          flex-shrink-0 opacity-0 transition-opacity group-hover:opacity-100
          ${disabled ? 'cursor-not-allowed' : 'text-red-500 hover:text-red-700'}
        `}
        aria-label="Delete requirement"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}
