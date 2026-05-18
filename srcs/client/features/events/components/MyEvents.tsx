'use client';

import { UtensilsCrossed } from 'lucide-react';
import { useState } from 'react';
import type { Room } from '@/app/types';
import { Button } from '@/components/ui/Button';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/Dialog';
import { formatDate } from '@/lib/date';
import { EventCard } from '@feature/events/components/EventCard';
import { EventForm } from './EventForm';

type Props = {
  onSuccess?: () => void;
  events: Room[];
}

const MyEvents = ({ events, onSuccess }: Props) => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Room | null>(null);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <Button
          size="icon-lg"
          variant="outline"
          onClick={() => setIsCreateOpen(true)}
          aria-label="イベントを作成"
        >
          <UtensilsCrossed />
        </Button>
      </div>
      {events.map((event) => {
        const owner = event.user_rooms[0]?.profiles;
        const tags = event.room_tags.map((rt) => ({
          id: rt.tags.id,
          name: rt.tags.name,
        }));

        return (
          <EventCard
            key={event.id}
            title={event.title}
            shop={event.location_name ?? '未定'}
            date={formatDate(event.event_start_at)}
            tags={tags}
            participants={`${event._count.user_rooms}/${event.capacity_limit}`}
            ownerProfile={{
              name: owner?.username ?? '未定',
              image: owner?.avatar_url ?? undefined
            }}
            onClick={() => setEditingEvent(event)}
          />
        );
      })}
        <Dialog open={editingEvent !== null} onOpenChange={() => setEditingEvent(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>イベントを編集</DialogTitle>
              <DialogDescription>内容を更新できます</DialogDescription>
            </DialogHeader>
            <DialogBody>
              {editingEvent && (
                  <EventForm
                    roomId={editingEvent.id}
                    initialData={editingEvent}
                    onSuccess={() => setEditingEvent(null)}
                  />
                )}
            </DialogBody>
          </DialogContent>
        </Dialog>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>イベントを作成</DialogTitle>
            <DialogDescription>新しいイベントの情報を入力してください</DialogDescription>
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
}

export { MyEvents };

