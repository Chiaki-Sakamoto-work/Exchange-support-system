'use client';

import { useEffect, useState } from 'react';
import { getHostedEvents, getJoinedEvents } from '../actions/eventActions';
import { EventCard } from './EventCard'; // 先ほど作ったカードを読み込む
import { EventDetailModal } from './EventDetailModal';

type HostedRoom = Awaited<ReturnType<typeof getHostedEvents>>[0];
type JoinedRoom = Awaited<ReturnType<typeof getJoinedEvents>>[0];

export const EventHome = () => {
  // ホーム画面内だけの状態（サブタブ）は、このコンポーネントで管理する
  const [subTab, setSubTab] = useState<'upcoming' | 'joined'>('upcoming');

  // データを保存するための「入れ物(State)」
  const [hostedRooms, setHostedRooms] = useState<HostedRoom[]>([]);
  const [joinedRooms, setJoinedRooms] = useState<JoinedRoom[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);

  // 🌟 1. データの読み込み処理を関数として独立させる
  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      const [hosted, joined] = await Promise.all([
        getHostedEvents(),
        getJoinedEvents(),
      ]);
      setHostedRooms(hosted);
      setJoinedRooms(joined);
    } catch (error) {
      console.error('データ取得エラー:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 画面が開いた瞬間にデータを取ってくる
  useEffect(() => {
    fetchAllData();
  }, []);

  // 日付を見やすく変換する関数 (2026-05-20T... -> 5/20 19:00)
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
              : 'text-zinc-500'
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
              : 'text-zinc-500'
          }`}
        >
          参加予定
        </button>
      </div>

      {/* リスト表示エリア */}
      <div className='space-y-4'>
        {subTab === 'upcoming' ? (
          // マイ開催
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
        ) : // 参加予定
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
        )}
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
    </div>
  );
};
