'use client';

import { useCallback, useEffect, useState } from 'react';
import type { Room } from '@/app/types';
import { getExploreEvents } from '../actions/eventActions';
import { EventCard } from './EventCard';
import { EventDetailModal } from './EventDetailModal';

export const EventExplore = () => {
  // explore専用のデータと状態
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [exploreEvents, setExploreEvents] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);

  const fetchExploreData = useCallback(async () => {
    setIsLoading(true);
    try {
      const exploreRes = await getExploreEvents();
      if (exploreRes.success) {
        setExploreEvents(exploreRes.events || []);
      }
    } catch (error) {
      console.error('探すデータの取得エラー:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExploreData();
  }, [fetchExploreData]);

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
      {/* 参加タブ専用のタイトルなど（お好みで調整してください） */}
      <div className='mb-6'>
        <h2 className='text-2xl font-bold'>新しい予定を探す</h2>
        <p className='text-sm text-zinc-500 mt-1'>
          参加できるイベントの一覧です
        </p>
      </div>

      <div className='space-y-4'>
        {exploreEvents.length > 0 ? (
          exploreEvents.map((room) => {
            // 主催者を探す（is_owner: true のユーザー）
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
                tags={formattedTags}
                title={room.title}
                shop={room.location_name || '未定'}
                date={formatDate(room.event_start_at)}
                participants={`👥 ${room.user_rooms?.length || 0} / ${room.capacity_limit}名`}
                ownerProfile={ownerProfile}
                onClick={() => setSelectedRoomId(room.id)}
              />
            );
          })
        ) : (
          <p className='text-center text-sm text-zinc-500 py-10'>
            現在、参加できる新しい予定はありません
          </p>
        )}
      </div>

      {/* モーダルの表示（mode は 'explore' 固定で渡す） */}
      {selectedRoomId !== null && (
        <EventDetailModal
          roomId={selectedRoomId}
          mode='explore'
          onClose={() => setSelectedRoomId(null)}
          onSuccess={() => {
            setSelectedRoomId(null); // モーダルを閉じて
            fetchExploreData(); // リストを再取得
          }}
        />
      )}
    </div>
  );
};
