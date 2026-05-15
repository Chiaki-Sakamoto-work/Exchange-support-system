'use client';

import { useCallback, useEffect, useState } from 'react';
import { getHostedEvents, getJoinedEvents } from '../actions/eventActions';
import { EventCard } from './EventCard';
import { EventDetailModal } from './EventDetailModal';

type HostedRoom = Awaited<ReturnType<typeof getHostedEvents>>[0];
type JoinedRoom = Awaited<ReturnType<typeof getJoinedEvents>>[0];

export const EventHome = () => {
  const [subTab, setSubTab] = useState<'upcoming' | 'joined'>('upcoming');

  const [hostedRooms, setHostedRooms] = useState<HostedRoom[]>([]);
  const [joinedRooms, setJoinedRooms] = useState<JoinedRoom[]>([]);
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

  const formatDate = (date: Date | null) => {
    if (!date) return '日時未定';
    return new Date(date).toLocaleString('ja-JP', {
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return <div className='text-center py-10 text-zinc-400'>読み込み中...</div>;
  }

  return (
    <div className='space-y-6 animate-in fade-in duration-500'>
      {/* サブタブ切り替えスイッチ */}
      <div className='flex p-1 bg-zinc-200/50 dark:bg-zinc-800/50 rounded-xl'>
        <button
          type='button'
          onClick={() => setSubTab('upcoming')}
          className={`flex-1 py-2 text-sm font-bold rounded-lg transition ${
            subTab === 'upcoming'
              ? 'bg-white dark:bg-zinc-700 shadow-sm'
              : 'text-zinc-500 hover:text-zinc-700'
          }`}
        >
          開催予定
        </button>
        <button
          type='button'
          onClick={() => setSubTab('joined')}
          className={`flex-1 py-2 text-sm font-bold rounded-lg transition ${
            subTab === 'joined'
              ? 'bg-white dark:bg-zinc-700 shadow-sm'
              : 'text-zinc-500 hover:text-zinc-700'
          }`}
        >
          参加予定
        </button>
      </div>

      {/* リスト表示エリア */}
      <div className='space-y-4'>
        {subTab === 'upcoming' ? (
          hostedRooms.length > 0 ? (
            hostedRooms.map((room) => (
              <EventCard
                key={room.id}
                title={room.title}
                shop={room.location_name || '未定'}
                date={formatDate(room.event_start_at)}
                detail={`👥 ${room._count.user_rooms} / ${room.capacity_limit}名`}
                colorClass='bg-orange-500'
                onClick={() => setSelectedRoomId(room.id)}
              />
            ))
          ) : (
            <p className='text-center text-sm text-zinc-500 py-10'>
              開催予定のイベントはありません
            </p>
          )
        ) : (
          joinedRooms.length > 0 ? (
            joinedRooms.map((room) => {
              const owner = room.user_rooms[0]?.profiles?.username || '不明';
              return (
                <EventCard
                  key={room.id}
                  title={room.title}
                  shop={room.location_name || '未定'}
                  date={formatDate(room.event_start_at)}
                  detail={`👥 ${room._count.user_rooms} / ${room.capacity_limit}名`}
                  owner={`👤 主催: ${owner}`}
                  colorClass='bg-blue-500'
                  onClick={() => setSelectedRoomId(room.id)}
                />
              );
            })
          ) : (
            <p className='text-center text-sm text-zinc-500 py-10'>
              参加予定のイベントはありません
            </p>
          )
        )}
      </div>

      {/* モーダル */}
      {selectedRoomId !== null && (
        <EventDetailModal
          roomId={selectedRoomId}
          mode={subTab}
          onClose={() => setSelectedRoomId(null)}
          onSuccess={fetchAllData}
        />
      )}
    </div>
  );
};
