'use client';

import * as React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Icon } from '@iconify/react';
import { getVariableColorConfig } from '@/lib/variables';

interface Variable {
  id: string;
  name: string;
  type: string;
  defaultValue?: string;
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

  const colors = getVariableColorConfig(variable.type);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-secondary/30 group @container flex items-center justify-between rounded-md p-2 transition-shadow ${
        isDragging
          ? 'ring-primary opacity-50 shadow-lg ring-2 ring-offset-1'
          : ''
      }`}
    >
      <div className="flex items-center gap-2 overflow-hidden">
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="text-muted-foreground hover:text-primary flex h-10 w-10 cursor-grab items-center justify-center transition-colors active:cursor-grabbing @md:h-8 @md:w-8"
          title="Drag to reorder"
        >
          <Icon icon="lucide:grip-vertical" width={20} className="@md:w-4" />
        </button>
        <div className="space-y-0.5 overflow-hidden">
          <p className="text-primary truncate font-mono text-sm font-semibold">
            {variable.name}
          </p>
          <div className="flex items-center gap-2">
            <p
              className={`rounded px-1.5 py-0.5 text-[10px] font-medium tracking-wider uppercase ${colors.badge}`}
            >
              {variable.type}
            </p>
            {variable.defaultValue && (
              <span className="bg-primary/10 text-primary rounded px-1.5 py-0.5 text-[10px] leading-none font-medium">
                Default
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-1 opacity-100 transition-opacity @md:opacity-0 @md:group-hover:opacity-100">
        <button
          type="button"
          onClick={onEdit}
          className="text-muted-foreground hover:text-primary flex h-10 w-10 items-center justify-center transition-colors @md:h-8 @md:w-8"
        >
          <Icon icon="lucide:edit" width={18} className="@md:w-4" />
        </button>
        <button
          type="button"
          onClick={onRemove}
          className="text-muted-foreground hover:text-destructive flex h-10 w-10 items-center justify-center transition-colors @md:h-8 @md:w-8"
        >
          <Icon icon="lucide:trash-2" width={18} className="@md:w-4" />
        </button>
      </div>
    </div>
  );
}
