import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function DashboardCardSkeleton() {
  return (
    <Card className="overflow-hidden border-l-4 border-l-muted shadow-sm">
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left: Avatar & Info */}
          <div className="lg:col-span-4 flex items-center gap-4">
            <Skeleton className="h-14 w-14 rounded-full shrink-0" />
            <div className="space-y-2 w-full max-w-[200px]">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-6 w-20 rounded-full mt-1" />
            </div>
          </div>

          {/* Center: Stats */}
          <div className="lg:col-span-6 w-full grid grid-cols-2 md:grid-cols-3 gap-4 px-4 border-l border-r border-transparent">
            <div className="flex flex-col items-center gap-2">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-6 w-8" />
            </div>
            <div className="flex flex-col items-center gap-2">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-5 w-24" />
            </div>
            <div className="flex flex-col items-center gap-2 col-span-2 md:col-span-1">
              <Skeleton className="h-3 w-12" />
              <Skeleton className="h-5 w-24" />
            </div>
          </div>

          {/* Right: Actions */}
          <div className="lg:col-span-2 flex justify-end">
            <Skeleton className="h-9 w-full lg:w-24" />
          </div>
        </div>
      </div>
      <div className="bg-muted/40 border-t px-6 py-3 flex justify-between items-center">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-24" />
      </div>
    </Card>
  );
}
