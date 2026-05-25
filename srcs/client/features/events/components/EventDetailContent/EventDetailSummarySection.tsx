import type { Room } from '@type';
import { Calendar, Store, UsersRound } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { formatDate } from '@/lib/date';

type EventDetailSummarySectionProps = {
  eventData: Room;
};

export const EventDetailSummarySection = ({
  eventData,
}: EventDetailSummarySectionProps) => {
  return (
    <Card
      size='default'
      variant='secondary shadow-none'
      className='min-h-0! overflow-visible! py-2!'
    >
      <CardContent className='flex-none! gap-0'>
        <div className='flex items-center gap-3 border-b border-border py-3'>
          <Store className='size-4' />
          <span>お店</span>
          <span className='ml-auto text-foreground'>
            {eventData.location_address ? (
              <a
                href={eventData.location_address}
                target='_blank'
                rel='noopener noreferrer'
                className='text-accent transition-colors hover:text-accent/70 hover:underline'
              >
                {eventData.location_name}
              </a>
            ) : (
              eventData.location_name || '未定'
            )}
          </span>
        </div>
        <div className='flex items-center gap-3 border-b border-border py-3'>
          <Calendar className='size-4' />
          <span>日時</span>
          <span className='ml-auto text-foreground'>
            {eventData.event_start_at
              ? formatDate(eventData.event_start_at)
              : '未定'}
          </span>
        </div>
        <div className='flex items-center gap-3 py-3'>
          <UsersRound className='size-4' />
          <span>参加人数</span>
          <span className='ml-auto text-foreground'>
            {eventData.user_rooms.length}/{eventData.capacity_limit}人
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
