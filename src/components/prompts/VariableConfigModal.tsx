'use client';

import * as React from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Icon } from '@iconify/react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

const variableSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .regex(/^[a-zA-Z0-9_ ]+$/, 'Only letters, numbers, underscores and spaces'),
  type: z.enum(['text', 'number', 'textarea', 'choices', 'list']),
  options: z.array(z.string()).optional(),
  defaultValue: z.string().optional(),
});

export type VariableFormValues = z.infer<typeof variableSchema>;

interface VariableConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: VariableFormValues) => void;
  initialValue?: string;
  initialData?: VariableFormValues;
  existingVariables?: string[];
}

export function VariableConfigModal({
  isOpen,
  onClose,
  onConfirm,
  initialValue,
  initialData,
  existingVariables = [],
}: VariableConfigModalProps) {
  const [newOption, setNewOption] = React.useState('');

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    control,
    formState: { errors },
  } = useForm<VariableFormValues>({
    resolver: zodResolver(variableSchema),
    defaultValues: initialData || {
      name: initialValue?.replace(/[^a-zA-Z0-9_ ]/g, '') || '',
      type: 'text',
      options: [],
      defaultValue: '',
    },
  });

  const selectedType = useWatch({ control, name: 'type' });
  const currentName = useWatch({ control, name: 'name' });
  const options = useWatch({ control, name: 'options' }) || [];
  const currentDefaultValue = useWatch({ control, name: 'defaultValue' });

  React.useEffect(() => {
    if (isOpen) {
      if (initialData) {
        reset(initialData);
      } else {
        reset({
          name: initialValue?.replace(/[^a-zA-Z0-9_ ]/g, '') || '',
          type: 'text',
          options: [],
          defaultValue: '',
        });
      }
    }
  }, [isOpen, initialValue, initialData, reset]);

  const addOption = () => {
    if (newOption.trim()) {
      const updatedOptions = [...options, newOption.trim()];
      setValue('options', updatedOptions);
      setNewOption('');
    }
  };

  const removeOption = (index: number) => {
    const updatedOptions = options.filter((_, i) => i !== index);
    setValue('options', updatedOptions);
  };

  const onSubmit = (data: VariableFormValues, e?: React.BaseSyntheticEvent) => {
    e?.stopPropagation();
    // If we're editing, the name might be the same as it was, which is fine
    if (!initialData && existingVariables.includes(data.name)) {
      return;
    }
    if (
      initialData &&
      data.name !== initialData.name &&
      existingVariables.includes(data.name)
    ) {
      return;
    }
    onConfirm(data);
    onClose();
  };

  const isNameInvalid = !initialData
    ? existingVariables.includes(currentName || '')
    : currentName !== initialData.name &&
      existingVariables.includes(currentName || '');

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {initialData ? 'Edit Variable' : 'Configure Variable'}
          </DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.stopPropagation();
            handleSubmit(onSubmit)(e);
          }}
          className="space-y-4 py-4"
        >
          <div className="space-y-2">
            <Label htmlFor="name">Field Name</Label>
            <Input
              id="name"
              {...register('name')}
              placeholder="e.g. Tone, Language, Count"
            />
            {errors.name && (
              <p className="text-destructive text-sm">{errors.name.message}</p>
            )}
            {isNameInvalid && (
              <p className="text-destructive text-sm">
                A field with this name already exists
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Field Type</Label>
            <Select
              onValueChange={(value: VariableFormValues['type']) =>
                setValue('type', value)
              }
              value={selectedType}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Short Text</SelectItem>
                <SelectItem value="number">Number</SelectItem>
                <SelectItem value="textarea">Long Text (Textarea)</SelectItem>
                <SelectItem value="choices">Single Select (Choices)</SelectItem>
                <SelectItem value="list">Multi Select (List)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {(selectedType === 'choices' || selectedType === 'list') && (
            <div className="space-y-4 border-t pt-4">
              <Label>Options</Label>
              <div className="flex gap-2">
                <Input
                  value={newOption}
                  onChange={(e) => setNewOption(e.target.value)}
                  placeholder="Add option..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addOption();
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={addOption}
                  size="icon"
                  variant="secondary"
                >
                  <Icon icon="lucide:plus" width={18} />
                </Button>
              </div>
              <div className="bg-secondary/30 flex min-h-[40px] flex-wrap gap-2 rounded-md p-2">
                {options.length === 0 && (
                  <span className="text-muted-foreground text-sm italic">
                    No options added yet
                  </span>
                )}
                {options.map((opt, i) => (
                  <Badge
                    key={i}
                    variant="secondary"
                    className="gap-1 px-2 py-1"
                  >
                    {opt}
                    <button
                      type="button"
                      onClick={() => removeOption(i)}
                      className="hover:text-destructive focus:outline-none"
                    >
                      <Icon icon="lucide:x" width={14} />
                    </button>
                  </Badge>
                ))}
              </div>
              {selectedType === 'choices' && options.length < 1 && (
                <p className="text-sm text-amber-500">
                  Add at least 1 option for single select
                </p>
              )}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="defaultValue">Default Value (Optional)</Label>
            {selectedType === 'textarea' ? (
              <Textarea
                id="defaultValue"
                {...register('defaultValue')}
                placeholder="Default text..."
              />
            ) : selectedType === 'choices' ? (
              <Select
                onValueChange={(value) => setValue('defaultValue', value)}
                value={currentDefaultValue || ''}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select default option" />
                </SelectTrigger>
                <SelectContent>
                  {options.map((opt, i) => (
                    <SelectItem key={`${opt}-${i}`} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : selectedType === 'list' ? (
              <Input
                id="defaultValue"
                {...register('defaultValue')}
                placeholder="Comma separated defaults..."
              />
            ) : (
              <Input
                id="defaultValue"
                {...register('defaultValue')}
                type={selectedType === 'number' ? 'number' : 'text'}
                placeholder="Default value..."
              />
            )}
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                isNameInvalid ||
                ((selectedType === 'choices' || selectedType === 'list') &&
                  options.length === 0)
              }
            >
              {initialData ? 'Save Changes' : 'Add Field'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
