import { type ReactNode, useState } from 'react';
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
  const [isScrolled, setIsScrolled] = useState(false);

  const handleScroll = (e: React.UIEvent<HTMLElement>) => {
    setIsScrolled(e.currentTarget.scrollTop > 0);
  };

  return (
    <section
      aria-label={ariaLabel}
      onScroll={handleScroll}
      className={cn(
        'relative -mx-4 min-h-0 flex-1 overflow-y-auto overscroll-contain px-4',
        isScrolled &&
          'border-t border-border shadow-[inset_0_10px_10px_-10px_rgba(0,0,0,0.05)]',
        className,
      )}
    >
      {isLoading ? (
        <div className='pb-8'>{loadingFallback}</div>
      ) : isEmpty ? (
        <p className='py-10 text-center text-sm text-muted-foreground'>
          {emptyMessage}
        </p>
      ) : (
        <div className={cn('space-y-4 pb-8', contentClassName)}>{children}</div>
      )}
    </section>
  );
};
