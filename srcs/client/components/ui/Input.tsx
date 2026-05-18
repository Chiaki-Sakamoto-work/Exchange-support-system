'use client';

import type * as React from 'react';
import { cn } from '@/lib/utils';
import { Button } from './Button'; // button.tsxのパスに合わせて調整してください

/**
 * InputProps: Inputコンポーネントのプロパティ
 * 標準の input 要素の属性に加え、オプションで左側アイコンと右側ボタンのプロパティを受け取ります。
 */
export interface InputProps extends React.ComponentProps<'input'> {
  /**
   * 入力欄の左側に表示するアイコン (Lucideアイコンなど)
   */
  icon?: React.ReactNode;
  /**
   * 入力欄の右側に表示するボタンのテキストまたは要素
   */
  buttonText?: React.ReactNode;
  /**
   * 右側ボタンのプロパティ (onClick, className, variant, size など)
   */
  buttonProps?: React.ComponentProps<typeof Button>;
}

/**
 * Input: 汎用テキスト入力コンポーネント
 * * 特徴:
 * - アイコン・ボタンの自動配置: iconやbuttonTextを渡すと、テキストが重ならないよう自動で左右の余白が調整されます。
 * - 状態別のスタイル: フォーカス、無効化(disabled)、エラー(aria-invalid)時の見た目が定義されています。
 * - 以前作成した Label との連動用として `peer` クラスが付与されています。
 */
function Input({
  className,
  type,
  icon,
  buttonText,
  buttonProps,
  ...props
}: InputProps) {
  // buttonProps から className を分離し、残りを buttonRestProps とする
  const { className: buttonClassName, ...buttonRestProps } = buttonProps || {};

  return (
    <div
      className={cn('relative union flex items-center w-full peer', className)}
    >
      {/* アイコンがある場合、入力欄の左側に絶対配置で表示 */}
      {icon && (
        <div className='absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none z-10'>
          {icon}
        </div>
      )}

      <input
        type={type}
        data-slot='input'
        className={cn(
          // 基本スタイル: 高さ48px、角丸14px、背景白、枠線など
          'h-12 w-full min-w-0 rounded-[14px] border border-input bg-white px-2.5 py-1 text-base transition-colors outline-none placeholder:text-muted-foreground md:text-sm',
          'hover:border-accent',
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

          // ボタンがある場合は右側にパディングを追加（標準サイズのボタンを想定して広めに設定）
          buttonText && 'pr-24',

          className,
        )}
        {...props}
      />

      {/* ボタンがある場合、入力欄の右側に絶対配置で表示 */}
      {buttonText && (
        <div className='absolute right-1.5 top-1/2 -translate-y-1/2 z-10'>
          <Button
            className={cn('h-9 w-auto px-4', buttonClassName)}
            {...buttonRestProps}
          >
            {buttonText}
          </Button>
        </div>
      )}
    </div>
  );
}

export { Input };
