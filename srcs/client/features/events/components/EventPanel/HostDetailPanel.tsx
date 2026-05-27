'use client';

import { EventDetailContent } from '@feature/events/components/EventDetailContent';
import { EventDetailPanelSkeleton } from '@feature/events/components/EventDetailModalSkeleton';
import { EventEditActionMenu } from '@feature/events/components/EventEditActionMenu';
import { useEventDetail } from '@feature/events/hooks/useEventDetail';
import { PenBoxIcon } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { EventEditPanel } from './EventEditPanel';

type Props = {
  roomId: number;
  onClose: () => void;
  onSuccess: () => void;
};

type EventDetailHeaderProps = {
  title: string;
  onEditClick: () => void;
};

const EventDetailHeader = ({ title, onEditClick }: EventDetailHeaderProps) => (
  <div className='flex flex-col gap-1 pr-12'>
    <h2 className='text-2xl font-bold text-zinc-900 tracking-tight'>{title}</h2>
    <p className='text-sm text-zinc-500'>予定の詳細情報</p>
    <div className='absolute top-0 right-0'>
      <Button variant='secondary' size='icon' onClick={onEditClick}>
        <PenBoxIcon className='h-5 w-5' />
      </Button>
    </div>
  </div>
);

export const HostDetailPanel = ({ roomId, onClose, onSuccess }: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const { eventData, isLoading, error } = useEventDetail(roomId);

  if (isLoading) {
    return <EventDetailPanelSkeleton mode='hosted' />;
  }

  if (error || !eventData) {
    return (
      <div className='text-red-500 bg-red-50 p-4 rounded-xl text-center font-medium'>
        {error || 'データの取得に失敗しました'}
      </div>
    );
  }

  if (isEditing) {
    return (
      <>
        <EventEditActionMenu
          roomId={roomId}
          onCancel={() => setIsEditing(false)}
          onDeleted={() => {
            onSuccess();
            onClose();
          }}
        />
        <EventEditPanel
          eventData={eventData}
          onCancel={() => setIsEditing(false)}
          onSuccess={() => {
            onSuccess();
            setIsEditing(false);
          }}
        />
      </>
    );
  }

  return (
    <div className='h-full flex flex-col gap-6 overflow-y-auto pr-1 relative'>
      <EventDetailHeader
        title={eventData.title}
        onEditClick={() => setIsEditing(true)}
      />
      <EventDetailContent eventData={eventData} />
    </div>
  );
};
