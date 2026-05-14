'use client';

import { RadioGroup as RadioGroupPrimitive } from 'radix-ui';
import type * as React from 'react';

import { cn } from '@/lib/utils';

/**
 * RadioGroup: ラジオボタンのグループをまとめるコンテナ
 * フォーム内での一貫した挙動と、アイテム間の余白を管理します。
 */
function RadioGroup({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return (
    <RadioGroupPrimitive.Root
      data-slot='radio-group'
      className={cn('flex flex-col gap-3 grid w-full', className)}
      {...props}
    />
  );
}

/**
 * RadioGroupItem: 個別のラジオボタン（円形ボタン）
 * 選択状態、未選択状態、フォーカス状態、無効状態のスタイルを網羅しています。
 */
function RadioGroupItem({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      data-slot='radio-group-item'
      className={cn(
        // 基本スタイル: 正円、ボーダー、アウトラインの制御
        'group/radio-group-item peer relative flex aspect-square size-4 shrink-0 rounded-full border border-input outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50',

        // ヒットエリアの拡大: after要素を使って、見た目よりもクリックしやすい範囲を広げています
        'after:absolute after:-inset-x-3 after:-inset-y-2',

        // バリデーションエラー状態 (aria-invalid)
        'aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 aria-invalid:aria-checked:border-primary dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40',

        // 選択済み状態 (data-checked)
        'data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground dark:data-checked:bg-primary',

        className,
      )}
      {...props}
    >
      {/* RadioGroupPrimitive.Indicator: 選択されたときに表示される中の「点」 */}
      <RadioGroupPrimitive.Indicator
        data-slot='radio-group-indicator'
        className='flex size-4 items-center justify-center'
      >
        <span className='absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-foreground' />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
}

export { RadioGroup, RadioGroupItem };
