'use client';

import type { Room } from '@type';
import { useCallback, useEffect, useState } from 'react';
import { getExploreEvents } from '../actions/eventActions';
import { EventCard } from './EventCard/EventCard';
import { toEventCardViewModel } from './EventCard/EventCard.viewmodal';
import { EventDetailModal } from './EventDetailModal/EventDetailModel';
import { EventListLoadingSkeleton } from './EventLoadingSkeleton';

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

  if (isLoading) {
    return <EventListLoadingSkeleton showHeader />;
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
            return (
              <EventCard
                key={room.id}
                event={toEventCardViewModel(room)}
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
