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
  const shouldShowFade = false; //isLoading || !isEmpty;

  return (
    <section
      aria-label={ariaLabel}
      className={cn(
        'relative -mx-4 min-h-0 flex-1 overflow-y-auto overscroll-contain px-4',
        className,
      )}
    >
      {shouldShowFade && (
        <div
          aria-hidden
          className='pointer-events-none sticky top-0 z-20 -mx-4 h-8 -mb-8 bg-linear-to-b from-background via-background/85 to-transparent'
        />
      )}
      {isLoading ? (
        <div className='pb-8'>{loadingFallback}</div>
      ) : isEmpty ? (
        <p className='py-10 text-center text-sm text-muted-foreground'>
          {emptyMessage}
        </p>
      ) : (
        <div className={cn('space-y-4 pb-8', contentClassName)}>{children}</div>
      )}
      {shouldShowFade && (
        <div
          aria-hidden
          className='pointer-events-none sticky bottom-0 z-20 -mx-4 h-8 -mt-8 bg-linear-to-t from-background via-background/85 to-transparent'
        />
      )}
    </section>
  );
};
