import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type EventCardListProps = {
  ariaLabel: string;
  children: ReactNode;
  emptyMessage: string;
  isEmpty: boolean;
  isLoading?: boolean;
  loadingFallback?: ReactNode;
  className?: string;
  contentClassName?: string;
};

export const EventCardList = ({
  ariaLabel,
  children,
  emptyMessage,
  isEmpty,
  isLoading = false,
  loadingFallback,
  className,
  contentClassName,
}: EventCardListProps) => {
  return (
    <section
      aria-label={ariaLabel}
      className={cn(
        'min-h-0 flex-1 overflow-y-auto overscroll-contain',
        className,
      )}
    >
      {isLoading ? (
        loadingFallback
      ) : isEmpty ? (
        <p className='py-10 text-center text-sm text-zinc-500'>
          {emptyMessage}
        </p>
      ) : (
        <div className={cn('space-y-4', contentClassName)}>{children}</div>
      )}
    </section>
  );
};
