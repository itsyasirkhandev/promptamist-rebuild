'use client';

import * as React from 'react';
import { Icon } from '@iconify/react';
import { Button } from '@/components/ui/button';
import { VariableConfigModal } from './VariableConfigModal';
import { cn } from '@/lib/utils';

interface Variable {
  id: string;
  name: string;
  type: 'text' | 'number' | 'textarea' | 'choices' | 'list';
  options?: string[];
}

interface PromptEditorProps {
  content: string;
  onChange: (content: string) => void;
  variables: Variable[];
  onVariablesChange: (variables: Variable[]) => void;
  isTemplate: boolean;
}

export function PromptEditor({
  content,
  onChange,
  variables,
  onVariablesChange,
  isTemplate,
}: PromptEditorProps) {
  const editorRef = React.useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedText, setSelectedText] = React.useState('');
  const [savedRange, setSavedRange] = React.useState<Range | null>(null);

  const formatContent = React.useCallback(
    (rawContent: string) => {
      // Convert {{var}} to styled spans
      let formatted = rawContent;
      variables.forEach((v) => {
        const regex = new RegExp(`{{${v.name}}}`, 'g');
        formatted = formatted.replace(
          regex,
          `<span class="bg-primary/20 text-primary rounded px-1 font-mono select-all" data-variable-id="${v.id}" contenteditable="false">{{${v.name}}}</span>`,
        );
      });
      return formatted;
    },
    [variables],
  );

  // Sync initial content or external changes to editor
  React.useEffect(() => {
    if (!editorRef.current) return;

    // Helper to get raw text from editor innerHTML
    const getEditorRawContent = () => {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = editorRef.current?.innerHTML || '';

      const spans = tempDiv.querySelectorAll('span[data-variable-id]');
      spans.forEach((span) => {
        const varId = span.getAttribute('data-variable-id');
        const variable = variables.find((v) => v.id === varId);
        if (variable) {
          span.replaceWith(`{{${variable.name}}}`);
        } else {
          span.replaceWith(span.textContent || '');
        }
      });
      return tempDiv.innerText;
    };

    const currentRaw = getEditorRawContent();
    if (currentRaw !== content) {
      editorRef.current.innerHTML = formatContent(content);
    }
  }, [content, formatContent, variables]);

  const handleInput = () => {
    if (editorRef.current) {
      // Extract raw text from editor, ensuring we keep the {{var}} syntax
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = editorRef.current.innerHTML;

      // Replace spans back to {{name}}
      const spans = tempDiv.querySelectorAll('span[data-variable-id]');
      spans.forEach((span) => {
        const varId = span.getAttribute('data-variable-id');
        const variable = variables.find((v) => v.id === varId);
        if (variable) {
          span.replaceWith(`{{${variable.name}}}`);
        } else {
          // If variable not found (maybe deleted from list), just keep the text
          span.replaceWith(span.textContent || '');
        }
      });

      onChange(tempDiv.innerText);
    }
  };

  const handleSelection = () => {
    if (!isTemplate) return;
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const text = selection.toString().trim();
      if (
        text &&
        selection.anchorNode?.parentElement?.closest('.prompt-editor')
      ) {
        setSelectedText(text);
        setSavedRange(selection.getRangeAt(0).cloneRange());
      } else {
        setSelectedText('');
        setSavedRange(null);
      }
    }
  };

  const openVariableModal = () => {
    if (selectedText) {
      setIsModalOpen(true);
    }
  };

  const handleAddVariable = (data: {
    name: string;
    type: Variable['type'];
    options?: string[];
  }) => {
    const newVar: Variable = {
      id: crypto.randomUUID(),
      name: data.name,
      type: data.type,
      options: data.options,
    };

    onVariablesChange([...variables, newVar]);

    if (savedRange && editorRef.current) {
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(savedRange);

      const span = document.createElement('span');
      span.className =
        'bg-primary/20 text-primary rounded px-1 font-mono select-all';
      span.setAttribute('data-variable-id', newVar.id);
      span.setAttribute('contenteditable', 'false');
      span.textContent = `{{${newVar.name}}}`;

      savedRange.deleteContents();
      savedRange.insertNode(span);

      // Move cursor after the span
      const nextRange = document.createRange();
      nextRange.setStartAfter(span);
      nextRange.collapse(true);
      selection?.removeAllRanges();
      selection?.addRange(nextRange);

      handleInput();
    }
  };

  return (
    <div className="@container relative space-y-2">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-muted-foreground text-sm font-medium">
          Prompt Content
        </span>
        {isTemplate && (
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={!selectedText}
            onClick={openVariableModal}
            className="hidden h-8 gap-2 @md:flex"
          >
            <Icon icon="lucide:variable" width={16} />
            Convert to Variable
          </Button>
        )}
      </div>

      <div
        ref={editorRef}
        className={cn(
          'prompt-editor border-input bg-background ring-offset-background focus-visible:ring-ring min-h-[300px] w-full rounded-md border px-3 py-2 text-base focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 @md:text-sm',
          'overflow-auto break-words whitespace-pre-wrap overscroll-none',
        )}
        contentEditable
        onInput={handleInput}
        onMouseUp={handleSelection}
        onKeyUp={handleSelection}
        onFocus={handleSelection}
      />

      {isTemplate && selectedText && (
        <div className="fixed bottom-24 left-1/2 z-50 -translate-x-1/2 @md:hidden">
          <Button
            type="button"
            size="lg"
            variant="default"
            onClick={openVariableModal}
            className="h-12 gap-2 rounded-full px-6 shadow-2xl animate-in fade-in zoom-in slide-in-from-bottom-4 duration-200"
          >
            <Icon icon="lucide:variable" width={20} />
            Convert to Variable
          </Button>
        </div>
      )}

      <VariableConfigModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleAddVariable}
        initialValue={selectedText}
        existingVariables={variables.map((v) => v.name)}
      />
    </div>
  );
}
