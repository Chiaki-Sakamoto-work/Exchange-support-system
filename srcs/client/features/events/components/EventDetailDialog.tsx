'use client';

import type { Room } from '@type';
import { type ReactNode, useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/Dialog';
import { getEventDetail } from '@/features/events/actions/eventActions';

type EventDetailDialogProps = {
  roomId: number;
  onClose: () => void;
  loadingFallback: ReactNode;
  preventOutsideClose?: boolean;
  children: (eventData: Room) => ReactNode;
};

export const EventDetailDialog = ({
  roomId,
  onClose,
  loadingFallback,
  preventOutsideClose = false,
  children,
}: EventDetailDialogProps) => {
  const [eventData, setEventData] = useState<Room>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(true);

  useEffect(() => {
    let isActive = true;

    async function loadDetail() {
      setIsLoading(true);
      setError(null);

      const result = await getEventDetail(roomId);
      if (!isActive) {
        return;
      }

      if (result.success && result.room) {
        setEventData(result.room);
      } else {
        setError(result.error || 'エラーが発生しました');
      }
      setIsLoading(false);
    }

    loadDetail();

    return () => {
      isActive = false;
    };
  }, [roomId]);

  const handleOpenChange = (open: boolean) => {
    setIsDetailDialogOpen(open);
    if (!open) {
      onClose();
    }
  };

  if (isLoading) {
    return (
      <Dialog open={isDetailDialogOpen} onOpenChange={handleOpenChange}>
        <DialogContent
          showCloseButton={false}
          className='-mx-6 max-h-[80vh] px-6'
        >
          {loadingFallback}
        </DialogContent>
      </Dialog>
    );
  }

  if (error || !eventData) {
    return (
      <Dialog open={isDetailDialogOpen} onOpenChange={handleOpenChange}>
        <DialogContent className='-mx-6 max-h-[80vh] px-6'>
          <DialogHeader>
            <DialogTitle>予定詳細を読み込めません</DialogTitle>
            <DialogDescription>
              {error || 'データの取得に失敗しました'}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isDetailDialogOpen} onOpenChange={handleOpenChange}>
      <DialogContent
        preventOutsideClose={preventOutsideClose}
        showCloseButton={false}
        className='-mx-6 max-h-[80vh] px-6'
      >
        {children(eventData)}
      </DialogContent>
    </Dialog>
  );
};
