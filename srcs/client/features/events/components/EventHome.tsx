'use client';

import type { Room } from '@type';
import { useCallback, useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import {
  getExploreEvents,
  getHostedEvents,
  getJoinedEvents,
} from '../actions/eventActions';
import { EventCard } from './EventCard/EventCard';
import { toEventCardViewModel } from './EventCard/EventCard.viewmodal';
import { EventCardList } from './EventCardList';
import { EventListLoadingSkeleton } from './EventLoadingSkeleton';
import { RoomInteractiveOverlay } from '@feature/events/components/RoomInteractiveOverlay';

export const EventHome = () => {
  type TabMode = 'explore' | 'joined';
  type FilterMode = 'all' | 'hosted' | 'joined';

  const [subTab, setSubTab] = useState<TabMode>('explore');
  const [filter, setFilter] = useState<FilterMode>('all');

  // 🌟 3. explore用のStateを追加
  const [exploreEvents, setExploreEvents] = useState<Room[]>([]);
  const [hostedRooms, setHostedRooms] = useState<Room[]>([]);
  const [joinedRooms, setJoinedRooms] = useState<Room[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);

  // 🌟 モーダルのモードに 'explore' を追加
  const [modalMode, setModalMode] = useState<'hosted' | 'joined' | 'explore'>(
    'explore',
  );

  // 🌟 4. Promise.all に getExploreEvents を追加し、3つのデータを一気に取得
  const fetchAllData = useCallback(async () => {
    setIsLoading(true);
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
  }, []);

  useEffect(() => {
    fetchAllData();
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
        : '参加予定のイベントはありません';

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
        {/* 🌟 タブのメニュー名を「参加する」に変更 */}
        <TabsList className='w-full h-[48px] shrink-0'>
          <TabsTrigger value='explore'>募集中</TabsTrigger>
          <TabsTrigger value='joined'>参加予定</TabsTrigger>
        </TabsList>

        <div className='mt-2 grid min-h-0 w-full flex-1 grid-cols-1 grid-rows-1'>
          {/* 🌟 「参加する」タブの中身 (EventExploreから流用) */}
          <TabsContent
            value='explore'
            className='col-start-1 row-start-1 flex min-h-0 flex-col  bg-background'
          >
            <EventCardList
              ariaLabel='募集中イベント一覧'
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
                  />
                );
              })}
            </EventCardList>
          </TabsContent>

          {/* 「参加予定」タブの中身 (前回の3分割フィルター) */}
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
              ariaLabel='参加予定イベント一覧'
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

        {/* モーダル部分 */}
        {renderDetailModal()}
      </Tabs>
    </div>
  );
};
