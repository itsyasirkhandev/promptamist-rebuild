'use client';

import * as React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { getVariableColorConfig } from '@/lib/variable-styles';
import type { Variable } from '@/lib/variables';

/** @deprecated Import `Variable` from `@/lib/variables` instead. */
export type PromptVariable = Variable;

interface VariableInputProps {
  variable: PromptVariable;
  value: string;
  onChange: (value: string) => void;
}

interface BaseInputProps {
  v: PromptVariable;
  value: string;
  onChange: (value: string) => void;
  colors: ReturnType<typeof getVariableColorConfig>;
}

const TextInput = ({ v, value, onChange, colors }: BaseInputProps) => (
  <Input
    id={v.id}
    value={value || ''}
    onChange={(e) => onChange(e.target.value)}
    placeholder={`Enter ${v.name.toLowerCase()}...`}
    className={colors.input}
  />
);

const NumberInput = ({ v, value, onChange, colors }: BaseInputProps) => (
  <Input
    id={v.id}
    type="number"
    value={value || ''}
    onChange={(e) => onChange(e.target.value)}
    placeholder="0"
    className={colors.input}
  />
);

const TextAreaInput = ({ v, value, onChange, colors }: BaseInputProps) => (
  <Textarea
    id={v.id}
    value={value || ''}
    onChange={(e) => onChange(e.target.value)}
    placeholder={`Enter ${v.name.toLowerCase()}...`}
    className={`min-h-25 ${colors.input}`}
  />
);

const ChoiceInput = ({ v, value, onChange, colors }: BaseInputProps) => (
  <Select value={value || ''} onValueChange={(val) => onChange(val)}>
    <SelectTrigger id={v.id} className={colors.input}>
      <SelectValue placeholder="Select an option..." />
    </SelectTrigger>
    <SelectContent>
      {v.options?.map((opt: string) => (
        <SelectItem key={opt} value={opt}>
          {opt}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
);

const ListInput = ({ v, value, onChange }: Omit<BaseInputProps, 'colors'>) => {
  const currentValues = (value || '')
    .split(',')
    .map((s: string) => s.trim())
    .filter(Boolean);

  return (
    <div className="flex flex-col gap-2 pt-2">
      {v.options?.map((opt: string) => {
        const isChecked = currentValues.includes(opt);

        return (
          <div key={opt} className="flex items-center space-x-2">
            <Checkbox
              id={`${v.id}-${opt}`}
              checked={isChecked}
              onCheckedChange={(checked) => {
                let newValues;
                if (checked) {
                  newValues = [...currentValues, opt];
                } else {
                  newValues = currentValues.filter(
                    (val: string) => val !== opt,
                  );
                }
                onChange(newValues.join(', '));
              }}
            />
            <Label
              htmlFor={`${v.id}-${opt}`}
              className="cursor-pointer font-normal"
            >
              {opt}
            </Label>
          </div>
        );
      })}
      {(!v.options || v.options.length === 0) && (
        <p className="text-muted-foreground text-sm italic">
          No options defined for this list
        </p>
      )}
    </div>
  );
};

export const VariableInput = React.memo(
  ({ variable: v, value, onChange }: VariableInputProps) => {
    const colors = getVariableColorConfig(v.type);

    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor={v.id} className="text-sm font-semibold">
            {v.name}
          </Label>
          {v.defaultValue && (
            <span className="text-muted-foreground text-[10px] italic">
              (default: {v.defaultValue})
            </span>
          )}
        </div>

        {(() => {
          switch (v.type) {
            case 'text':
              return (
                <TextInput
                  v={v}
                  value={value}
                  onChange={onChange}
                  colors={colors}
                />
              );
            case 'number':
              return (
                <NumberInput
                  v={v}
                  value={value}
                  onChange={onChange}
                  colors={colors}
                />
              );
            case 'textarea':
              return (
                <TextAreaInput
                  v={v}
                  value={value}
                  onChange={onChange}
                  colors={colors}
                />
              );
            case 'choices':
              return (
                <ChoiceInput
                  v={v}
                  value={value}
                  onChange={onChange}
                  colors={colors}
                />
              );
            case 'list':
              return <ListInput v={v} value={value} onChange={onChange} />;
            default:
              return null;
          }
        })()}
      </div>
    );
  },
);

VariableInput.displayName = 'VariableInput';
