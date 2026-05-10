import { Loader } from '@/components/ui/Loader';

export default function Loading() {
  return (
    <div className="bg-background/80 fixed inset-0 z-50 flex flex-col items-center justify-center backdrop-blur-sm transition-all duration-300">
      <div className="relative">
        {/* Glow effect */}
        <div className="bg-primary/20 absolute inset-0 -z-10 animate-pulse rounded-full blur-3xl" />
        <Loader size={64} className="text-primary" />
      </div>
      <p className="text-muted-foreground mt-8 animate-pulse text-sm font-medium tracking-widest uppercase">
        Loading Experience...
      </p>
    </div>
  );
}
