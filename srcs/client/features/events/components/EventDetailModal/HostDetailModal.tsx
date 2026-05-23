'use client';

import { PenBoxIcon } from 'lucide-react';
import { useState } from 'react';
import {
  DialogDescription,
  DialogHeader,
  DialogIconAction,
  DialogTitle,
} from '@/components/ui/Dialog';
import { EventDetailContent } from '../EventDetailContent';
import { EventDetailDialog } from '../EventDetailDialog';
import { EventEditDialogContent } from '../EventEditDialogContent';
import { EventDetailLoadingContentSkeleton } from '../EventLoadingSkeleton';

type Props = {
  roomId: number;
  onClose: () => void;
  onSuccess: () => void;
};

export const HostDetailModal = ({ roomId, onClose, onSuccess }: Props) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleClose = () => {
    setIsEditing(false);
    onClose();
  };

  return (
    <EventDetailDialog
      roomId={roomId}
      onClose={handleClose}
      loadingFallback={<EventDetailLoadingContentSkeleton mode='hosted' />}
      preventOutsideClose={isEditing}
    >
      {(eventData) =>
        isEditing ? (
          <EventEditDialogContent
            eventData={eventData}
            onSuccess={() => {
              onSuccess();
              setIsEditing(false);
            }}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <>
            <HostEventHeader
              title={eventData.title}
              onEditClick={() => setIsEditing(true)}
            />
            <EventDetailContent eventData={eventData} />
          </>
        )
      }
    </EventDetailDialog>
  );
};

type HostEventHeaderProps = {
  title: string;
  onEditClick: () => void;
};

const HostEventHeader = ({ title, onEditClick }: HostEventHeaderProps) => (
  <DialogHeader className='gap-0.5'>
    <DialogTitle>{title}</DialogTitle>
    <DialogDescription>イベントの詳細情報</DialogDescription>
    <DialogIconAction
      variant='secondary'
      className='top-6 right-6'
      onClick={onEditClick}
    >
      <PenBoxIcon className='h-5 w-5' />
    </DialogIconAction>
  </DialogHeader>
);
