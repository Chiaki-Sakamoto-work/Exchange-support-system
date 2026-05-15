'use client';

// 1. インポートの順番をアルファベット順に (p -> r -> u)
import type { profiles, rooms, user_rooms } from '@prisma/client';
import { useEffect, useState } from 'react';
import {
  cancelParticipationAction,
  deleteEventAction,
  getEventDetail,
  joinEventAction,
} from '../actions/eventActions';
import { EventForm } from './EventForm';

type EventWithDetails = rooms & {
  user_rooms: (user_rooms & {
    profiles: profiles | null;
  })[];
};

type Props = {
  roomId: number;
  mode: 'upcoming' | 'joined' | 'explore';
  onClose: () => void;
  onSuccess: () => void;
};

export const EventDetailModal = ({
  roomId,
  mode,
  onClose,
  onSuccess,
}: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [eventData, setEventData] = useState<EventWithDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDetail() {
      const result = await getEventDetail(roomId);
      if (result.success && result.room) {
        setEventData(result.room);
      } else {
        setError(result.error || 'エラーが発生しました');
      }
      setIsLoading(false);
    }
    loadDetail();
  }, [roomId]);

  const handleAction = async (actionType: 'delete' | 'cancel' | 'join') => {
    if (actionType === 'delete') {
      if (
        !window.confirm(
          'この予定を完全に削除しますか？\n（この操作は取り消せません）',
        )
      )
        return;
    }
    if (actionType === 'cancel') {
      if (!window.confirm('この予定への参加をキャンセルしますか？')) return;
    }

    setIsProcessing(true);
    let result: { success: boolean; error?: string } | undefined;

    if (actionType === 'delete') result = await deleteEventAction(roomId);
    if (actionType === 'cancel')
      result = await cancelParticipationAction(roomId);
    if (actionType === 'join') result = await joinEventAction(roomId);

    if (result?.success) {
      alert('処理が完了しました！');
      onSuccess();
      onClose();
    } else {
      alert(result?.error || 'エラーが発生しました');
    }
    setIsProcessing(false);
  };

  // 🌟 編集モード
  if (isEditing) {
    return (
      <div className='fixed inset-0 bg-black/60 z-[100] flex justify-center items-center p-4'>
        <div
          role='dialog'
          aria-modal='true'
          className='bg-white dark:bg-zinc-900 w-full max-w-md max-h-[90vh] overflow-y-auto rounded-3xl p-6 pb-12 shadow-2xl relative'
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              setIsEditing(false);
            }
          }}
        >
          <h2 className='text-xl font-bold mb-6'>予定を編集</h2>

          <EventForm
            roomId={roomId}
            initialData={eventData || undefined}
            onSuccess={() => {
              onSuccess();
              setIsEditing(false);
            }}
          />

          <button
            type='button'
            onClick={() => setIsEditing(false)}
            className='w-full mt-2 py-4 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 font-bold rounded-xl transition hover:bg-zinc-200 dark:hover:bg-zinc-700 active:scale-95'
          >
            キャンセルして戻る
          </button>
        </div>
      </div>
    );
  }

  return (
    // biome-ignore lint/a11y/useSemanticElements: 背景クリックで閉じる挙動をdivで実装するため
    <div
      role='button'
      tabIndex={-1}
      aria-label='モーダルを閉じる'
      className='fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4'
      onClick={onClose}
      onKeyDown={(e) => e.key === 'Escape' && onClose()}
    >
      <div
        role='dialog'
        aria-modal='true'
        className='bg-white dark:bg-zinc-900 w-full max-w-md max-h-[90vh] overflow-y-auto rounded-3xl p-6 shadow-2xl relative'
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <button
          type='button'
          onClick={onClose}
          className='absolute top-4 right-4 text-zinc-400 hover:text-zinc-600'
        >
          ✕
        </button>

        {isLoading ? (
          <div className='py-20 text-center text-zinc-500'>読み込み中...</div>
        ) : error || !eventData ? (
          <div className='py-20 text-center text-red-500'>
            {error || 'データの取得に失敗しました'}
          </div>
        ) : (
          <div className='space-y-6'>
            <h2 className='text-2xl font-bold'>{eventData.title}</h2>

            <div className='space-y-2 text-sm text-zinc-600 dark:text-zinc-400'>
              <p>📍 場所: {eventData.location_name || '未定'}</p>
              <p>
                👥 人数: {eventData.user_rooms?.length || 0} /{' '}
                {eventData.capacity_limit}名
              </p>
              <p>🏷 タグ: {eventData.description || 'なし'}</p>
            </div>

            <div className='border-t border-zinc-200 dark:border-zinc-800 pt-4'>
              <h3 className='font-bold mb-3'>参加者</h3>
              <div className='space-y-2'>
                {eventData.user_rooms?.map((ur) => (
                  <div
                    key={ur.user_id}
                    className='flex items-center gap-2 text-sm'
                  >
                    <div className='w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center'>
                      👤
                    </div>
                    <span>{ur.profiles?.username || '名無しさん'}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className='pt-6 mt-6 border-t border-zinc-200 dark:border-zinc-800 space-y-3'>
              {mode === 'upcoming' && (
                <>
                  <button
                    type='button'
                    onClick={() => setIsEditing(true)}
                    className='w-full bg-zinc-800 dark:bg-zinc-200 text-white dark:text-black font-bold py-3 rounded-xl transition active:scale-95'
                  >
                    予定を編集する
                  </button>
                  <button
                    type='button'
                    onClick={() => handleAction('delete')}
                    disabled={isProcessing}
                    className='w-full bg-red-100 dark:bg-red-950/30 text-red-600 font-bold py-3 rounded-xl transition active:scale-95 disabled:opacity-50'
                  >
                    この予定を削除する
                  </button>
                </>
              )}

              {mode === 'joined' && (
                <button
                  type='button'
                  onClick={() => handleAction('cancel')}
                  disabled={isProcessing}
                  className='w-full bg-red-100 dark:bg-red-950/30 text-red-600 font-bold py-3 rounded-xl'
                >
                  参加をキャンセルする
                </button>
              )}

              {mode === 'explore' && (
                <button
                  type='button'
                  onClick={() => handleAction('join')}
                  disabled={isProcessing}
                  className='w-full bg-orange-500 text-white font-bold py-4 rounded-xl shadow-lg'
                >
                  この予定に参加する
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
