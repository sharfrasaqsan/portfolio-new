import React from "react";

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = "" }) => {
  return (
    <div
      aria-hidden="true"
      className={`bg-[#E5E4DE]/70 dark:bg-[#27313A]/70 animate-pulse rounded-md ${className}`}
    />
  );
};

export const CardSkeleton = () => (
  <div className="rounded-md border border-[#E5E4DE] dark:border-[#27313A] bg-[#FFFFFF] dark:bg-[#1B2228] p-5 space-y-4">
    <Skeleton className="h-44 w-full rounded-sm" />
    <div className="space-y-2">
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-3.5 w-full" />
      <Skeleton className="h-3.5 w-4/5" />
    </div>
    <div className="flex gap-2 pt-2">
      <Skeleton className="h-5 w-16" />
      <Skeleton className="h-5 w-20" />
    </div>
  </div>
);

export const BlogSkeleton = () => (
  <div className="flex flex-col md:flex-row gap-5 p-5 rounded-md border border-[#E5E4DE] dark:border-[#27313A] bg-[#FFFFFF] dark:bg-[#1B2228]">
    <Skeleton className="w-full md:w-44 h-32 rounded-sm shrink-0" />
    <div className="flex-1 space-y-3 py-1">
      <div className="flex gap-3">
        <Skeleton className="h-3.5 w-24" />
        <Skeleton className="h-3.5 w-20" />
      </div>
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
    </div>
  </div>
);

export const PageSkeleton = () => (
  <div className="max-w-5xl mx-auto space-y-8 animate-pulse py-8">
    <div className="space-y-4">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-10 w-2/3" />
      <Skeleton className="h-5 w-full max-w-2xl" />
    </div>
    <Skeleton className="h-[420px] w-full rounded-md" />
    <div className="grid md:grid-cols-3 gap-8 pt-4">
      <div className="md:col-span-2 space-y-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-32 w-full rounded-md" />
      </div>
    </div>
  </div>
);
