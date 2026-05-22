import React from 'react';
import { Metadata } from 'next';
import { MarketplaceSearch } from '@/components/marketplace/MarketplaceSearch';

export const metadata: Metadata = {
  title: 'Public Prompt Marketplace',
  description:
    'Discover, search, and use publicly shared AI prompts from the Promptamist community.',
};

export default function MarketplacePage() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="from-primary to-primary/70 mb-4 bg-gradient-to-r bg-clip-text text-4xl font-extrabold tracking-tight text-transparent lg:text-5xl">
          Public Marketplace
        </h1>
        <p className="text-muted-foreground mx-auto max-w-2xl text-xl">
          Discover, search, and copy publicly shared AI prompts created by the
          community.
        </p>
      </div>

      <MarketplaceSearch />
    </div>
  );
}
