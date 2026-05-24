'use client';

import * as React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface SettingsSectionProps {
  isTemplate: boolean;
  setIsTemplate: (val: boolean) => void;
  isPublic: boolean;
  setIsPublic: (val: boolean) => void;
  publicSlug?: string;
  category: string;
  setCategory: (val: string) => void;
}

export function SettingsSection({
  isTemplate,
  setIsTemplate,
  isPublic,
  setIsPublic,
  publicSlug,
  category,
  setCategory,
}: SettingsSectionProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between space-x-2">
        <div className="space-y-0.5">
          <Label>Templating Mode</Label>
          <p className="text-muted-foreground text-sm">
            Enable dynamic variables
          </p>
        </div>
        <Switch checked={isTemplate} onCheckedChange={setIsTemplate} />
      </div>

      <div className="flex items-center justify-between space-x-2">
        <div className="space-y-0.5">
          <Label>Make Public</Label>
          <p className="text-muted-foreground text-sm">
            Anyone with the link can access this prompt
          </p>
        </div>
        <Switch checked={isPublic} onCheckedChange={setIsPublic} />
      </div>

      {isPublic && (
        <div className="animate-in fade-in slide-in-from-top-3 mt-2 space-y-2 duration-200">
          <Label
            htmlFor="category"
            className="text-muted-foreground text-xs font-semibold tracking-wider uppercase"
          >
            Marketplace Category
          </Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger
              id="category"
              className="bg-background/50 hover:bg-background/80 h-10 w-full rounded-xl border border-neutral-200 shadow-sm transition-colors dark:border-neutral-800"
            >
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent className="bg-popover rounded-xl border border-neutral-200 shadow-md dark:border-neutral-800">
              <SelectItem value="general">General</SelectItem>
              <SelectItem value="productivity">Productivity</SelectItem>
              <SelectItem value="development">Development</SelectItem>
              <SelectItem value="marketing">Marketing</SelectItem>
              <SelectItem value="creative">Creative</SelectItem>
              <SelectItem value="education">Education</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {isPublic && publicSlug && (
        <div className="bg-muted flex items-center space-x-2 rounded-md p-2">
          <Input
            readOnly
            value={`${typeof window !== 'undefined' ? window.location.origin : ''}/p/${publicSlug}`}
            className="h-8 bg-transparent"
          />
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={() => {
              if (typeof window !== 'undefined') {
                navigator.clipboard.writeText(
                  `${window.location.origin}/p/${publicSlug}`,
                );
                toast.success('Link copied to clipboard');
              }
            }}
          >
            Copy
          </Button>
        </div>
      )}
    </div>
  );
}
