'use client';

import { RoomInteractiveOverlay } from '@feature/events/components/RoomInteractiveOverlay';
import type { Room } from '@type';
import { useCallback, useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import {
  getExploreEvents,
  getHostedEvents,
  getJoinedEvents,
} from '../actions/eventActions';
import { EventCard } from './EventCard/EventCard';
import { toEventCardViewModel } from './EventCard/eventCard.viewmodel';
import { EventCardList } from './EventCardList';
import { EventListLoadingSkeleton } from './EventLoadingSkeleton';
import { createClient } from '@/lib/supabase/client';

export const EventHome = () => {
  type TabMode = 'explore' | 'joined';
  type FilterMode = 'all' | 'hosted' | 'joined';
  const [subTab, setSubTab] = useState<TabMode>('explore');
  const [filter, setFilter] = useState<FilterMode>('all');
  const [exploreEvents, setExploreEvents] = useState<Room[]>([]);
  const [hostedRooms, setHostedRooms] = useState<Room[]>([]);
  const [joinedRooms, setJoinedRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);
  const [modalMode, setModalMode] = useState<'hosted' | 'joined' | 'explore'>(
    'explore',
  );
  const fetchAllData = useCallback(async () => {
    if (exploreEvents.length === 0 && hostedRooms.length === 0) {
      setIsLoading(true);
    }
    try {
      const [hosted, joined, exploreRes] = await Promise.all([
        getHostedEvents(),
        getJoinedEvents(),
        getExploreEvents(),
      ]);
      setHostedRooms(hosted || []);
      setJoinedRooms(joined || []);
      if (exploreRes.success) {
        setExploreEvents(exploreRes.events || []);
      }
    } catch (error) {
      console.error('データ取得エラー:', error);
    } finally {
      setIsLoading(false);
    }
  }, [exploreEvents.length, hostedRooms.length]);

  useEffect(() => {
    fetchAllData();

    const supabase = createClient();
    const channel = supabase
      .channel('event-home-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'user_rooms' },
        () => {
          console.log('入退室を検知しました。リストを更新します。');
          fetchAllData();
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'rooms' },
        () => {
          console.log('イベントの変更を検知しました。リストを更新します。');
          fetchAllData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchAllData]);

  const sortByDate = (rooms: Room[]) => {
    return [...rooms].sort((a, b) => {
      const timeA = a.event_start_at ? new Date(a.event_start_at).getTime() : 0;
      const timeB = b.event_start_at ? new Date(b.event_start_at).getTime() : 0;
      return timeA - timeB;
    });
  };

  const sortedHosted = sortByDate(hostedRooms);
  const sortedJoined = sortByDate(joinedRooms);
  const sortedAll = sortByDate([...hostedRooms, ...joinedRooms]);

  const displayRooms =
    filter === 'hosted'
      ? sortedHosted
      : filter === 'joined'
        ? sortedJoined
        : sortedAll;

  const emptyMessage =
    filter === 'hosted'
      ? '主催した予定はありません'
      : filter === 'joined'
        ? '他人が開催した予定はありません'
        : '参加予定の予定はありません';

  const renderDetailModal = () => {
    if (selectedRoomId === null) {
      return null;
    }
    const roomInteractiveOverlayProps = {
      roomId: selectedRoomId,
      mode: modalMode,
      onClose: () => setSelectedRoomId(null),
      onSuccess: fetchAllData,
    };
    return <RoomInteractiveOverlay {...roomInteractiveOverlayProps} />;
  };

  return (
    <div className='flex h-full min-h-0 flex-col '>
      <Tabs
        value={subTab}
        onValueChange={(val) => setSubTab(val as TabMode)}
        className='flex h-full min-h-0 w-full flex-col'
      >
        <TabsList className='w-full h-[48px] shrink-0'>
          <TabsTrigger value='explore'>募集中</TabsTrigger>
          <TabsTrigger value='joined'>参加予定</TabsTrigger>
        </TabsList>

        <div className='mt-2 grid min-h-0 w-full flex-1 grid-cols-1 grid-rows-1'>
          <TabsContent
            value='explore'
            className='col-start-1 row-start-1 flex min-h-0 flex-col  bg-background'
          >
            <EventCardList
              ariaLabel='募集中予定一覧'
              emptyMessage='現在、参加できる新しい予定はありません'
              isEmpty={exploreEvents.length === 0}
              isLoading={isLoading}
              loadingFallback={<EventListLoadingSkeleton />}
              className='pt-2'
            >
              {exploreEvents.map((room) => {
                return (
                  <EventCard
                    key={room.id}
                    event={toEventCardViewModel(room)}
                    onClick={() => {
                      setSelectedRoomId(room.id);
                      setModalMode('explore');
                    }}
                    icon='plus'
                  />
                );
              })}
            </EventCardList>
          </TabsContent>

          <TabsContent
            value='joined'
            className='col-start-1 row-start-1 flex min-h-0 flex-col bg-background'
          >
            {!isLoading && (
              <div className='z-10 flex shrink-0 justify-center bg-background pt-2 pb-2'>
                <Tabs
                  value={filter}
                  onValueChange={(val) => setFilter(val as FilterMode)}
                >
                  <TabsList className='grid grid-cols-3 w-64 h-9 bg-muted p-1 rounded-full'>
                    <TabsTrigger value='all' className='text-xs rounded-full'>
                      全て
                    </TabsTrigger>
                    <TabsTrigger
                      value='hosted'
                      className='text-xs rounded-full'
                    >
                      主催
                    </TabsTrigger>
                    <TabsTrigger
                      value='joined'
                      className='text-xs rounded-full'
                    >
                      他催
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            )}

            <EventCardList
              ariaLabel='参加予定予定一覧'
              emptyMessage={emptyMessage}
              isEmpty={displayRooms.length === 0}
              isLoading={isLoading}
              loadingFallback={<EventListLoadingSkeleton />}
              className='pt-2'
            >
              {displayRooms.map((room) => {
                const isMyHosted = hostedRooms.some((h) => h.id === room.id);
                return (
                  <EventCard
                    key={room.id}
                    event={toEventCardViewModel(room)}
                    onClick={() => {
                      setSelectedRoomId(room.id);
                      setModalMode(isMyHosted ? 'hosted' : 'joined');
                    }}
                  />
                );
              })}
            </EventCardList>
          </TabsContent>
        </div>

        {renderDetailModal()}
      </Tabs>
    </div>
  );
};
