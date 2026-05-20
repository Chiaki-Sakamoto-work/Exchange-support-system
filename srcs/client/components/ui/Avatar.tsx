'use client';

import { Avatar as AvatarPrimitive, Slot } from 'radix-ui';
import * as React from 'react';

import { cn } from '@/lib/utils';

/**
 * Avatarの形状バリアント
 * default: 角丸正方形 (14px)
 * rounded-full: 完全な円形
 */
type AvatarVariant = 'default' | 'rounded-full';

type AvatarGroupCountVariant = 'default' | 'primary-foreground';

/**
 * Avatar: メインコンテナ
 * @param size - "default" (40px), "sm" (24px), "lg" (96px)
 * @param variant - "default" (角丸), "rounded-full" (円形)
 */
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

        // サイズ設定
        'data-[size=default]:size-10 data-[size=lg]:size-24 data-[size=sm]:size-6',

        // 形状設定 (角丸か円形か)
        'data-[shape=default]:rounded-[14px]',
        'data-[shape=full]:rounded-full',

        className,
      )}
      {...props}
    />
  );
}

/**
 * AvatarImage: 実際のユーザー画像
 * 画像が正常に読み込まれた場合に表示されます。
 */
function AvatarImage({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      data-slot='avatar-image'
      className={cn(
        'aspect-square size-full object-cover',
        // 親(Avatar)の形状を継承
        'group-data-[shape=default]/avatar:rounded-[14px]',
        'group-data-[shape=full]/avatar:rounded-full',
        className,
      )}
      {...props}
    />
  );
}

/**
 * AvatarFallback: フォールバック（代替表示）
 * 画像がない、または読み込みに失敗した場合に表示される名前のイニシャルなど。
 */
function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot='avatar-fallback'
      className={cn(
        'flex size-full items-center justify-center bg-primary text-primary-foreground text-sm group-data-[size=sm]/avatar:text-xs',
        // 親(Avatar)の形状を継承
        'group-data-[shape=default]/avatar:rounded-[14px]',
        'group-data-[shape=full]/avatar:rounded-full',
        className,
      )}
      {...props}
    />
  );
}

/**
 * AvatarBadge: 右下に表示されるステータスアイコン（例：オンライン状態）
 */
function AvatarBadge({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span
      data-slot='avatar-badge'
      className={cn(
        'absolute right-0 bottom-0 z-10 inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground bg-blend-color ring-2 ring-background select-none',
        // アバターのサイズに合わせてバッジのサイズも自動調整
        'group-data-[size=sm]/avatar:size-2 group-data-[size=sm]/avatar:[&>svg]:hidden',
        'group-data-[size=default]/avatar:size-3 group-data-[size=default]/avatar:[&>svg]:size-2',
        'group-data-[size=lg]/avatar:size-5 group-data-[size=lg]/avatar:[&>svg]:size-3',
        className,
      )}
      {...props}
    />
  );
}

/**
 * AvatarGroup: 複数のアバターを重ねて表示するコンテナ
 */
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

/**
 * AvatarGroupCount: グループ表示で「+5」などの残り人数を表示する用
 */
const AvatarGroupCount = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'> & {
    asChild?: boolean;
    variant?: AvatarGroupCountVariant;
  }
>(function AvatarGroupCount(
  { className, asChild = false, variant = 'default', ...props },
  ref,
) {
  const Comp = asChild ? Slot.Root : 'div';

  return (
    <Comp
      ref={ref}
      data-slot='avatar-group-count'
      data-variant={variant}
      className={cn(
        'relative flex size-10 shrink-0 items-center justify-center rounded-full text-sm ring-2 ring-background group-has-data-[size=lg]/avatar-group:size-24 group-has-data-[size=sm]/avatar-group:size-6 [&>svg]:size-4 group-has-data-[size=lg]/avatar-group:[&>svg]:size-5 group-has-data-[size=sm]/avatar-group:[&>svg]:size-3',
        'data-[variant=default]:bg-muted data-[variant=default]:text-muted-foreground',
        'data-[variant=primary-foreground]:bg-primary-foreground data-[variant=primary-foreground]:text-foreground',
        className,
      )}
      {...props}
    />
  );
});

export {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
};
