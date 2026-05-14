'use client';

import { Label as LabelPrimitive } from 'radix-ui';
import type * as React from 'react';

import { cn } from '@/lib/utils';

/**
 * Label: 入力フォームなどのラベルコンポーネント
 * Radix UIのLabelをベースにしており、クリックすると紐付けられた入力欄にフォーカスします。
 * * 特徴:
 * - peer-focus-within: 関連する入力欄がフォーカスされると、ラベルの色がアクセントカラーに変わります。
 * - peer-disabled: 入力欄が無効化されると、ラベルも自動的に薄くなります。
 */
function Label({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot='label'
      className={cn(
        // 基本スタイル: 小さめの文字、太字、選択不可
        'text-muted-foreground flex items-center gap-2 text-sm leading-none font-medium select-none',

        // 状態連動スタイル:
        // 1. 紐付いた要素(peer)が無効な時
        'peer-disabled:text-muted peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
        // 2. 紐付いた要素(peer)または親要素(group)がフォーカスされた時
        'peer-focus-within:text-accent group-focus-within:text-accent',
        // 3. コンポーネント自体が属するグループが無効な時
        'group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50',

        className,
      )}
      {...props}
    />
  );
}

export { Label };
