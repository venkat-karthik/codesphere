import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function DashboardSkeleton() {
  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row justify-between gap-6">
        <div className="space-y-4">
          <Skeleton className="h-12 w-64 rounded-xl" />
          <div className="flex gap-4">
            <Skeleton className="h-6 w-32 rounded-full" />
            <Skeleton className="h-6 w-32 rounded-full" />
          </div>
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-12 w-32 rounded-2xl" />
          <Skeleton className="h-12 w-48 rounded-2xl" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-6 md:auto-rows-[160px]">
        <Skeleton className="md:col-span-4 lg:col-span-8 md:row-span-2 rounded-[2.5rem]" />
        <Skeleton className="md:col-span-2 lg:col-span-4 md:row-span-1 rounded-[2rem]" />
        <Skeleton className="md:col-span-2 lg:col-span-4 md:row-span-1 rounded-[2rem]" />
        <Skeleton className="md:col-span-3 lg:col-span-6 md:row-span-2 rounded-[2.5rem]" />
        <Skeleton className="md:col-span-3 lg:col-span-6 md:row-span-2 rounded-[2.5rem]" />
      </div>
    </div>
  );
}

export function RoadmapSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <Card key={i} className="rounded-[2rem] overflow-hidden border-border/40">
          <Skeleton className="h-48 w-full" />
          <CardHeader>
            <Skeleton className="h-6 w-3/4" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <div className="flex justify-between items-center pt-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-24 rounded-lg" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function ProblemSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <Card key={i} className="p-6 rounded-2xl border-border/40 flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <Skeleton className="h-10 w-10 rounded-xl" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-5 w-1/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
          <Skeleton className="h-8 w-24 rounded-lg" />
        </Card>
      ))}
    </div>
  );
}
