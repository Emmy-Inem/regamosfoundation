import { Skeleton } from "@/components/ui/skeleton";

interface PageLoadingSkeletonProps {
  type?: "default" | "blog" | "cards" | "form";
}

const PageLoadingSkeleton = ({ type = "default" }: PageLoadingSkeletonProps) => {
  if (type === "blog") {
    return (
      <div className="container mx-auto px-4 py-8" aria-busy="true" aria-label="Loading blog posts">
        <Skeleton className="h-10 w-48 mb-8" />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-48 w-full rounded-xl" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === "cards") {
    return (
      <div className="container mx-auto px-4 py-8" aria-busy="true" aria-label="Loading content">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="p-6 rounded-xl border border-border space-y-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === "form") {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6" aria-busy="true" aria-label="Loading form">
        <Skeleton className="h-10 w-64 mb-8" />
        {[...Array(4)].map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
        <Skeleton className="h-10 w-32 mt-4" />
      </div>
    );
  }

  // Default skeleton
  return (
    <div className="container mx-auto px-4 py-8 space-y-8" aria-busy="true" aria-label="Loading page">
      {/* Hero skeleton */}
      <Skeleton className="h-[400px] w-full rounded-2xl" />
      
      {/* Content skeleton */}
      <div className="space-y-4 max-w-3xl mx-auto">
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>

      {/* Cards skeleton */}
      <div className="grid md:grid-cols-3 gap-6 mt-12">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="p-6 rounded-xl border border-border space-y-4">
            <Skeleton className="h-12 w-12 rounded-lg" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PageLoadingSkeleton;
