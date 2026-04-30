'use client';

import * as React from 'react';
import { useForm, useWatch, UseFormRegister } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Icon } from '@iconify/react';
import { VARIABLE_NAME_PATTERN } from '@/lib/variables';
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
import { Checkbox } from '@/components/ui/checkbox';

const variableSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(64, 'Name must be 1-64 characters')
    .regex(VARIABLE_NAME_PATTERN, 'Name cannot contain curly braces'),
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

interface OptionManagerProps {
  options: string[];
  onChange: (options: string[]) => void;
  type: VariableFormValues['type'];
}

const OptionManager = React.memo(
  ({ options, onChange, type }: OptionManagerProps) => {
    const [newOption, setNewOption] = React.useState('');

    const addOption = () => {
      if (newOption.trim()) {
        onChange([...options, newOption.trim()]);
        setNewOption('');
      }
    };

    const removeOption = (index: number) => {
      onChange(options.filter((_, i) => i !== index));
    };

    if (type !== 'choices' && type !== 'list') return null;

    return (
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
            <Badge key={i} variant="secondary" className="gap-1 px-2 py-1">
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
        {type === 'choices' && options.length < 1 && (
          <p className="text-sm text-amber-500">
            Add at least 1 option for single select
          </p>
        )}
      </div>
    );
  },
);

OptionManager.displayName = 'OptionManager';

interface DefaultValueInputProps {
  type: VariableFormValues['type'];
  options: string[];
  value: string;
  onChange: (value: string) => void;
  register: UseFormRegister<VariableFormValues>;
}

const DefaultTextArea = ({
  register,
}: {
  register: UseFormRegister<VariableFormValues>;
}) => (
  <Textarea
    id="defaultValue"
    {...register('defaultValue')}
    placeholder="Default text..."
  />
);

const DefaultSelect = ({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string;
  onChange: (value: string) => void;
}) => (
  <Select onValueChange={onChange} value={value || ''}>
    <SelectTrigger>
      <SelectValue placeholder="Select default option" />
    </SelectTrigger>
    <SelectContent>
      {options.map((opt: string, i: number) => (
        <SelectItem key={`${opt}-${i}`} value={opt}>
          {opt}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
);

const DefaultCheckboxList = ({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string;
  onChange: (value: string) => void;
}) => {
  const currentValues = (value || '')
    .split(',')
    .map((s: string) => s.trim())
    .filter(Boolean);

  return (
    <div className="flex flex-col gap-2 pt-2">
      {options.map((opt: string, i: number) => {
        const isChecked = currentValues.includes(opt);

        return (
          <div
            key={`default-${opt}-${i}`}
            className="flex items-center space-x-2"
          >
            <Checkbox
              id={`default-${opt}`}
              checked={isChecked}
              onCheckedChange={(checked) => {
                let newValues;
                if (checked) {
                  newValues = [...currentValues, opt];
                } else {
                  newValues = currentValues.filter((v: string) => v !== opt);
                }
                onChange(newValues.join(', '));
              }}
            />
            <Label
              htmlFor={`default-${opt}`}
              className="cursor-pointer font-normal"
            >
              {opt}
            </Label>
          </div>
        );
      })}
      {options.length === 0 && (
        <span className="text-muted-foreground text-sm italic">
          Add options to set default values
        </span>
      )}
    </div>
  );
};

const DefaultValueInput = React.memo(
  ({ type, options, value, onChange, register }: DefaultValueInputProps) => {
    if (type === 'textarea') return <DefaultTextArea register={register} />;
    if (type === 'choices')
      return (
        <DefaultSelect options={options} value={value} onChange={onChange} />
      );
    if (type === 'list')
      return (
        <DefaultCheckboxList
          options={options}
          value={value}
          onChange={onChange}
        />
      );

    return (
      <Input
        id="defaultValue"
        {...register('defaultValue')}
        type={type === 'number' ? 'number' : 'text'}
        placeholder="Default value..."
      />
    );
  },
);

DefaultValueInput.displayName = 'DefaultValueInput';

export function VariableConfigModal({
  isOpen,
  onClose,
  onConfirm,
  initialValue,
  initialData,
  existingVariables = [],
}: VariableConfigModalProps) {
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
      name: initialValue?.replace(/[{}]+/g, '').slice(0, 64) || '',
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
          name: initialValue?.replace(/[{}]+/g, '').slice(0, 64) || '',
          type: 'text',
          options: [],
          defaultValue: '',
        });
      }
    }
  }, [isOpen, initialValue, initialData, reset]);

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

          <OptionManager
            options={options}
            onChange={(newOptions) => setValue('options', newOptions)}
            type={selectedType}
          />

          <div className="space-y-2">
            <Label htmlFor="defaultValue">Default Value (Optional)</Label>
            <DefaultValueInput
              type={selectedType}
              options={options}
              value={currentDefaultValue || ''}
              onChange={(val) =>
                setValue('defaultValue', val, { shouldDirty: true })
              }
              register={register}
            />
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
