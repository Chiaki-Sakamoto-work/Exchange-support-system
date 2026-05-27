'use client';

import { Ellipsis } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { deleteEventAction } from '../actions/eventActions';
import { DeleteEventAlertDialog } from './DeleteEventAlertDialog';

type EventEditActionMenuProps = {
  roomId: number;
  onDeleted: () => void;
  onCancel: () => void;
  className?: string;
};

export const EventEditActionMenu = ({
  roomId,
  onDeleted,
  onCancel,
  className,
}: EventEditActionMenuProps) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!isMenuOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMenuOpen]);

  const handleDelete = async () => {
    setIsProcessing(true);
    const result = await deleteEventAction(roomId, '/create');

    if (result?.success) {
      toast.success('予定を削除しました');
      setIsDeleteDialogOpen(false);
      setIsProcessing(false);
      onDeleted();
      return;
    } else {
      toast.error(result?.error || '削除に失敗しました');
    }

    setIsProcessing(false);
  };

  return (
    <div ref={menuRef} className={cn('absolute top-3 right-3 z-10', className)}>
      <Button
        type='button'
        variant='ghost'
        size='icon-sm'
        className='text-muted-foreground hover:text-foreground'
        aria-label='編集メニューを開く'
        aria-haspopup='menu'
        aria-expanded={isMenuOpen}
        onClick={() => setIsMenuOpen((open) => !open)}
      >
        <Ellipsis />
      </Button>

      {isMenuOpen && (
        <div
          role='menu'
          className='absolute top-9 right-0 flex w-32 flex-col gap-1 rounded-xl border border-border bg-popover p-1 shadow-md'
        >
          <Button
            type='button'
            role='menuitem'
            variant='ghost'
            size='sm'
            className='w-full justify-start rounded-lg'
            onClick={() => {
              setIsMenuOpen(false);
              onCancel();
            }}
          >
            キャンセル
          </Button>
          <Button
            type='button'
            role='menuitem'
            variant='ghost'
            size='sm'
            className='w-full justify-start rounded-lg text-destructive hover:bg-destructive/10 hover:text-destructive'
            onClick={() => {
              setIsMenuOpen(false);
              setIsDeleteDialogOpen(true);
            }}
          >
            削除する
          </Button>
        </div>
      )}

      <DeleteEventAlertDialog
        isDeleteDialogOpen={isDeleteDialogOpen}
        handleDeleteDialogOpenChange={setIsDeleteDialogOpen}
        handleConfirmDelete={handleDelete}
        disabled={isProcessing}
      />
    </div>
  );
};
