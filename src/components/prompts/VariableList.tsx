'use client';

import * as React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableVariableItem } from './SortableVariableItem';

interface Variable {
  id: string;
  name: string;
  type: string;
}

interface VariableListProps {
  variables: Variable[];
  onReorder: (oldIndex: number, newIndex: number) => void;
  onEdit: (index: number) => void;
  onRemove: (index: number) => void;
}

export function VariableList({
  variables,
  onReorder,
  onEdit,
  onRemove,
}: VariableListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = variables.findIndex((v) => v.id === active.id);
      const newIndex = variables.findIndex((v) => v.id === over.id);
      onReorder(oldIndex, newIndex);
    }
  };

  if (variables.length === 0) {
    return (
      <p className="text-muted-foreground py-4 text-center text-xs italic">
        No variables defined yet.
      </p>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={variables.map((v) => v.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-3 p-4">
          {variables.map((v, index) => (
            <SortableVariableItem
              key={v.id}
              variable={v}
              onEdit={() => onEdit(index)}
              onRemove={() => onRemove(index)}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
