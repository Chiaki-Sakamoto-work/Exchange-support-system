import { cn } from '@/lib/utils';

export const SkeletonBlock = ({ className }: { className?: string }) => (
  <div
    className={cn(
      'relative overflow-hidden rounded-full bg-muted',
      'before:content-[""] before:absolute before:inset-0 before:-translate-x-full',
      'before:bg-linear-to-r before:from-transparent before:via-white/55 before:to-transparent',
      'before:motion-safe:animate-skeleton-gradient',
      className,
    )}
  />
);
