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
import { Plus, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useSession } from '../../hooks/useSession';
import RequirementCardComponent from '../../components/RequirementCard';
import type { RequirementCard, RequirementPriority } from '../../types';

export default function PrioritizationPage() {
  const { state, addRequirementCard, moveRequirementCard, deleteRequirementCard, setPhase } =
    useSession();
  const { prioritization } = state;

  const [activeCard, setActiveCard] = useState<RequirementCard | null>(null);
  const [newRequirement, setNewRequirement] = useState('');
  const [newSource, setNewSource] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

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

  const handleAddRequirement = () => {
    if (!newRequirement.trim()) return;

    addRequirementCard({
      description: newRequirement.trim(),
      source: newSource.trim() || 'Manual Entry',
    });

    setNewRequirement('');
    setNewSource('');
    setShowAddForm(false);
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

        {/* Add Requirement Button */}
        <div className="mb-6">
          {!showAddForm ? (
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
            >
              <Plus className="h-5 w-5" />
              Add Requirement
            </button>
          ) : (
            <div className="rounded-lg border border-gray-300 bg-white p-4 shadow-sm">
              <h3 className="mb-3 text-sm font-semibold text-gray-900">New Requirement</h3>
              <div className="space-y-3">
                <div>
                  <label htmlFor="description" className="block text-xs font-medium text-gray-700">
                    Description *
                  </label>
                  <textarea
                    id="description"
                    value={newRequirement}
                    onChange={(e) => setNewRequirement(e.target.value)}
                    placeholder="Enter requirement description..."
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    rows={3}
                  />
                </div>
                <div>
                  <label htmlFor="source" className="block text-xs font-medium text-gray-700">
                    Source (optional)
                  </label>
                  <input
                    id="source"
                    type="text"
                    value={newSource}
                    onChange={(e) => setNewSource(e.target.value)}
                    placeholder="e.g., Customer Discovery, Spot Exercise..."
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleAddRequirement}
                    disabled={!newRequirement.trim()}
                    className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Add to "Will Have"
                  </button>
                  <button
                    onClick={() => {
                      setShowAddForm(false);
                      setNewRequirement('');
                      setNewSource('');
                    }}
                    className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
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
            />

            {/* Could Have Column */}
            <PriorityColumn
              title="Could Have"
              description="Nice-to-have features if time permits"
              priority="could"
              cards={prioritization.couldHave}
              onDelete={handleDelete}
              color="yellow"
            />

            {/* Won't Have Column */}
            <PriorityColumn
              title="Won't Have"
              description="Out of scope for this project"
              priority="wont"
              cards={prioritization.wontHave}
              onDelete={handleDelete}
              color="red"
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
}

function PriorityColumn({
  title,
  description,
  priority,
  cards,
  onDelete,
  color,
}: PriorityColumnProps) {
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
          {cards.length === 0 ? (
            <div className="flex h-full items-center justify-center text-center">
              <p className="text-sm text-gray-500">Drag requirements here</p>
            </div>
          ) : (
            cards.map((card) => (
              <RequirementCardComponent key={card.id} card={card} onDelete={onDelete} />
            ))
          )}
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
