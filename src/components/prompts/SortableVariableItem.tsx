'use client';

import * as React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Icon } from '@iconify/react';

interface Variable {
  id: string;
  name: string;
  type: string;
}

interface SortableVariableItemProps {
  variable: Variable;
  onEdit: () => void;
  onRemove: () => void;
}

export function SortableVariableItem({
  variable,
  onEdit,
  onRemove,
}: SortableVariableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: variable.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-secondary/30 group flex items-center justify-between rounded-md p-2 ${
        isDragging ? 'opacity-50 ring-2 ring-primary ring-offset-1' : ''
      }`}
    >
      <div className="flex items-center gap-2 overflow-hidden">
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="text-muted-foreground hover:text-primary cursor-grab active:cursor-grabbing p-1 transition-colors"
          title="Drag to reorder"
        >
          <Icon icon="lucide:grip-vertical" width={16} />
        </button>
        <div className="space-y-0.5 overflow-hidden">
          <p className="text-primary truncate font-mono text-sm font-bold">
            {variable.name}
          </p>
          <p className="text-muted-foreground text-[10px] tracking-wider uppercase">
            {variable.type}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        <button
          type="button"
          onClick={onEdit}
          className="text-muted-foreground hover:text-primary p-1 transition-colors"
        >
          <Icon icon="lucide:edit" width={14} />
        </button>
        <button
          type="button"
          onClick={onRemove}
          className="text-muted-foreground hover:text-destructive p-1 transition-colors"
        >
          <Icon icon="lucide:trash-2" width={14} />
        </button>
      </div>
    </div>
  );
}
