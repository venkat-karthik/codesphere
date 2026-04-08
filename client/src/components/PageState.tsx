import { Loader2, AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

// ── Full-page spinner ──────────────────────────────────────────────────────
export function PageLoader({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] gap-3">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}

// ── Full-page error ────────────────────────────────────────────────────────
export function PageError({
  message = 'Failed to load data',
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] gap-4 text-center p-8">
      <AlertTriangle className="w-8 h-8 text-destructive" />
      <div>
        <p className="font-semibold text-foreground">Oops</p>
        <p className="text-sm text-muted-foreground mt-1">{message}</p>
      </div>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Retry
        </Button>
      )}
    </div>
  );
}

// ── Card skeleton grid ─────────────────────────────────────────────────────
export function CardSkeletons({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-lg border bg-card p-4 space-y-3">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-2/3" />
          <Skeleton className="h-8 w-24 mt-2" />
        </div>
      ))}
    </div>
  );
}

// ── Table skeleton ─────────────────────────────────────────────────────────
export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-2">
      <Skeleton className="h-10 w-full" />
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-12 w-full" />
      ))}
    </div>
  );
}
