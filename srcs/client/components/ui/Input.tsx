'use client';

import type * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * InputProps: Inputコンポーネントのプロパティ
 * 標準の input 要素の属性に加え、オプションでアイコンを受け取ります。
 */
export interface InputProps extends React.ComponentProps<'input'> {
  /**
   * 入力欄の左側に表示するアイコン (Lucideアイコンなど)
   */
  icon?: React.ReactNode;
}

/**
 * Input: 汎用テキスト入力コンポーネント
 * * 特徴:
 * - アイコンの自動配置: iconプロパティを渡すと、テキストが重ならないよう自動で余白が調整されます。
 * - 状態別のスタイル: フォーカス、無効化(disabled)、エラー(aria-invalid)時の見た目が定義されています。
 * - 以前作成した Label との連動用として `peer` クラスが付与されています。
 */
function Input({ className, type, icon, ...props }: InputProps) {
  return (
    <div className={cn('relative w-full peer', className)}>
      {/* アイコンがある場合、入力欄の左側に絶対配置で表示 */}
      {icon && (
        <div className='absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none'>
          {icon}
        </div>
      )}
      <input
        type={type}
        data-slot='input'
        className={cn(
          // 基本スタイル: 高さ48px、角丸14px、背景白、枠線など
          'h-12 w-full min-w-0 rounded-[14px] border border-input bg-white px-2.5 py-1 text-base transition-colors outline-none placeholder:text-muted-foreground md:text-sm',

          // ファイル入力時のスタイル
          'file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground',

          // フォーカス時のリング表示
          'focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50',

          // 無効化状態 (disabled)
          'disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50',

          // バリデーションエラー状態 (aria-invalid="true" のとき)
          'aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40',

          // ダークモード
          'dark:bg-input/30 dark:disabled:bg-input/80',

          // アイコンがある場合は左側にパディング(pl-10)を追加して、文字が重ならないようにする
          icon && 'pl-10',

          className,
        )}
        {...props}
      />
    </div>
  );
}

export { Input };
