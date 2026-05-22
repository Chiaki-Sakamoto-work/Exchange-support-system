'use client';

import { PenBoxIcon } from 'lucide-react';
import { useState } from 'react';
import {
  DialogDescription,
  DialogHeader,
  DialogIconAction,
  DialogTitle,
} from '@/components/ui/Dialog';
import { EventDetailDialog } from '../EventDetailDialog';
import { EventEditDialogContent } from '../EventEditDialogContent';

type Props = {
  roomId: number;
  onClose: () => void;
  onSuccess: () => void;
};

export const HostDetailModal = ({ roomId, onClose, onSuccess }: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const onOpenChange = (open: boolean) => {
    if (!open) {
      setIsEditing(false);
    }
  };

  return (
    <>
      {isEditing ? (
        <EventEditDialogContent
          eventData={eventData}
          onSuccess={() => {
            onSuccess();
            setIsEditing(false);
          }}
          onOpenChange={onOpenChange}
        />
      ) : (
        <EventDetailDialog roomId={roomId} onClose={onClose}>
          <DialogHeader className='gap-0.5'>
            <DialogTitle>{eventData.title}</DialogTitle>
            <DialogDescription>イベントの詳細情報</DialogDescription>
            <DialogIconAction
              variant='secondary'
              className='top-6 right-6'
              onClick={() => setIsEditing(true)}
            >
              <PenBoxIcon className='h-5 w-5' />
            </DialogIconAction>
          </DialogHeader>
        </EventDetailDialog>
      )}
    </>
  );
};
