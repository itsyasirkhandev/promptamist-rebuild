import * as React from 'react';
import { toast } from 'sonner';
import {
  UseFormSetValue,
  UseFieldArrayAppend,
  UseFieldArrayRemove,
  UseFieldArrayUpdate,
  UseFieldArrayMove,
} from 'react-hook-form';

import {
  Variable,
  reconcileVariables,
  removeVariableFromContent,
  renameVariableInContent,
} from '@/lib/variables';
import { PromptFormValues } from '@/components/prompts/PromptForm';

interface UsePromptVariablesProps {
  content: string;
  variables: Variable[];
  setValue: UseFormSetValue<PromptFormValues>;
  append: UseFieldArrayAppend<PromptFormValues, 'variables'>;
  remove: UseFieldArrayRemove;
  update: UseFieldArrayUpdate<PromptFormValues, 'variables'>;
  move: UseFieldArrayMove;
  isTemplate: boolean;
}

export function usePromptVariables({
  content,
  variables,
  setValue,
  append,
  remove,
  update,
  move,
  isTemplate,
}: UsePromptVariablesProps) {
  const handleContentChange = React.useCallback(
    (newContent: string) => {
      setValue('content', newContent, {
        shouldValidate: true,
        shouldDirty: true,
      });

      if (!isTemplate) return;

      const reconciledVars = reconcileVariables(newContent, variables);

      const hasChanged =
        reconciledVars.length !== variables.length ||
        reconciledVars.some((v, i) => v.name !== variables[i]?.name);

      if (hasChanged) {
        setValue('variables', reconciledVars, {
          shouldValidate: true,
          shouldDirty: true,
        });
      }
    },
    [variables, isTemplate, setValue],
  );

  const addVariable = React.useCallback(
    (newVar: Variable) => {
      append(newVar);
      if (!isTemplate) {
        setValue('isTemplate', true, {
          shouldValidate: true,
          shouldDirty: true,
        });
      }
      toast.success(`Variable {{${newVar.name}}} added`);
    },
    [append, isTemplate, setValue],
  );

  const removeVariable = React.useCallback(
    (index: number) => {
      const variable = variables[index];
      if (!variable) return;

      const updatedContent = removeVariableFromContent(content, variable.name);
      setValue('content', updatedContent, {
        shouldValidate: true,
        shouldDirty: true,
      });
      remove(index);
      toast.info(`Variable {{${variable.name}}} removed`);
    },
    [content, variables, remove, setValue],
  );

  const updateVariable = React.useCallback(
    (index: number, updatedVarData: Partial<Variable>) => {
      const oldVar = variables[index];
      if (!oldVar) return;
      const newName = updatedVarData.name;

      update(index, {
        id: oldVar.id,
        name: updatedVarData.name ?? oldVar.name,
        type: updatedVarData.type ?? oldVar.type,
        options: updatedVarData.options ?? oldVar.options,
        defaultValue: updatedVarData.defaultValue ?? oldVar.defaultValue,
      });
      toast.success(`Variable {{${newName || oldVar.name}}} updated`);

      if (newName && oldVar.name !== newName) {
        const updatedContent = renameVariableInContent(
          content,
          oldVar.name,
          newName,
        );
        setValue('content', updatedContent, {
          shouldValidate: true,
          shouldDirty: true,
        });
      }
    },
    [content, variables, update, setValue],
  );

  const reorderVariable = React.useCallback(
    (oldIndex: number, newIndex: number) => {
      move(oldIndex, newIndex);
    },
    [move],
  );

  return {
    handleContentChange,
    addVariable,
    removeVariable,
    updateVariable,
    reorderVariable,
  };
}
