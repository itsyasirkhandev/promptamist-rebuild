import React from 'react';
import { Metadata } from 'next';
import { MarketplaceSearch } from '@/components/marketplace/MarketplaceSearch';

export const metadata: Metadata = {
  title: 'Public Prompt Marketplace',
  description: 'Discover, search, and use publicly shared AI prompts from the Promptamist community.',
};

export default function MarketplacePage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
          Public Marketplace
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Discover, search, and copy publicly shared AI prompts created by the community.
        </p>
      </div>

      <MarketplaceSearch />
    </div>
  );
}
