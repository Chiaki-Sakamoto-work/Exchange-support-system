'use client';

import { AlertDialog as AlertDialogPrimitive } from 'radix-ui';
import type * as React from 'react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

/**
 * AlertDialog: 警告・確認ダイアログのルートコンテナ
 * ユーザーに重要な選択（削除の確認など）を求める際に使用します。
 */
function AlertDialog({
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Root>) {
  return <AlertDialogPrimitive.Root data-slot='alert-dialog' {...props} />;
}

/**
 * AlertDialogTrigger: ダイアログを開くためのトリガー（ボタン等）
 */
function AlertDialogTrigger({
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Trigger>) {
  return (
    <AlertDialogPrimitive.Trigger data-slot='alert-dialog-trigger' {...props} />
  );
}

/**
 * AlertDialogPortal: ダイアログをDOMのルートにポータル（転送）するためのラッパー
 */
function AlertDialogPortal({
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Portal>) {
  return (
    <AlertDialogPrimitive.Portal data-slot='alert-dialog-portal' {...props} />
  );
}

/**
 * AlertDialogOverlay: ダイアログ背後の半透明の暗い背景
 */
function AlertDialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Overlay>) {
  return (
    <AlertDialogPrimitive.Overlay
      data-slot='alert-dialog-overlay'
      className={cn(
        'fixed inset-0 z-50 bg-black/10 duration-100 supports-backdrop-filter:backdrop-blur-xs data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0',
        className,
      )}
      {...props}
    />
  );
}

/**
 * AlertDialogIconAction: ダイアログの右上に配置するアイコンボタン用
 */
function AlertDialogIconAction({
  className,
  variant = 'ghost',
  size = 'icon',
  ...props
}: React.ComponentProps<typeof Button>) {
  return (
    <Button
      variant={variant}
      size={size}
      className={cn(
        'absolute top-4 right-4 text-muted-foreground hover:bg-muted hover:text-foreground',
        className,
      )}
      {...props}
    />
  );
}

/**
 * AlertDialogContent: ダイアログのメインパネル
 * @param size - "default" (標準サイズ), "sm" (小さめサイズ)
 */
function AlertDialogContent({
  className,
  size = 'default',
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Content> & {
  size?: 'default' | 'sm';
}) {
  return (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <AlertDialogPrimitive.Content
        data-slot='alert-dialog-content'
        data-size={size}
        className={cn(
          // 画面中央への配置とベーススタイル
          'group/alert-dialog-content fixed top-1/2 left-1/2 z-90 flex flex-col w-full -translate-x-1/2 -translate-y-1/2 gap-0 rounded-2xl bg-popover p-6 text-popover-foreground duration-100 outline-none max-w-[calc(100%-2rem)] max-h-172.5',
          // サイズ別の最大幅指定
          'data-[size=default]:max-w-96 data-[size=sm]:max-w-xs data-[size=default]:sm:max-w-sm',
          // 開閉アニメーション
          'data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95',
          // 立体感を持たせるシャドウ
          'shadow-[inset_0_0_0_1px_rgba(10,14,26,0.08),0_10px_15px_-3px_rgba(10,14,26,0.10),0_4px_6px_-4px_rgba(10,14,26,0.10)]',
          className,
        )}
        {...props}
      />
    </AlertDialogPortal>
  );
}

/**
 * AlertDialogHeader: 上部の見出しエリア（メディア、タイトル、説明文を含む）
 */
function AlertDialogHeader({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='alert-dialog-header'
      className={cn(
        'grid grid-rows-[auto_1fr] place-items-start gap-1.5 text-left',
        // AlertDialogMediaが配置された場合は、レイアウトを自動調整して横並びにします
        'has-data-[slot=alert-dialog-media]:grid-rows-[auto_auto_1fr] has-data-[slot=alert-dialog-media]:gap-x-4 sm:group-data-[size=default]/alert-dialog-content:has-data-[slot=alert-dialog-media]:grid-rows-[auto_1fr]',
        className,
      )}
      {...props}
    />
  );
}

/**
 * AlertDialogBody: 長い文章やコンテンツを入れるための中央エリア（スクロール対応）
 */
function AlertDialogBody({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='alert-dialog-body'
      className={cn(
        'flex flex-1 flex-col gap-4 min-h-0 overflow-y-auto py-4 text-sm text-foreground *:shrink-0',
        'scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-muted-foreground/20',
        className,
      )}
      {...props}
    />
  );
}

/**
 * AlertDialogFooter: 下部のアクションボタン配置エリア
 * スマホサイズではボタンが縦並びになり、PCサイズでは横並びになります。
 */
function AlertDialogFooter({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='alert-dialog-footer'
      className={cn(
        'flex flex-col-reverse sm:flex-row sm:justify-center gap-3 pt-4',
        className,
      )}
      {...props}
    />
  );
}

/**
 * AlertDialogMedia: 警告アイコンなどを強調表示するためのエリア
 */
function AlertDialogMedia({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='alert-dialog-media'
      className={cn(
        "mb-2 inline-flex size-10 items-center justify-center rounded-md bg-muted sm:group-data-[size=default]/alert-dialog-content:row-span-2 *:[svg:not([class*='size-'])]:size-6",
        className,
      )}
      {...props}
    />
  );
}

/**
 * AlertDialogTitle: ダイアログのタイトルテキスト
 */
function AlertDialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Title>) {
  return (
    <AlertDialogPrimitive.Title
      data-slot='alert-dialog-title'
      className={cn(
        'text-base font-medium sm:group-data-[size=default]/alert-dialog-content:group-has-data-[slot=alert-dialog-media]/alert-dialog-content:col-start-2',
        className,
      )}
      {...props}
    />
  );
}

/**
 * AlertDialogDescription: ダイアログの補足説明テキスト
 */
function AlertDialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Description>) {
  return (
    <AlertDialogPrimitive.Description
      data-slot='alert-dialog-description'
      className={cn(
        'text-sm text-balance text-muted-foreground md:text-pretty *:[a]:underline *:[a]:underline-offset-3 *:[a]:hover:text-foreground',
        className,
      )}
      {...props}
    />
  );
}

/**
 * AlertDialogAction: 「実行する」「削除する」などの確定ボタン
 */
function AlertDialogAction({
  className,
  variant = 'default',
  size = 'default',
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Action> &
  Pick<React.ComponentProps<typeof Button>, 'variant' | 'size'>) {
  return (
    <Button variant={variant} size={size} asChild>
      <AlertDialogPrimitive.Action
        data-slot='alert-dialog-action'
        className={cn('max-sm:w-full', className)}
        {...props}
      />
    </Button>
  );
}

/**
 * AlertDialogCancel: 「キャンセル」などの取り消しボタン
 */
function AlertDialogCancel({
  className,
  variant = 'outline',
  size = 'default',
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Cancel> &
  Pick<React.ComponentProps<typeof Button>, 'variant' | 'size'>) {
  return (
    <Button variant={variant} size={size} asChild>
      <AlertDialogPrimitive.Cancel
        data-slot='alert-dialog-cancel'
        className={cn('max-sm:w-full', className)}
        {...props}
      />
    </Button>
  );
}

export {
  AlertDialog,
  AlertDialogAction,
  AlertDialogBody,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogIconAction,
  AlertDialogMedia,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
};
