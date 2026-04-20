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
      className={`@container bg-secondary/30 group flex items-center justify-between rounded-md p-2 transition-shadow ${
        isDragging ? 'opacity-50 ring-2 ring-primary ring-offset-1 shadow-lg' : ''
      }`}
    >
      <div className="flex items-center gap-2 overflow-hidden">
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="text-muted-foreground hover:text-primary cursor-grab active:cursor-grabbing h-10 w-10 flex items-center justify-center transition-colors @md:h-8 @md:w-8"
          title="Drag to reorder"
        >
          <Icon icon="lucide:grip-vertical" width={20} className="@md:w-4" />
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
      <div className="flex items-center gap-1 opacity-100 transition-opacity @md:opacity-0 @md:group-hover:opacity-100">
        <button
          type="button"
          onClick={onEdit}
          className="text-muted-foreground hover:text-primary h-10 w-10 flex items-center justify-center transition-colors @md:h-8 @md:w-8"
        >
          <Icon icon="lucide:edit" width={18} className="@md:w-4" />
        </button>
        <button
          type="button"
          onClick={onRemove}
          className="text-muted-foreground hover:text-destructive h-10 w-10 flex items-center justify-center transition-colors @md:h-8 @md:w-8"
        >
          <Icon icon="lucide:trash-2" width={18} className="@md:w-4" />
        </button>
      </div>
    </div>
  );
}
