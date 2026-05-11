import React from 'react';

export function Skeleton({ className = '', variant = 'text' }) {
  const baseClasses = 'animate-pulse bg-slate-200';
  
  const variants = {
    text: 'h-4 w-3/4 rounded',
    circular: 'h-12 w-12 rounded-full',
    rectangular: 'h-32 w-full rounded-xl',
    tableRow: 'h-10 w-full rounded-md'
  };

  return (
    <div className={`${baseClasses} ${variants[variant]} ${className}`} />
  );
}

// Helper to render multiple skeletons easily
export function SkeletonList({ count = 3, variant = 'text', className = '' }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} variant={variant} className={className} />
      ))}
    </div>
  );
}