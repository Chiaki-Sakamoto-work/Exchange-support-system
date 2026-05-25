'use client';

import { cancelParticipationAction } from '@feature/events/actions/eventActions';
import { EventDetailContent } from '@feature/events/components/EventDetailContent';
import { EventDetailPanelSkeleton } from '@feature/events/components/EventDetailModalSkeleton';
import { ExitEventAlertDialog } from '@feature/events/components/ExitEventAlertDialog';
import { useEventDetail } from '@feature/events/hooks/useEventDetail';
import { LogOut } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';

type Props = {
  roomId: number;
  onClose: () => void;
  onSuccess: () => void;
};

type JoinedDetailHeaderProps = {
  title: string;
  onLeaveClick: () => void;
  isProcessing: boolean;
};

const JoinedDetailHeader = ({
  title,
  onLeaveClick,
  isProcessing,
}: JoinedDetailHeaderProps) => (
  <div className='flex flex-col gap-1 pr-12'>
    <h2 className='text-2xl font-bold text-zinc-900 tracking-tight'>{title}</h2>
    <p className='text-sm text-zinc-500'>イベントの詳細情報</p>
    <div className='absolute top-0 right-0'>
      <Button
        variant='destructive'
        size='icon'
        onClick={onLeaveClick}
        disabled={isProcessing}
      >
        <LogOut className='h-5 w-5' />
      </Button>
    </div>
  </div>
);

export const JoinedDetailPanel = ({ roomId, onClose, onSuccess }: Props) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { eventData, isLoading, error } = useEventDetail(roomId);
  const [isLeaveDialogOpen, setIsLeaveDialogOpen] = useState(false);
  const handleExitAction = async () => {
    setIsProcessing(true);
    const result = await cancelParticipationAction(roomId);
    if (result?.success) {
      toast.success('辞退が完了しました');
      onSuccess();
      onClose();
    } else {
      toast.error(result?.error || 'エラーが発生しました');
    }
    setIsProcessing(false);
  };

  if (isLoading) {
    return <EventDetailPanelSkeleton mode='joined' />;
  }

  if (error || !eventData) {
    return (
      <div className='text-red-500 bg-red-50 p-4 rounded-xl text-center font-medium'>
        {error || 'データの取得に失敗しました'}
      </div>
    );
  }

  return (
    <>
      <div className='h-full flex flex-col gap-6 overflow-y-auto pr-1 relative'>
        <JoinedDetailHeader
          title={eventData.title}
          onLeaveClick={() => setIsLeaveDialogOpen(true)}
          isProcessing={isProcessing}
        />
        <EventDetailContent eventData={eventData} />
      </div>

      <ExitEventAlertDialog
        isLeaveDialogOpen={isLeaveDialogOpen}
        handleLeaveDialogOpenChange={(open) => setIsLeaveDialogOpen(open)}
        handleConfirmLeave={handleExitAction}
        disabled={isProcessing}
      />
    </>
  );
};
