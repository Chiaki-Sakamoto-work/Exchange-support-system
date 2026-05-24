import type { Room } from '@type';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { EventCard, toEventCardViewModel } from './EventCard';
import { EventCardList } from './EventCardList';
import { EventListLoadingSkeleton } from './EventLoadingSkeleton';

export type EventHomeModalMode = 'hosted' | 'joined' | 'explore';
export type JoinedEventsFilter = 'all' | 'hosted' | 'joined';

type ExploreEventsPanelProps = {
  events: Room[];
  isLoading: boolean;
  onSelectRoom: (roomId: number, mode: EventHomeModalMode) => void;
};

type JoinedEventsPanelProps = {
  filter: JoinedEventsFilter;
  hostedRooms: Room[];
  isLoading: boolean;
  joinedRooms: Room[];
  onFilterChange: (filter: JoinedEventsFilter) => void;
  onSelectRoom: (roomId: number, mode: EventHomeModalMode) => void;
};

const sortByDate = (rooms: Room[]) => {
  return [...rooms].sort((a, b) => {
    const timeA = a.event_start_at ? new Date(a.event_start_at).getTime() : 0;
    const timeB = b.event_start_at ? new Date(b.event_start_at).getTime() : 0;
    return timeA - timeB;
  });
};

const getJoinedDisplayRooms = ({
  filter,
  hostedRooms,
  joinedRooms,
}: Pick<JoinedEventsPanelProps, 'filter' | 'hostedRooms' | 'joinedRooms'>) => {
  const sortedHosted = sortByDate(hostedRooms);
  const sortedJoined = sortByDate(joinedRooms);

  if (filter === 'hosted') {
    return sortedHosted;
  }

  if (filter === 'joined') {
    return sortedJoined;
  }

  return sortByDate([...hostedRooms, ...joinedRooms]);
};

const getJoinedEmptyMessage = (filter: JoinedEventsFilter) => {
  if (filter === 'hosted') {
    return '主催した予定はありません';
  }

  if (filter === 'joined') {
    return '他人が開催した予定はありません';
  }

  return '参加予定のイベントはありません';
};

export const ExploreEventsPanel = ({
  events,
  isLoading,
  onSelectRoom,
}: ExploreEventsPanelProps) => {
  return (
    <EventCardList
      ariaLabel='募集中イベント一覧'
      emptyMessage='現在、参加できる新しい予定はありません'
      isEmpty={events.length === 0}
      isLoading={isLoading}
      loadingFallback={<EventListLoadingSkeleton />}
      className='pt-2'
    >
      {events.map((room) => {
        return (
          <EventCard
            key={room.id}
            event={toEventCardViewModel(room)}
            onClick={() => onSelectRoom(room.id, 'explore')}
          />
        );
      })}
    </EventCardList>
  );
};

export const JoinedEventsPanel = ({
  filter,
  hostedRooms,
  isLoading,
  joinedRooms,
  onFilterChange,
  onSelectRoom,
}: JoinedEventsPanelProps) => {
  const displayRooms = getJoinedDisplayRooms({
    filter,
    hostedRooms,
    joinedRooms,
  });
  const emptyMessage = getJoinedEmptyMessage(filter);

  return (
    <>
      {!isLoading && (
        <div className='z-10 flex shrink-0 justify-center bg-background pt-2 pb-2'>
          <Tabs
            value={filter}
            onValueChange={(value) =>
              onFilterChange(value as JoinedEventsFilter)
            }
          >
            <TabsList className='grid grid-cols-3 w-64 h-9 bg-muted p-1 rounded-full'>
              <TabsTrigger value='all' className='text-xs rounded-full'>
                全て
              </TabsTrigger>
              <TabsTrigger value='hosted' className='text-xs rounded-full'>
                主催
              </TabsTrigger>
              <TabsTrigger value='joined' className='text-xs rounded-full'>
                他催
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      )}

      <EventCardList
        ariaLabel='参加予定イベント一覧'
        emptyMessage={emptyMessage}
        isEmpty={displayRooms.length === 0}
        isLoading={isLoading}
        loadingFallback={<EventListLoadingSkeleton />}
        className='pt-2'
      >
        {displayRooms.map((room) => {
          const isMyHosted = hostedRooms.some(
            (hosted) => hosted.id === room.id,
          );
          return (
            <EventCard
              key={room.id}
              event={toEventCardViewModel(room)}
              onClick={() =>
                onSelectRoom(room.id, isMyHosted ? 'hosted' : 'joined')
              }
            />
          );
        })}
      </EventCardList>
    </>
  );
};
