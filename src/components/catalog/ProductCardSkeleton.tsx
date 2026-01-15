import { Skeleton } from '@/components/ui/skeleton';

export const ProductCardSkeleton = () => {
  return (
    <div className="relative h-full rounded-2xl border overflow-hidden bg-secondary/50 border-border/50">
      {/* Image Section Skeleton */}
      <Skeleton className="h-40 w-full rounded-none" />
      
      {/* Content Skeleton */}
      <div className="p-4">
        {/* Product Code */}
        <div className="text-center mb-3">
          <Skeleton className="h-2 w-16 mx-auto mb-2" />
          <Skeleton className="h-6 w-24 mx-auto" />
        </div>
        
        {/* Separator */}
        <div className="flex justify-center mb-3">
          <Skeleton className="h-0.5 w-12" />
        </div>

        {/* Title */}
        <div className="space-y-2 mb-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4 mx-auto" />
        </div>

        {/* Benefits Tags */}
        <div className="flex flex-wrap justify-center gap-1 mb-3">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>

        {/* Bottom info */}
        <div className="pt-3 border-t border-current/10 flex items-center justify-between">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-12" />
        </div>
      </div>
    </div>
  );
};

export const ProductGridSkeleton = ({ count = 12 }: { count?: number }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </>
  );
};
