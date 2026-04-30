'use client';

import * as React from 'react';
import { Icon } from '@iconify/react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

interface TagsSectionProps {
  tags: string[];
  onChange: (tags: string[]) => void;
}

export function TagsSection({ tags, onChange }: TagsSectionProps) {
  const [tagInput, setTagInput] = React.useState('');

  const addTag = () => {
    if (tagInput.trim() && !tags?.includes(tagInput.trim())) {
      onChange([...(tags || []), tagInput.trim()]);
      toast.success(`Tag "${tagInput.trim()}" added`);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    onChange(tags.filter((t) => t !== tagToRemove));
    toast.info(`Tag "${tagToRemove}" removed`);
  };

  return (
    <div className="space-y-2">
      <Label>Tags</Label>
      <div className="flex gap-2">
        <Input
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          placeholder="Add tag..."
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addTag();
            }
          }}
        />
        <Button type="button" onClick={addTag} size="icon" variant="outline">
          <Icon icon="lucide:plus" width={18} />
        </Button>
      </div>
      <div className="flex flex-wrap gap-2 pt-2">
        {tags?.map((tag) => (
          <Badge key={tag} variant="secondary" className="gap-1 px-2 py-1">
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="hover:text-destructive"
            >
              <Icon icon="lucide:x" width={14} />
            </button>
          </Badge>
        ))}
      </div>
    </div>
  );
}
