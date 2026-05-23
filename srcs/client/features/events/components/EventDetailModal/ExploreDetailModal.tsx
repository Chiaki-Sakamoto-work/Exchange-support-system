'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import {
  DialogDescription,
  DialogHeader,
  DialogIconAction,
  DialogTitle,
} from '@/components/ui/Dialog';
import { joinEventAction } from '../../actions/eventActions';
import { EventDetailContent } from '../EventDetailContent';
import { EventDetailDialog } from '../EventDetailDialog';
import { EventDetailLoadingContentSkeleton } from '../EventLoadingSkeleton';

type Props = {
  roomId: number;
  onClose: () => void;
  onSuccess: () => void;
};

export const ExploreDetailModal = ({ roomId, onClose, onSuccess }: Props) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleJoinAction = async () => {
    setIsProcessing(true);
    try {
      const result = await joinEventAction(roomId);
      if (result.success) {
        toast.success('予定に参加しました！');
        onSuccess(); // リストを更新
        onClose(); // モーダルを閉じる
      } else {
        toast.error(result.error || '参加に失敗しました');
      }
    } catch (_e) {
      toast.error('通信エラーが発生しました');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <EventDetailDialog
      roomId={roomId}
      onClose={onClose}
      loadingFallback={<EventDetailLoadingContentSkeleton mode='explore' />}
    >
      {(eventData) => (
        <>
          <DialogHeader className='gap-0.5'>
            <DialogTitle>{eventData.title}</DialogTitle>
            <DialogDescription>イベントの詳細情報</DialogDescription>
            <DialogIconAction
              variant='default'
              className='top-6 right-6'
              onClick={handleJoinAction}
              size='sm'
              disabled={isProcessing}
              asChild
            >
              <Button>参加</Button>
            </DialogIconAction>
          </DialogHeader>
          <EventDetailContent eventData={eventData} />
        </>
      )}
    </EventDetailDialog>
  );
};
