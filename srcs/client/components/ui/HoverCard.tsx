'use client';

import { HoverCard as HoverCardPrimitive } from 'radix-ui';
import type * as React from 'react';

import { cn } from '@/lib/utils';

function HoverCard({
  ...props
}: React.ComponentProps<typeof HoverCardPrimitive.Root>) {
  return <HoverCardPrimitive.Root data-slot='hover-card' {...props} />;
}

function HoverCardTrigger({
  ...props
}: React.ComponentProps<typeof HoverCardPrimitive.Trigger>) {
  return (
    <HoverCardPrimitive.Trigger data-slot='hover-card-trigger' {...props} />
  );
}

function HoverCardContent({
  className,
  align = 'center',
  sideOffset = 8,
  ...props
}: React.ComponentProps<typeof HoverCardPrimitive.Content>) {
  return (
    <HoverCardPrimitive.Portal>
      <HoverCardPrimitive.Content
        data-slot='hover-card-content'
        align={align}
        sideOffset={sideOffset}
        className={cn(
          'z-50 w-64 rounded-xl bg-popover p-3 text-popover-foreground shadow-md ring-1 ring-border outline-none',
          'data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95',
          className,
        )}
        {...props}
      />
    </HoverCardPrimitive.Portal>
  );
}

export { HoverCard, HoverCardContent, HoverCardTrigger };
