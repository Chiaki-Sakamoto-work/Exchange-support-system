'use client';

import { joinEventAction } from '@feature/events/actions/eventActions';
import { EventDetailContent } from '@feature/events/components/EventDetailContent';
import { EventDetailPanelSkeleton } from '@feature/events/components/EventDetailModalSkeleton';
import { useCurrentUser } from '@feature/events/hooks/useCurrentUser';
import { useEventDetail } from '@feature/events/hooks/useEventDetail';
import { LogIn } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';

type Props = {
  roomId: number;
  onClose: () => void;
  onSuccess: () => void;
};

export const ExploreDetailPanel = ({ roomId, onClose, onSuccess }: Props) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { eventData, isLoading, error } = useEventDetail(roomId);
  const { currentUserId } = useCurrentUser();

  if (isLoading) {
    return <EventDetailPanelSkeleton mode='explore' />;
  }

  if (error || !eventData) {
    return (
      <div className='text-red-500 bg-red-50 p-4 rounded-xl text-center font-medium'>
        {error || 'データの取得に失敗しました'}
      </div>
    );
  }

  const handleJoinAction = async () => {
    setIsProcessing(true);
    try {
      const result = await joinEventAction(roomId);
      if (result.success) {
        toast.success('予定に参加しました！');
        onSuccess();
        onClose();
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
    <div className='h-full flex flex-col gap-6 overflow-y-auto pr-1 relative'>
      <div className='flex flex-col gap-1 pr-12'>
        <h2 className='text-2xl font-bold text-zinc-900 tracking-tight'>
          {eventData.title}
        </h2>
        <p className='text-sm text-zinc-500'>予定の詳細情報</p>
        <div className='absolute top-0 right-0'>
          <Button
            variant='default'
            onClick={handleJoinAction}
            disabled={isProcessing}
            size='sm'
          >
            <LogIn className='size-4' />
            <span>参加</span>
          </Button>
        </div>
      </div>
      <EventDetailContent
        eventData={eventData}
        currentUserId={currentUserId ?? undefined}
      />
    </div>
  );
};
