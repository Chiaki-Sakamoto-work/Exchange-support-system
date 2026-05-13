import type * as React from 'react';

import { cn } from '@/lib/utils';

function Card({
  className,
  size = 'default',
  ...props
}: React.ComponentProps<'div'> & { size?: 'default' | 'sm' | 'xs' }) {
  return (
    <div
      data-slot='card'
      data-size={size}
      className={cn(
        'group/card flex flex-col overflow-hidden rounded-[16px] bg-card text-sm text-card-foreground',
        'ring-1 ring-inset ring-card-foreground/[8%]',
        'shadow-[0px_5.89px_17.66px] shadow-card-foreground/[8%]',
        'data-[size=default]:w-158 data-[size=default]:h-36.5 data-[size=default]:gap-4 data-[size=default]:py-4',
        'data-[size=sm]:w-91 data-[size=sm]:h-11 data-[size=sm]:gap-3 data-[size=sm]:py-3',
        'data-[size=xs]:w-20 data-[size=xs]:h-6 data-[size=sm]:gap-2 data-[size=sm]:py-2',
        'has-data-[slot=card-footer]:pb-0 has-[>img:first-child]:pt-0 *:[img:first-child]:rounded-t-xl *:[img:last-child]:rounded-b-xl',
        className,
      )}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='card-header'
      className={cn(
        'flex flex-row items-center group/card-header @container/card-header auto-rows-min gap-1 rounded-t-xl px-4 group-data-[size=sm]/card:px-3 has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto] [.border-b]:pb-4 group-data-[size=sm]/card:[.border-b]:pb-3 ',
        '[&>[data-slot=card-action]]:ml-auto',
        className,
      )}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='card-title'
      className={cn(
        'text-base leading-snug font-medium group-data-[size=sm]/card:text-sm',
        className,
      )}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='card-description'
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    />
  );
}

function CardAction({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='card-action'
      className={cn(
        'col-start-2 row-span-2 row-start-1 self-start justify-self-end',
        className,
      )}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='card-content'
      className={cn(
        'px-4 group-data-[size=sm]/card:px-3 text-sm text-muted-foreground flex-1 flex flex-col',
        'group-data-[size=sm]/card:px-3 group-data-[size=sm]/card:justify-center',
        'group-data-[size=xs]/card:px-2 group-data-[size=xs]/card:justify-center group-data-[size=xs]/card:items-center group-data-[size=xs]/card:text-center',
        className,
      )}
      {...props}
    />
  );
}

function CardFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='card-footer'
      className={cn(
        'flex items-center rounded-b-xl border-t bg-muted/50 p-4 group-data-[size=sm]/card:p-3',
        className,
      )}
      {...props}
    />
  );
}

export {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
};
