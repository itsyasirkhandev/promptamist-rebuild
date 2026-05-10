import { Loader } from "@/components/ui/Loader";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm transition-all duration-300">
      <div className="relative">
        {/* Glow effect */}
        <div className="absolute inset-0 -z-10 animate-pulse bg-primary/20 blur-3xl rounded-full" />
        <Loader size={64} className="text-primary" />
      </div>
      <p className="mt-8 animate-pulse text-sm font-medium text-muted-foreground tracking-widest uppercase">
        Loading Experience...
      </p>
    </div>
  );
}
