import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from 'radix-ui';
import type * as React from 'react';

import { cn } from '@/lib/utils';

/**
 * Buttonのスタイル定義 (CVA)
 * * @example
 * variant: "default" | "accent" | "outline" | "secondary" | "ghost" | "destructive" | "link"
 * size: "default" | "xs" | "sm" | "lg" | "xl" | "icon" | "icon-xs" | "icon-sm" | "icon-lg"
 */
const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-lg bg-clip-padding text-sm font-medium whitespace-nowrap transition-all duration-200 ease-in-out outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 hover:scale-[1.02] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      /**
       * デザイン系統の設定
       */
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/80', // 標準（塗りつぶし）
        accent:
          'bg-accent text-accent-foreground hover:bg-[color-mix(in_srgb,var(--color-accent),black_10%)]', // アクセントカラー
        outline:
          'border border-border bg-background hover:bg-muted hover:text-foreground', // 枠線のみ
        secondary:
          'border border-border bg-secondary text-secondary-foreground hover:bg-primary/80! hover:text-accent-foreground!', // 補助ボタン
        ghost: 'hover:bg-muted hover:text-foreground', // 背景なし（ホバー時のみ出現）
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-[color-mix(in_srgb,var(--color-destructive),black_10%)]', // 削除・警告
        link: 'text-primary underline-offset-4 hover:underline', // テキストリンク風
      },
      /**
       * サイズと形状の設定
       */
      size: {
        // --- テキストボタン用 (横長) ---
        default: 'h-12 w-40 rounded-2xl gap-1.5 px-2.5', // 標準 (48px高 / 160px幅)
        xs: 'h-7 w-12 gap-1 rounded-full px-2 text-xs', // 極小 (28px高 / 48px幅)
        sm: 'h-9 w-18 gap-1 rounded-full px-2.5 text-[0.8rem]', // 小さめ (36px高 / 72px幅)
        lg: 'h-14 w-77 rounded-2xl gap-1.5 px-2.5', // 大きめ (56px高 / 308px幅)
        xl: 'h-14 w-158 rounded-2xl gap-2 px-2.5', // 最大 (56px高 / 632px幅)

        // --- アイコン専用 (正方形・円形) ---
        icon: 'size-8 rounded-full', // 標準アイコン (32px)
        'icon-xs': 'size-6 rounded-full', // 極小アイコン (24px)
        'icon-sm': 'size-7 rounded-full', // 小さめアイコン (28px)
        'icon-lg': 'size-9 rounded-full', // 大きめアイコン (36px)
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
    compoundVariants: [
      {
        variant: 'secondary',
        size: ['icon', 'icon-xs', 'icon-sm', 'icon-lg'],
        className: 'border-0', // secondaryかつアイコンサイズの場合は枠線を消去
      },
    ],
  },
);

/**
 * 汎用ボタンコンポーネント
 * * @param variant - スタイル（default, outline, ghost等）
 * @param size - サイズ（default, sm, icon等）
 * @param asChild - trueの場合、子要素（Next.jsのLink等）をボタンとしてレンダリングする
 * * @example
 * // 基本
 * <Button variant="accent">クリック</Button>
 * * // アイコンのみ（円形）
 * <Button size="icon"><PlusIcon /></Button>
 * * // リンクとして使用
 * <Button asChild variant="link">
 * <Link href="/home">ホームへ</Link>
 * </Button>
 */
function Button({
  className,
  variant = 'default',
  size = 'default',
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : 'button';

  return (
    <Comp
      data-slot='button'
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
