'use client';

import { useCallback, useEffect, useState } from 'react';
import type { Room } from '@/app/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { formatDate } from '@/lib/date';
import { getHostedEvents, getJoinedEvents } from '../actions/eventActions';
import { EventCard } from './EventCard';
import { EventDetailModal } from './EventDetailModal';

export const EventHome = () => {
  type TabMode = 'hosted' | 'joined';
  const [subTab, setSubTab] = useState<TabMode>('hosted');

  const [hostedRooms, setHostedRooms] = useState<Room[]>([]);
  const [joinedRooms, setJoinedRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);
  
  const fetchAllData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [hosted, joined] = await Promise.all([
        getHostedEvents(),
        getJoinedEvents(),
      ]);
      setHostedRooms(hosted || []);
      setJoinedRooms(joined || []);
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

  return (
    <div className='w-full flex justify-center mt-2'>
      <Tabs
        value={subTab}
        onValueChange={(val) => setSubTab(val as TabMode)} // defaultValue='hosted'
        className='flex flex-col w-[632px]'
      >
        {/* タブのメニュー部分 */}
        <TabsList className='w-full h-[48px] shrink-0'>
          <TabsTrigger value='hosted'>開催予定</TabsTrigger>
          <TabsTrigger value='joined'>参加予定</TabsTrigger>
        </TabsList>

        {/* タブのコンテンツ部分 (gridで重ねて配置し、アニメーションで切り替えます) */}
        <div className='w-full flex-1 grid grid-cols-1 grid-rows-1 mt-2'>
          <TabsContent
            value='hosted'
            className='col-start-1 row-start-1 bg-background'
          >
            <div className='space-y-4'>
              {hostedRooms.length > 0 ? (
                hostedRooms.map((room) => {
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
                      participants={`${room._count.user_rooms}/${room.capacity_limit}`}
                      tags={formattedTags}
                      onClick={() => setSelectedRoomId(room.id)}
                    />
                  );
                })
              ) : (
                <p className='text-center text-sm text-zinc-500 py-10'>
                  開催予定のイベントはありません
                </p>
              )}
            </div>
          </TabsContent>

          <TabsContent
            value='joined'
            className='col-start-1 row-start-1 bg-background'
          >
            <div className='space-y-4'>
              {joinedRooms.length > 0 ? (
                joinedRooms.map((room) => {
                  const ownerProfile = {
                    name: room.user_rooms[0]?.profiles?.username || '不明',
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
                      participants={` ${room._count.user_rooms}/${room.capacity_limit}`}
                      tags={formattedTags}
                      ownerProfile={ownerProfile}
                      onClick={() => setSelectedRoomId(room.id)}
                    />
                  );
                })
              ) : (
                <p className='text-center text-sm text-zinc-500 py-10'>
                  参加予定のイベントはありません
                </p>
              )}
            </div>
          </TabsContent>
        </div>
        {/* モーダルの表示部分 */}
        {selectedRoomId !== null && (
          <EventDetailModal
            roomId={selectedRoomId}
            mode={subTab}
            onClose={() => setSelectedRoomId(null)} // 閉じる時は箱を null（空っぽ）に戻す
            onSuccess={fetchAllData}
          />
        )}
      </Tabs>
    </div>
  );
};
