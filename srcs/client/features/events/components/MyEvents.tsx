'use client';

import type { Room } from '@type';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Dialog, DialogContent } from '@/components/ui/Dialog';
import { EventCard, toEventCardViewModel } from './EventCard';
import { EventCardList } from './EventCardList';
import { EventCreateDialogContent } from './EventCreateDialogContent';
import { EventEditDialogContent } from './EventEditDialogContent';

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
          {editingEvent && (
            <EventEditDialogContent
              eventData={editingEvent}
              onCancel={() => setEditingEvent(null)}
              onSuccess={() => {
                setEditingEvent(null);
                onSuccess?.();
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent preventOutsideClose>
          <EventCreateDialogContent
            onSuccess={() => {
              setIsCreateOpen(false);
              onSuccess?.();
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export { MyEvents };
