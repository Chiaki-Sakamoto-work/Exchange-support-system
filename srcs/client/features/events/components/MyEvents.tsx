'use client';

import type { Room } from '@type';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/Dialog';
import { EventCard } from '@/features/events/components/EventCard/EventCard';
import { toEventCardViewModel } from './EventCard/EventCard.viewmodel';
import { EventCardList } from './EventCardList';
import { EventForm } from './EventForm';

type Props = {
  onSuccess?: () => void;
  events: Room[];
};

const MyEvents = ({ events, onSuccess }: Props) => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Room | null>(null);

  return (
    <div className='flex h-full min-h-0 flex-col gap-4'>
      <div className='flex shrink-0 justify-end'>
        <Button
          type='submit'
          className='w-full bg-gray-400'
          variant='accent'
          onClick={() => setIsCreateOpen(true)}
          aria-label='イベントを作成'
        >
          <Plus />
          イベントを作成
        </Button>
      </div>
      <EventCardList
        ariaLabel='MYイベント一覧'
        emptyMessage='作成したイベントはありません'
        isEmpty={events.length === 0}
      >
        {events.map((event) => {
          return (
            <EventCard
              key={event.id}
              event={toEventCardViewModel(event)}
              onClick={() => setEditingEvent(event)}
              icon='edit'
            />
          );
        })}
      </EventCardList>
      <Dialog
        open={editingEvent !== null}
        onOpenChange={() => setEditingEvent(null)}
      >
        <DialogContent preventOutsideClose>
          <DialogHeader>
            <DialogTitle>イベントを編集</DialogTitle>
            <DialogDescription>内容を更新できます</DialogDescription>
          </DialogHeader>
          <DialogBody className='-mx-6 px-6'>
            {editingEvent && (
              <EventForm
                roomId={editingEvent.id}
                initialData={editingEvent}
                onSuccess={() => {
                  setEditingEvent(null);
                  onSuccess?.();
                }}
              />
            )}
          </DialogBody>
        </DialogContent>
      </Dialog>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent preventOutsideClose>
          <DialogHeader>
            <DialogTitle>イベントを作成</DialogTitle>
            <DialogDescription>
              新しいイベントの情報を入力してください
            </DialogDescription>
          </DialogHeader>
          <DialogBody>
            <EventForm
              onSuccess={() => {
                setIsCreateOpen(false);
                onSuccess?.();
              }}
            />
          </DialogBody>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export { MyEvents };
