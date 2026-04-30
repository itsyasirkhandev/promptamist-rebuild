'use client';

import * as React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface SettingsSectionProps {
  isTemplate: boolean;
  setIsTemplate: (val: boolean) => void;
  isPublic: boolean;
  setIsPublic: (val: boolean) => void;
  publicSlug?: string;
}

export function SettingsSection({
  isTemplate,
  setIsTemplate,
  isPublic,
  setIsPublic,
  publicSlug,
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
