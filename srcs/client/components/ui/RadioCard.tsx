'use client';

import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import { Check } from 'lucide-react';
import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * RadioCard: カード形式のラジオボタン・アイテム
 * 選択されると枠線が強調され、右側にチェックアイコンが表示されます。
 */
const RadioCard = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, children, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        // 基本スタイル: 固定幅(366px)、高さ(84px)、丸角、カード背景
        'group relative flex w-[366px] h-[84px] cursor-pointer items-center justify-between rounded-[16px] border-2 border-transparent bg-card px-6 py-4 outline-none',

        // インタラクション: ホバーでわずかに拡大、クリックで縮小
        'transition-transform duration-200 ease-in-out hover:scale-[1.02] active:scale-[0.98]',

        // 選択時 (checked): 枠線を表示し、背景色をアクセントカラーの透過色に変更
        'data-[state=checked]:border-accent data-[state=checked]:bg-accent/[5%]',
        className,
      )}
      {...props}
    >
      {/* 左側: コンテンツエリア（タイトルや説明） */}
      <div className='flex flex-1 flex-col justify-center text-left'>
        {children}
      </div>

      {/* 右側: チェックアイコン（選択時のみアニメーションで表示） */}
      <div
        className={cn(
          'ml-4 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground',
          'scale-50 opacity-0', // 初期状態は小さく透明
          'transition-all duration-400 ease-[cubic-bezier(0.34,1.56,0.64,1)]',
          'group-data-[state=checked]:scale-100 group-data-[state=checked]:opacity-100', // 選択時にバウンドしながら出現
        )}
      >
        <Check className='h-4 w-4' />
      </div>
    </RadioGroupPrimitive.Item>
  );
});
RadioCard.displayName = 'RadioCard';

/**
 * RadioCardHeader: タイトルと説明をまとめるラッパー
 */
const RadioCardHeader = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5', className)}
    {...props}
  />
));
RadioCardHeader.displayName = 'RadioCardHeader';

/**
 * RadioCardTitle: カード内の太字タイトル
 */
const RadioCardTitle = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('text-base font-bold leading-snug', className)}
    {...props}
  />
));
RadioCardTitle.displayName = 'RadioCardTitle';

/**
 * RadioCardDescription: カード内の補足説明テキスト
 */
const RadioCardDescription = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
));
RadioCardDescription.displayName = 'RadioCardDescription';

export { RadioCard, RadioCardDescription, RadioCardHeader, RadioCardTitle };
