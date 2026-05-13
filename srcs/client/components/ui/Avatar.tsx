'use client';

import { Avatar as AvatarPrimitive } from 'radix-ui';
import type * as React from 'react';

import { cn } from '@/lib/utils';

// 1. 조합 가능한 variant 타입 정의
type AvatarVariant = 'default' | 'rounded-full';

function Avatar({
  className,
  size = 'default',
  variant = 'default',
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root> & {
  size?: 'default' | 'sm' | 'lg';
  variant?: AvatarVariant;
}) {
  const isRoundedFull = variant.includes('rounded-full');
  const baseVariant = variant.split(' ')[0];

  return (
    <AvatarPrimitive.Root
      data-slot='avatar'
      data-size={size}
      data-variant={baseVariant}
      data-shape={isRoundedFull ? 'full' : 'default'}
      className={cn(
        'group/avatar relative flex shrink-0 select-none',

        // --- Sizes ---
        'data-[size=default]:size-10 data-[size=lg]:size-24 data-[size=sm]:size-6',

        'data-[shape=default]:rounded-[14px]',
        'data-[shape=full]:rounded-full',

        className,
      )}
      {...props}
    />
  );
}

function AvatarImage({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      data-slot='avatar-image'
      className={cn(
        'aspect-square size-full object-cover',

        'group-data-[shape=default]/avatar:rounded-[14px]',
        'group-data-[shape=full]/avatar:rounded-full',

        className,
      )}
      {...props}
    />
  );
}

function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot='avatar-fallback'
      className={cn(
        'flex size-full items-center justify-center bg-primary text-primary-foreground text-sm group-data-[size=sm]/avatar:text-xs',

        'group-data-[shape=default]/avatar:rounded-[14px]',
        'group-data-[shape=full]/avatar:rounded-full',

        className,
      )}
      {...props}
    />
  );
}

function AvatarBadge({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span
      data-slot='avatar-badge'
      className={cn(
        'absolute right-0 bottom-0 z-10 inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground bg-blend-color ring-2 ring-background select-none',
        'group-data-[size=sm]/avatar:size-2 group-data-[size=sm]/avatar:[&>svg]:hidden',
        'group-data-[size=default]/avatar:size-3 group-data-[size=default]/avatar:[&>svg]:size-2',
        'group-data-[size=lg]/avatar:size-5 group-data-[size=lg]/avatar:[&>svg]:size-3',
        className,
      )}
      {...props}
    />
  );
}

function AvatarGroup({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='avatar-group'
      className={cn(
        'group/avatar-group flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:ring-background',
        className,
      )}
      {...props}
    />
  );
}

function AvatarGroupCount({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='avatar-group-count'
      className={cn(
        'relative flex size-10 shrink-0 items-center justify-center rounded-full bg-muted text-sm text-muted-foreground ring-2 ring-background group-has-data-[size=lg]/avatar-group:size-24 group-has-data-[size=sm]/avatar-group:size-6 [&>svg]:size-4 group-has-data-[size=lg]/avatar-group:[&>svg]:size-5 group-has-data-[size=sm]/avatar-group:[&>svg]:size-3',
        className,
      )}
      {...props}
    />
  );
}

export {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
};
