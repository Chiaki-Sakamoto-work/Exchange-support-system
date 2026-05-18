'use client';

import { XIcon } from 'lucide-react';
import { Dialog as DialogPrimitive } from 'radix-ui';
import type * as React from 'react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

/**
 * Dialog: モーダルのルートコンテナ
 */
function Dialog({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot='dialog' {...props} />;
}

/**
 * DialogTrigger: モーダルを開くためのボタンや要素
 */
function DialogTrigger({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot='dialog-trigger' {...props} />;
}

/**
 * DialogPortal: モーダルを DOM のルート（通常は body）に転送するコンポーネント
 */
function DialogPortal({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot='dialog-portal' {...props} />;
}

/**
 * DialogClose: モーダルを閉じるためのボタン（トリガー）
 */
function DialogClose({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot='dialog-close' {...props} />;
}

/**
 * DialogOverlay: モーダル背後の半透明の背景（オーバーレイ）
 */
function DialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot='dialog-overlay'
      className={cn(
        'fixed inset-0 isolate z-50 bg-black/10 duration-100 supports-backdrop-filter:backdrop-blur-xs data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0',
        className,
      )}
      {...props}
    />
  );
}

/**
 * DialogContent: モーダルの本体
 * @param showCloseButton - 右上の「✕」ボタンを表示するかどうか
 */
function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
  showCloseButton?: boolean;
}) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        data-slot='dialog-content'
        className={cn(
          // 配置とサイズ
          'fixed top-1/2 left-1/2 z-50 flex flex-col w-full max-w-[calc(100%-2rem)] sm:max-w-md -translate-x-1/2 -translate-y-1/2',
          'max-h-172.5 rounded-[16px] bg-popover p-6 text-sm text-popover-foreground',
          // スタイル（枠線・影）
          'ring-1 ring-inset ring-foreground/[8%] shadow-[0px_5.89px_17.66px] shadow-foreground/[8%]',
          // アニメーション
          'duration-100 outline-none data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95',
          className,
        )}
        {...props}
      >
        {children}
        {/* 右上の閉じるボタン */}
        {showCloseButton && (
          <DialogPrimitive.Close data-slot='dialog-close' asChild>
            <Button
              variant='ghost'
              className='absolute top-3 right-3 text-muted-foreground hover:text-foreground'
              size='icon-sm'
            >
              <XIcon />
              <span className='sr-only'>Close</span>
            </Button>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  );
}

/**
 * DialogHeader: モーダル上部のヘッダーエリア
 */
function DialogHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='dialog-header'
      className={cn('flex flex-col gap-2 text-left', className)}
      {...props}
    />
  );
}

/**
 * DialogFooter: モーダル下部のアクションエリア（ボタンなど）
 * @param showCloseButton - デフォルトの「キャンセル」ボタンを表示するかどうか
 */
function DialogFooter({
  className,
  showCloseButton = false,
  children,
  ...props
}: React.ComponentProps<'div'> & {
  showCloseButton?: boolean;
}) {
  return (
    <div
      data-slot='dialog-footer'
      className={cn('flex flex-col gap-3 pt-4 w-full *:w-full', className)}
      {...props}
    >
      {children}
      {showCloseButton && (
        <DialogPrimitive.Close asChild>
          <Button
            data-slot='dialog-cancel'
            variant='outline'
            size='default'
            className={cn(className)}
          >
            キャンセル
          </Button>
        </DialogPrimitive.Close>
      )}
    </div>
  );
}

/**
 * DialogTitle: モーダルのタイトル（アクセシビリティに必須）
 */
function DialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot='dialog-title'
      className={cn('text-base leading-none font-medium', className)}
      {...props}
    />
  );
}

/**
 * DialogDescription: モーダルの説明文
 */
function DialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot='dialog-description'
      className={cn(
        'text-sm text-muted-foreground *:[a]:underline *:[a]:underline-offset-3 *:[a]:hover:text-foreground',
        className,
      )}
      {...props}
    />
  );
}

/**
 * DialogBody: モーダル中央のコンテンツエリア
 * 内容が長い場合にスクロール可能になります。
 */
function DialogBody({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='dialog-body'
      className={cn(
        'flex-1 overflow-y-auto py-4 text-sm text-foreground',
        'scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-muted-foreground/20',
        className,
      )}
      {...props}
    />
  );
}

/**
 * DialogAction: モーダル内の「実行」ボタン用
 */
function DialogAction({
  className,
  variant = 'default',
  size = 'default',
  ...props
}: React.ComponentProps<typeof Button>) {
  return (
    <Button
      data-slot='dialog-action'
      variant={variant}
      size={size}
      className={cn('max-sm:w-full', className)}
      {...props}
    />
  );
}

/**
 * DialogCancel: モーダル内の「キャンセル」ボタン用
 * 自動的にモーダルを閉じる挙動が含まれます。
 */
function DialogCancel({
  className,
  variant = 'outline',
  size = 'default',
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Close> &
  Pick<React.ComponentProps<typeof Button>, 'variant' | 'size'>) {
  return (
    <DialogPrimitive.Close asChild>
      <Button
        data-slot='dialog-cancel'
        variant={variant}
        size={size}
        className={cn('max-sm:w-full', className)}
        {...props}
      />
    </DialogPrimitive.Close>
  );
}

/**
 * DialogIconAction: 特定のアイコンアクション用（絶対配置）
 */
function DialogIconAction({
  className,
  variant = 'ghost',
  size = 'icon',
  ...props
}: React.ComponentProps<typeof Button>) {
  return (
    <Button
      variant={variant}
      size={size}
      className={cn('absolute top-4 right-4', className)}
      {...props}
    />
  );
}

export {
  Dialog,
  DialogAction,
  DialogBody,
  DialogCancel,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogIconAction,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};
