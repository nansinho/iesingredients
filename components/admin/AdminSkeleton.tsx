import { cn } from "@/lib/utils";

function Bone({ className }: { className?: string }) {
  return (
    <div className={cn("animate-pulse rounded-lg bg-gray-200/70", className)} />
  );
}

export function PageHeaderSkeleton() {
  return (
    <div className="mb-6 flex items-center justify-between">
      <div>
        <Bone className="h-7 w-48 mb-2" />
        <Bone className="h-4 w-32" />
      </div>
      <div className="flex gap-2">
        <Bone className="h-9 w-9 rounded-lg" />
        <Bone className="h-9 w-32 rounded-lg" />
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <div>
      {/* Search bar */}
      <div className="mb-4">
        <Bone className="h-10 w-80 rounded-xl" />
      </div>
      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="flex gap-4 px-4 py-3 border-b bg-gray-50/80">
          {Array.from({ length: cols }).map((_, i) => (
            <Bone key={i} className="h-3 flex-1 max-w-[100px]" />
          ))}
        </div>
        {/* Rows */}
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="flex items-center gap-4 px-4 py-4 border-b last:border-0">
            <Bone className="h-10 w-10 rounded-lg shrink-0" />
            <div className="flex-1 space-y-2">
              <Bone className="h-4 w-3/4" />
              <Bone className="h-3 w-1/2" />
            </div>
            <Bone className="h-5 w-16 rounded-full" />
            <Bone className="h-5 w-14 rounded-full" />
            <Bone className="h-4 w-20" />
            <Bone className="h-8 w-8 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div>
      <PageHeaderSkeleton />
      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <Bone className="h-4 w-20" />
              <Bone className="h-8 w-8 rounded-lg" />
            </div>
            <Bone className="h-8 w-16 mb-1" />
            <Bone className="h-3 w-24" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function BlogSkeleton() {
  return (
    <div>
      <PageHeaderSkeleton />
      <TableSkeleton rows={5} cols={5} />
    </div>
  );
}

export function SettingsSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <Bone className="h-10 w-10 rounded-lg" />
            <div className="flex-1">
              <Bone className="h-4 w-32 mb-1.5" />
              <Bone className="h-3 w-48" />
            </div>
            <Bone className="h-7 w-20 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}
