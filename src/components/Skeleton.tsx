import React from 'react';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className }) => {
  return (
    <div 
      className={`bg-gray-200 animate-pulse rounded-md ${className}`} 
    />
  );
};

export const CardSkeleton = () => (
  <div className="rounded-2xl border border-gray-100 bg-white overflow-hidden p-6 space-y-4 shadow-sm">
    <Skeleton className="h-48 w-full rounded-xl" />
    <div className="space-y-2">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
    </div>
    <div className="flex gap-2">
      <Skeleton className="h-6 w-16" />
      <Skeleton className="h-6 w-16" />
    </div>
  </div>
);

export const BlogSkeleton = () => (
  <div className="flex flex-col md:flex-row gap-6 p-6 rounded-2xl border border-gray-100 bg-white shadow-sm">
    <Skeleton className="w-full md:w-48 h-32 rounded-xl shrink-0" />
    <div className="flex-1 space-y-4 py-2">
      <div className="flex gap-4">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-24" />
      </div>
      <Skeleton className="h-8 w-3/4" />
      <Skeleton className="h-4 w-full" />
    </div>
  </div>
);

export const PageSkeleton = () => (
  <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 animate-pulse">
    <div className="flex flex-col md:flex-row gap-8">
      <div className="flex-1 space-y-6">
        <Skeleton className="h-12 w-3/4 rounded-lg" />
        <div className="flex gap-4">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-6 w-32" />
        </div>
        <Skeleton className="h-[400px] w-full rounded-2xl" />
        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
      <div className="w-full md:w-80 space-y-6">
        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 space-y-4">
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    </div>
  </div>
);

