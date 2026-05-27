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
import { toEventCardViewModel } from './EventCard/eventCard.viewmodel';
import { EventCardList } from './EventCardList';
import { EventCreateDialogContent } from './EventCreateDialogContent';
import { EventEditActionMenu } from './EventEditActionMenu';
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
          className='w-full bg-muted-foreground'
          variant='accent'
          onClick={() => setIsCreateOpen(true)}
          aria-label='予定を作成'
        >
          <Plus />
          予定を作成
        </Button>
      </div>
      <EventCardList
        ariaLabel='MY予定一覧'
        emptyMessage='作成した予定はありません'
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
        <DialogContent showCloseButton={false}>
          {editingEvent && (
            <EventEditActionMenu
              roomId={editingEvent.id}
              onCancel={() => setEditingEvent(null)}
              onDeleted={() => {
                setEditingEvent(null);
                onSuccess?.();
              }}
            />
          )}
          <DialogHeader>
            <DialogTitle>予定を編集</DialogTitle>
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
                onCancel={() => setEditingEvent(null)}
              />
            )}
          </DialogBody>
        </DialogContent>
      </Dialog>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
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
