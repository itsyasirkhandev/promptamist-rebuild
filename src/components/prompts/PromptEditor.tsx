'use client';

import * as React from 'react';
import { Icon } from '@iconify/react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Variable } from '@/lib/variables';
import { renderEditorHtml } from '@/lib/variable-presentation';

interface PromptEditorProps {
  content: string;
  onChange: (content: string) => void;
  variables: Variable[];
  isTemplate: boolean;
  onRequestNewVariable?: (
    selectedText: string,
    insertCallback: (varName: string) => void,
  ) => void;
}

export function PromptEditor({
  content,
  onChange,
  variables,
  isTemplate,
  onRequestNewVariable,
}: PromptEditorProps) {
  const editorRef = React.useRef<HTMLDivElement>(null);
  const [selectedText, setSelectedText] = React.useState('');
  const [savedRange, setSavedRange] = React.useState<Range | null>(null);

  const formatContent = React.useCallback(
    (rawContent: string) => {
      // Delegate to the centralised presentation utility
      return renderEditorHtml(rawContent, variables);
    },
    [variables],
  );

  const getEditorRawContent = React.useCallback(() => {
    if (!editorRef.current) return '';
    return editorRef.current.innerText;
  }, []);

  // Sync initial content or external changes to editor
  React.useEffect(() => {
    if (!editorRef.current) return;

    const currentRaw = getEditorRawContent();
    if (currentRaw !== content) {
      editorRef.current.innerHTML = formatContent(content);
    }
  }, [content, formatContent, getEditorRawContent]);

  const handleInput = () => {
    const rawContent = getEditorRawContent();
    onChange(rawContent);
  };

  const handleSelection = () => {
    if (!isTemplate) return;
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const text = selection.toString().trim();
      if (editorRef.current?.contains(selection.anchorNode)) {
        setSelectedText(text);
        setSavedRange(selection.getRangeAt(0).cloneRange());
      }
    }
  };

  const handleRequestVariable = () => {
    if (!onRequestNewVariable) return;

    onRequestNewVariable(selectedText, (varName: string) => {
      const selection = window.getSelection();
      const span = document.createElement('span');
      // We don't set data-variable-id, just format it correctly so it looks like a variable right away.
      // Next render of `renderEditorHtml` will stamp the real ID.
      span.className =
        'bg-primary/20 text-primary rounded px-1 font-mono select-all';
      span.setAttribute('contenteditable', 'false');
      span.textContent = `{{${varName}}}`;

      if (
        savedRange &&
        editorRef.current &&
        editorRef.current.contains(savedRange.commonAncestorContainer)
      ) {
        selection?.removeAllRanges();
        selection?.addRange(savedRange);
        savedRange.deleteContents();
        savedRange.insertNode(span);
      } else if (editorRef.current) {
        editorRef.current.appendChild(span);
      } else {
        return;
      }

      const nextRange = document.createRange();
      nextRange.setStartAfter(span);
      nextRange.collapse(true);
      selection?.removeAllRanges();
      selection?.addRange(nextRange);

      handleInput();
    });
  };

  return (
    <div className="@container relative space-y-2">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-muted-foreground text-sm font-semibold">
          Prompt Content
        </span>
        {isTemplate && (
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={handleRequestVariable}
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
          'overflow-auto overscroll-none break-words whitespace-pre-wrap',
        )}
        contentEditable
        onInput={handleInput}
        onMouseUp={handleSelection}
        onKeyUp={handleSelection}
        onFocus={handleSelection}
      />

      {isTemplate && (
        <div className="fixed bottom-24 left-1/2 z-50 -translate-x-1/2 @md:hidden">
          <Button
            type="button"
            size="lg"
            variant="default"
            onClick={handleRequestVariable}
            className="animate-in fade-in zoom-in slide-in-from-bottom-4 h-12 gap-2 rounded-full px-6 shadow-2xl duration-200"
          >
            <Icon icon="lucide:variable" width={20} />
            Convert to Variable
          </Button>
        </div>
      )}
    </div>
  );
}
