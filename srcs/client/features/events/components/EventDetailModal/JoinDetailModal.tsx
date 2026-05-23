'use client';

import { LogOut } from 'lucide-react';
import { useState } from 'react';
import {
  DialogDescription,
  DialogHeader,
  DialogIconAction,
  DialogTitle,
} from '@/components/ui/Dialog';
import { cancelParticipationAction } from '../../actions/eventActions';
import { EventDetailContent } from '../EventDetailContent';
import { EventDetailDialog } from '../EventDetailDialog';
import { EventDetailLoadingContentSkeleton } from '../EventLoadingSkeleton';
import { ExitEventAlertDialog } from '../ExitEventAlertDialog';

type Props = {
  roomId: number;
  onClose: () => void;
  onSuccess: () => void;
};

export const JoinDetailModal = ({ roomId, onClose, onSuccess }: Props) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLeaveDialogOpen, setIsLeaveDialogOpen] = useState(false);
  const handleLeaveDialogOpenChange = (open: boolean) => {
    setIsLeaveDialogOpen(open);
  };
  const handleExitAction = async () => {
    setIsProcessing(true);
    let result: { success: boolean; error?: string } | undefined;

    result = await cancelParticipationAction(roomId);

    if (result?.success) {
      alert('処理が完了しました！');
      onSuccess();
      onClose();
    } else {
      alert(result?.error || 'エラーが発生しました');
    }
    setIsProcessing(false);
  };

  return (
    <>
      <EventDetailDialog
        roomId={roomId}
        onClose={onClose}
        loadingFallback={<EventDetailLoadingContentSkeleton mode='joined' />}
      >
        {(eventData) => (
          <>
            <JoinEventHeader
              title={eventData.title}
              onLeaveClick={() => setIsLeaveDialogOpen(true)}
            />
            <EventDetailContent eventData={eventData} />
          </>
        )}
      </EventDetailDialog>
      <ExitEventAlertDialog
        isLeaveDialogOpen={isLeaveDialogOpen}
        handleLeaveDialogOpenChange={handleLeaveDialogOpenChange}
        handleConfirmLeave={handleExitAction}
        disabled={isProcessing}
      />
    </>
  );
};

type JoinEventHeaderProps = {
  title: string;
  onLeaveClick: () => void;
};

const JoinEventHeader = ({ title, onLeaveClick }: JoinEventHeaderProps) => (
  <DialogHeader className='gap-0.5'>
    <DialogTitle>{title}</DialogTitle>
    <DialogDescription>イベントの詳細情報</DialogDescription>
    <DialogIconAction
      variant='destructive'
      className='top-6 right-6'
      onClick={onLeaveClick}
    >
      <LogOut className='h-5 w-5' />
    </DialogIconAction>
  </DialogHeader>
);
