'use client';

import { useCallback, useEffect, useState } from 'react';
import type { Room } from '@/app/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { formatDate } from '@/lib/date';
import {
  getExploreEvents,
  getHostedEvents,
  getJoinedEvents,
} from '../actions/eventActions';
import { EventCard } from './EventCard';
import { EventDetailModal } from './EventDetailModal';

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

  if (isLoading) {
    return <div className='text-center py-10 text-zinc-400'>読み込み中...</div>;
  }

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

  return (
    <div className=''>
      <Tabs
        value={subTab}
        onValueChange={(val) => setSubTab(val as TabMode)}
        className='flex flex-col w-full'
      >
        {/* 🌟 タブのメニュー名を「参加する」に変更 */}
        <TabsList className='w-full h-[48px] shrink-0'>
          <TabsTrigger value='explore'>開催中イベント</TabsTrigger>
          <TabsTrigger value='joined'>参加予定</TabsTrigger>
        </TabsList>

        <div className='w-full flex-1 grid grid-cols-1 grid-rows-1 mt-2'>
          {/* 🌟 「参加する」タブの中身 (EventExploreから流用) */}
          <TabsContent
            value='explore'
            className='col-start-1 row-start-1 bg-background'
          >
            <div className='space-y-4 pt-2'>
              {exploreEvents.length > 0 ? (
                exploreEvents.map((room) => {
                  // 主催者を安全に取得
                  const ownerProfile = {
                    name:
                      room.user_rooms?.find((ur) => ur.is_owner)?.profiles
                        ?.username || '不明',
                  };
                  const formattedTags = room.room_tags.map((rt) => ({
                    id: rt.tags.id,
                    name: rt.tags.name,
                  }));

                  return (
                    <EventCard
                      key={room.id}
                      title={room.title}
                      shop={room.location_name || '未定'}
                      date={formatDate(room.event_start_at)}
                      participants={`${room._count?.user_rooms || room.user_rooms?.length || 0} / ${room.capacity_limit}`}
                      tags={formattedTags}
                      ownerProfile={ownerProfile}
                      onClick={() => {
                        setSelectedRoomId(room.id);
                        setModalMode('explore'); // 🌟 exploreモードでモーダルを開く
                      }}
                    />
                  );
                })
              ) : (
                <p className='text-center text-sm text-zinc-500 py-10'>
                  現在、参加できる新しい予定はありません
                </p>
              )}
            </div>
          </TabsContent>

          {/* 「参加予定」タブの中身 (前回の3分割フィルター) */}
          <TabsContent
            value='joined'
            className='col-start-1 row-start-1 bg-background'
          >
            <div className='sticky top-0 z-10 bg-background pt-2 pb-4 flex justify-center'>
              <Tabs
                value={filter}
                onValueChange={(val) => setFilter(val as FilterMode)}
              >
                <TabsList className='grid grid-cols-3 w-64 h-9 bg-zinc-100 p-1 rounded-full'>
                  <TabsTrigger value='all' className='text-xs rounded-full'>
                    全て
                  </TabsTrigger>
                  <TabsTrigger value='hosted' className='text-xs rounded-full'>
                    主催
                  </TabsTrigger>
                  <TabsTrigger value='joined' className='text-xs rounded-full'>
                    参加
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className='space-y-4'>
              {displayRooms.length > 0 ? (
                displayRooms.map((room) => {
                  const isMyHosted = hostedRooms.some((h) => h.id === room.id);
                  const ownerProfile = {
                    name:
                      room.user_rooms?.find((ur) => ur.is_owner)?.profiles
                        ?.username || '不明',
                  };
                  const formattedTags = room.room_tags.map((rt) => ({
                    id: rt.tags.id,
                    name: rt.tags.name,
                  }));

                  return (
                    <EventCard
                      key={room.id}
                      title={room.title}
                      shop={room.location_name || '未定'}
                      date={formatDate(room.event_start_at)}
                      participants={`${room._count?.user_rooms || room.user_rooms?.length || 0} / ${room.capacity_limit}`}
                      tags={formattedTags}
                      ownerProfile={
                        isMyHosted ? { name: 'あなた (主催)' } : ownerProfile
                      }
                      onClick={() => {
                        setSelectedRoomId(room.id);
                        setModalMode(isMyHosted ? 'hosted' : 'joined');
                      }}
                    />
                  );
                })
              ) : (
                <p className='text-center text-sm text-zinc-500 py-10'>
                  {emptyMessage}
                </p>
              )}
            </div>
          </TabsContent>
        </div>

        {/* モーダル部分 */}
        {selectedRoomId !== null && (
          <EventDetailModal
            roomId={selectedRoomId}
            mode={modalMode}
            onClose={() => setSelectedRoomId(null)}
            onSuccess={fetchAllData}
          />
        )}
      </Tabs>
    </div>
  );
};
