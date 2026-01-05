import { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { useSession } from '../../hooks/useSession';
import RequirementCardComponent from '../../components/RequirementCard';
import type { RequirementCard, RequirementPriority } from '../../types';

export default function PrioritizationPage() {
  const { state, addRequirementCard, moveRequirementCard, deleteRequirementCard, setPhase } =
    useSession();
  const { prioritization } = state;

  const [activeCard, setActiveCard] = useState<RequirementCard | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const cardId = event.active.id as string;
    const allCards = [
      ...prioritization.willHave,
      ...prioritization.couldHave,
      ...prioritization.wontHave,
    ];
    const card = allCards.find((c) => c.id === cardId);
    setActiveCard(card || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveCard(null);

    if (!over) return;

    const cardId = active.id as string;
    const targetPriority = over.id as RequirementPriority;

    // Check if dropping on a priority zone
    if (['will', 'could', 'wont'].includes(targetPriority)) {
      moveRequirementCard(cardId, targetPriority);
    }
  };

  const handleAddRequirement = (description: string, priority: RequirementPriority) => {
    if (!description.trim()) return;

    const cardId = Math.random().toString(36).substr(2, 9);
    addRequirementCard({
      description: description.trim(),
      source: 'Manual Entry',
    });
    
    // Move to the correct priority
    moveRequirementCard(cardId, priority);
  };

  const handleDelete = (cardId: string) => {
    deleteRequirementCard(cardId);
  };

  const handleComplete = () => {
    setPhase('synthesis-review');
  };

  const totalRequirements =
    prioritization.willHave.length +
    prioritization.couldHave.length +
    prioritization.wontHave.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Prioritize Requirements</h1>
          <p className="mt-2 text-gray-600">
            Organize requirements using the MoSCoW method. Drag cards between categories to
            prioritize what your project will, could, or won't have.
          </p>
          <div className="mt-4 flex items-center gap-4">
            <div className="text-sm text-gray-500">
              Total Requirements: <span className="font-semibold">{totalRequirements}</span>
            </div>
            {totalRequirements > 0 && (
              <div className="flex items-center gap-2 text-sm text-green-600">
                <CheckCircle2 className="h-4 w-4" />
                Ready to continue
              </div>
            )}
          </div>
        </div>

        {/* Info Text */}
        <div className="mb-6 text-sm text-gray-600">
          <p>Click in any column and type to add requirements. Press Enter to save.</p>
        </div>

        {/* MoSCoW Columns */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Will Have Column */}
            <PriorityColumn
              title="Will Have"
              description="Must-have requirements for the project"
              priority="will"
              cards={prioritization.willHave}
              onDelete={handleDelete}
              color="green"
              onAddRequirement={handleAddRequirement}
            />

            {/* Could Have Column */}
            <PriorityColumn
              title="Could Have"
              description="Nice-to-have features if time permits"
              priority="could"
              cards={prioritization.couldHave}
              onDelete={handleDelete}
              color="yellow"
              onAddRequirement={handleAddRequirement}
            />

            {/* Won't Have Column */}
            <PriorityColumn
              title="Won't Have"
              description="Out of scope for this project"
              priority="wont"
              cards={prioritization.wontHave}
              onDelete={handleDelete}
              color="red"
              onAddRequirement={handleAddRequirement}
            />
          </div>

          <DragOverlay>
            {activeCard ? (
              <div className="rounded-lg border border-gray-300 bg-white p-3 shadow-xl">
                <p className="text-sm font-medium text-gray-900">{activeCard.description}</p>
                {activeCard.source && (
                  <p className="mt-1 text-xs text-gray-500">Source: {activeCard.source}</p>
                )}
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>

        {/* Navigation */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={handleComplete}
            disabled={totalRequirements === 0}
            className="flex items-center gap-2 rounded-lg bg-purple-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Continue to Review
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

interface PriorityColumnProps {
  title: string;
  description: string;
  priority: RequirementPriority;
  cards: RequirementCard[];
  onDelete: (cardId: string) => void;
  color: 'green' | 'yellow' | 'red';
  onAddRequirement: (description: string, priority: RequirementPriority) => void;
}

function PriorityColumn({
  title,
  description,
  priority,
  cards,
  onDelete,
  color,
  onAddRequirement,
}: PriorityColumnProps) {
  const [inputValue, setInputValue] = useState('');
  const colorClasses = {
    green: 'border-green-500 bg-green-50',
    yellow: 'border-yellow-500 bg-yellow-50',
    red: 'border-red-500 bg-red-50',
  };

  const headerColorClasses = {
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
  };



  return (
    <SortableContext
      id={priority}
      items={cards.map((c) => c.id)}
      strategy={verticalListSortingStrategy}
    >
      <div
        id={priority}
        className={`flex min-h-[200px] md:min-h-[400px] flex-col rounded-lg border-2 ${colorClasses[color]} transition-colors`}
      >
        {/* Column Header */}
        <div className={`${headerColorClasses[color]} rounded-t-md px-4 py-3`}>
          <h2 className="text-lg font-bold text-white">{title}</h2>
          <p className="text-sm text-white/90">{description}</p>
        </div>

        {/* Cards Container */}
        <div className="flex-1 space-y-2 p-4">
          {cards.map((card) => (
            <RequirementCardComponent key={card.id} card={card} onDelete={onDelete} />
          ))}
          
          {/* Fast-Entry Input */}
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && inputValue.trim()) {
                onAddRequirement(inputValue.trim(), priority);
                setInputValue('');
              }
            }}
            placeholder={cards.length === 0 ? 'Click here or type to add...' : 'Type to add...'}
            className="w-full rounded-md border border-dashed border-gray-400 bg-white/50 px-3 py-2 text-sm placeholder-gray-500 focus:border-solid focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
          />
        </div>

        {/* Card Count */}
        <div className="border-t border-gray-300 px-4 py-2">
          <p className="text-xs font-medium text-gray-600">
            {cards.length} {cards.length === 1 ? 'requirement' : 'requirements'}
          </p>
        </div>
      </div>
    </SortableContext>
  );
}
