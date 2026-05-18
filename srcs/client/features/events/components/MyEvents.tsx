'use client';

import type { Room } from '@/app/types';
import { EventCard } from '@feature/events/components/EventCard';

type Props = {
  onSuccess: () => void;
  events: Room[];
}

const MyEvents = ({ events }: Props) => {
  return (
    <div className="flex flex-col gap-4">
      {events.map((event) => (
        <EventCard
          key={evnet.id}
          title={event.title}
        />
      ))}
    </div>
  );
}

export { MyEvents };

