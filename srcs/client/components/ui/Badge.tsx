import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from 'radix-ui';
import type * as React from 'react';

import { cn } from '@/lib/utils';

/**
 * Badgeのスタイル定義 (CVA)
 * * @example
 * variant: "default" | "secondary" | "destructive" | "outline" | "ghost" | "link" | "accent"
 * size: "default" | "xs" | "sm" | "lg"
 */
const badgeVariants = cva(
  'group/badge inline-flex w-fit shrink-0 items-center justify-center gap-2 overflow-hidden rounded-4xl border border-transparent font-medium whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none',
  {
    variants: {
      /**
       * デザイン系統の設定
       */
      variant: {
        default: 'bg-primary-foreground text-primary [a]:hover:bg-primary/80', // 標準（塗りつぶし）
        primary: 'bg-primary text-primary-foreground [a]:hover:bg-primary/80', // 標準（塗りつぶし）
        secondary:
          'bg-secondary text-secondary-foreground [a]:hover:bg-secondary/80', // 補助・補足
        destructive:
          'bg-destructive text-destructive-foreground [a]:hover:bg-destructive/20', // 警告・エラー・削除
        outline:
          'border-border text-foreground [a]:hover:bg-muted [a]:hover:text-muted-foreground', // 枠線のみ
        ghost:
          'hover:bg-muted hover:text-muted-foreground dark:hover:bg-muted/50', // 背景なし（ホバーで背景出現）
        link: 'text-primary underline-offset-4 hover:underline', // テキストリンク風
        accent: 'bg-accent text-accent-foreground [a]:hover:bg-accent/80', // アクセント強調
        green: 'bg-green-500 text-accent-foreground [a]:hover:bg-green-500/80',
      },
      /**
       * サイズの設定
       */
      size: {
        xs: 'min-h-4 px-1.5 py-0 text-[10px] [&>svg]:size-2.5!', // 極小（注釈や通知バッジ用）
        sm: 'min-h-6 px-2 py-0.5 text-xs [&>svg]:size-3!', // 小さめ
        default: 'min-h-7 px-2 py-1 text-sm [&>svg]:size-4!', // 標準
        lg: 'min-h-8 px-1.5 py-1 text-sm [&>svg]:size-4!', // 大きめ（余白広め）
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

/**
 * Badgeコンポーネント
 * * @param variant - スタイル（default, outline, secondary等）
 * @param size - サイズ（default, xs, sm, lg）
 * @param asChild - trueの場合、子要素（aタグなど）をバッジとしてレンダリングする
 * * @example
 * // 基本的な使い方
 * <Badge>NEW</Badge>
 * * // 枠線付きの小さなバッジ
 * <Badge variant="outline" size="sm">Update</Badge>
 * * // リンクとして使用（asChild）
 * <Badge asChild variant="secondary">
 * <a href="/tags/react">#React</a>
 * </Badge>
 */
function Badge({
  className,
  variant = 'default',
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'span'> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : 'span';

  return (
    <Comp
      data-slot='badge'
      data-variant={variant}
      data-size={size}
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
