import type * as React from 'react';

import { cn } from '@/lib/utils';

/**
 * Cardのバリアント型定義
 * shadow-none を含めることで影を消すことができます。
 */
type CardVariant =
  | 'default'
  | 'default shadow-none'
  | 'secondary'
  | 'secondary shadow-none'
  | 'destructive'
  | 'destructive shadow-none';

/**
 * Card: メインコンテナ
 * @param size - "default" (大), "sm" (中), "xs" (極小)
 * @param variant - スタイル（default, secondary, destructive）と影（shadow-none）の組み合わせ
 */
function Card({
  className,
  size = 'default',
  variant = 'default',
  ...props
}: React.ComponentProps<'div'> & {
  size?: 'default' | 'sm' | 'xs';
  variant?: CardVariant;
}) {
  const isShadowNone = variant.includes('shadow-none');
  const baseVariant = variant.split(' ')[0] as
    | 'default'
    | 'secondary'
    | 'destructive';

  return (
    <div
      data-slot='card'
      data-size={size}
      data-variant={baseVariant}
      data-shadow={isShadowNone ? 'none' : 'default'}
      className={cn(
        // 基本スタイル
        'group/card flex flex-col overflow-hidden rounded-[16px] text-sm transition-all',

        // バリアント別の配色
        'data-[variant=default]:bg-card data-[variant=default]:text-card-foreground',
        'data-[variant=secondary]:bg-secondary data-[variant=secondary]:text-secondary-foreground',
        'data-[variant=destructive]:bg-destructive/10 data-[variant=destructive]:text-destructive',

        // 影の設定
        'data-[shadow=default]:ring-1 data-[shadow=default]:ring-inset',
        'data-[shadow=default]:shadow-[0px_5.89px_17.66px]',

        // バリアント×影の組み合わせ（リングカラーとシャドウの色調整）
        'data-[shadow=default]:data-[variant=default]:ring-card-foreground/[8%] data-[shadow=default]:data-[variant=default]:shadow-card-foreground/[8%]',
        'data-[shadow=default]:data-[variant=secondary]:ring-foreground/[8%] data-[shadow=default]:data-[variant=secondary]:shadow-foreground/[8%]',
        'data-[shadow=default]:data-[variant=destructive]:ring-destructive/25 data-[shadow=default]:data-[variant=destructive]:shadow-destructive/[4%]',

        // サイズ設定
        'data-[size=default]:w-158 data-[size=default]:h-36.5 data-[size=default]:gap-4 data-[size=default]:py-4',
        'data-[size=sm]:w-91 data-[size=sm]:h-11 data-[size=sm]:gap-3 data-[size=sm]:py-3',
        'data-[size=xs]:w-20 data-[size=xs]:h-6 data-[size=xs]:gap-2 data-[size=xs]:py-0',

        // 特殊なレイアウト調整（フッターがある場合、画像がある場合など）
        'has-data-[slot=card-footer]:pb-0 has-[>img:first-child]:pt-0 *:[img:first-child]:rounded-t-xl *:[img:last-child]:rounded-b-xl',
        className,
      )}
      {...props}
    />
  );
}

/**
 * CardHeader: タイトルや説明を配置する上部セクション
 */
function CardHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='card-header'
      className={cn(
        'flex flex-row items-center group/card-header @container/card-header auto-rows-min gap-3 rounded-t-xl px-4 group-data-[size=sm]/card:px-3 has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto] [.border-b]:pb-4 group-data-[size=sm]/card:[.border-b]:pb-3 ',
        'group-data-[variant=destructive]/card:text-destructive',
        '[&>[data-slot=card-action]]:ml-auto', // アクションボタンを右端に寄せる
        className,
      )}
      {...props}
    />
  );
}

/**
 * CardTitle: メインタイトル（強調表示）
 */
function CardTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='card-title'
      className={cn(
        'text-base leading-snug font-medium group-data-[size=sm]/card:text-sm',
        'group-data-[variant=destructive]/card:text-destructive',
        className,
      )}
      {...props}
    />
  );
}

/**
 * CardDescription: 補足説明（薄い色で表示）
 */
function CardDescription({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='card-description'
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    />
  );
}

/**
 * CardAction: ヘッダー内の右側に配置するボタンやメニュー用スロット
 */
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

/**
 * CardContent: メインの内容を配置するエリア
 */
function CardContent({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='card-content'
      className={cn(
        'px-4 group-data-[size=sm]/card:px-3 text-sm text-muted-foreground flex-1 flex flex-col',
        'group-data-[variant=destructive]/card:text-destructive',
        'group-data-[size=sm]/card:justify-center',
        'group-data-[size=xs]/card:px-2 group-data-[size=xs]/card:justify-center group-data-[size=xs]/card:items-center group-data-[size=xs]/card:text-center',
        className,
      )}
      {...props}
    />
  );
}

/**
 * CardFooter: 下部の境界線付きセクション（ボタンなどを配置）
 */
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
