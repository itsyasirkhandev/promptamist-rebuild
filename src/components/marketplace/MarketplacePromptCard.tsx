import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Copy, ExternalLink, Check, User2 } from 'lucide-react';
import { toast } from 'sonner';

export interface PublicPromptDTO {
  _id: string;
  title: string;
  content: string;
  tags: string[];
  isTemplate: boolean;
  publicSlug?: string;
  _creationTime: number;
  authorName?: string;
  authorImageUrl?: string;
}

interface MarketplacePromptCardProps {
  prompt: PublicPromptDTO;
}

export function MarketplacePromptCard({ prompt }: MarketplacePromptCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt.content);
      setCopied(true);
      toast.success('Prompt copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy prompt');
    }
  };

  const handleUse = () => {
    if (prompt.publicSlug) {
      window.open(`/p/${prompt.publicSlug}`, '_blank');
    }
  };

  return (
    <Card className="flex flex-col h-full hover:border-primary/50 transition-colors">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-4">
          <CardTitle className="text-lg font-semibold line-clamp-1">{prompt.title}</CardTitle>
          {prompt.isTemplate && (
            <Badge variant="secondary" className="shrink-0">Template</Badge>
          )}
        </div>
        
        <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
          {prompt.authorImageUrl ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={prompt.authorImageUrl} alt={prompt.authorName || 'Author'} className="w-5 h-5 rounded-full" />
          ) : (
            <div className="w-5 h-5 rounded-full bg-secondary flex items-center justify-center">
              <User2 className="w-3 h-3" />
            </div>
          )}
          <span className="truncate">{prompt.authorName || 'Anonymous'}</span>
        </div>
      </CardHeader>

      <CardContent className="flex-1 pb-3">
        <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
          {prompt.content}
        </p>
        
        {prompt.tags && prompt.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-auto">
            {prompt.tags.map((tag, idx) => (
              <Badge key={idx} variant="outline" className="text-xs py-0 h-5">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-3 gap-2 border-t mt-auto">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1"
          onClick={handleCopy}
        >
          {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
          {copied ? 'Copied' : 'Copy'}
        </Button>
        
        {prompt.isTemplate && prompt.publicSlug && (
          <Button 
            variant="default" 
            size="sm" 
            className="flex-1"
            onClick={handleUse}
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Use
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
