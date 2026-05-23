'use client';

import type { profiles } from '@prisma/client';
import type { Participant, Room } from '@type';
import {
  Calendar,
  CircleAlert,
  LogOut,
  PenBoxIcon,
  Store,
  UsersRound,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/HoverCard';
import { UserBadge } from '@/features/users/components/UserBadge';
import { getDisplayName } from '@/features/users/lib/profile';
import { formatDate } from '@/lib/date';
import {
  cancelParticipationAction,
  getEventDetail,
  joinEventAction,
} from '../actions/eventActions';
import { EventForm } from './EventForm';
import { EventDetailLoadingSkeleton } from './EventLoadingSkeleton';
import { ExitEventAlertDialog } from './ExitEventAlertDialog';

type Props = {
  roomId: number;
  mode: 'hosted' | 'joined' | 'explore';
  onClose: () => void;
  onSuccess: () => void;
};

export const EventInfoPanel = ({ roomId, mode, onClose, onSuccess }: Props) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [eventData, setEventData] = useState<Room>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLeaveDialogOpen, setIsLeaveDialogOpen] = useState(false);

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

  if (isLoading) {
    return <EventDetailLoadingSkeleton mode={mode} />;
  }

  if (error || !eventData) {
    return (
      <div className='text-red-500 bg-red-50 p-4 rounded-xl text-center font-medium'>
        {error || 'データの取得に失敗しました'}
      </div>
    );
  }

  const detailParticipants = eventData.user_rooms;
  const shouldCollapseDetailParticipants = detailParticipants.length > 7;
  const visibleDetailParticipants = shouldCollapseDetailParticipants
    ? detailParticipants.slice(0, 6)
    : detailParticipants;
  const overflowDetailParticipants = shouldCollapseDetailParticipants
    ? detailParticipants.slice(6)
    : [];

  const allergyEntries = eventData.user_rooms
    .map((participant) => ({
      allergies: participant.profiles?.allergies ?? [],
      participant,
    }))
    .filter(({ allergies }) => allergies.length > 0);

  const isNewRecruit = (profile: profiles | null) =>
    profile?.user_type === '新入社員';

  const getUserBadgeUser = (profile: profiles | null) => ({
    name: getDisplayName(profile),
    avatarUrl: profile?.avatar_url ?? undefined,
    isNewRecruit: isNewRecruit(profile),
  });

  const handleExitAction = async () => {
    setIsProcessing(true);
    const result = await cancelParticipationAction(roomId);

    if (result?.success) {
      toast.success('辞退が完了しました');
      onSuccess();
      onClose();
    } else {
      toast.error(result?.error || 'エラーが発生しました');
    }
    setIsProcessing(false);
  };

  const handleJoinAction = async () => {
    setIsProcessing(true);
    try {
      const result = await joinEventAction(roomId);
      if (result.success) {
        toast.success('予定に参加しました！');
        onSuccess();
        onClose();
      } else {
        toast.error(result.error || '参加に失敗しました');
      }
    } catch (_e) {
      toast.error('通信エラーが発生しました');
    } finally {
      setIsProcessing(false);
    }
  };

  const renderDetailParticipantBadge = (participant: Participant) => {
    const profile = participant.profiles;
    return (
      <span key={`detail-${participant.room_id}-${participant.user_id}`}>
        <UserBadge
          variant={'secondary'}
          user={{
            ...getUserBadgeUser(profile),
            isNewRecruit: isNewRecruit(profile),
          }}
        />
      </span>
    );
  };

  const renderAllergyTags = (userId: string, allergies: string[]) => {
    if (allergies.length <= 3) {
      return allergies.map((allergy) => (
        <Badge key={`${userId}-${allergy}`} variant='destructive' size='sm'>
          {allergy}
        </Badge>
      ));
    }
    return (
      <>
        {allergies.slice(0, 3).map((allergy) => (
          <Badge key={`${userId}-${allergy}`} variant='destructive' size='sm'>
            {allergy}
          </Badge>
        ))}
        <Badge variant='destructive' size='sm'>
          +{allergies.length - 3}
        </Badge>
      </>
    );
  };

  if (isEditing) {
    return (
      <div className='h-full flex flex-col gap-4 overflow-y-auto pr-1'>
        <div className='flex flex-col gap-1 pb-2 border-b border-zinc-200'>
          <h2 className='text-xl font-bold text-zinc-900'>
            {eventData.title}を編集
          </h2>
          <p className='text-sm text-zinc-500'>内容を更新できます</p>
        </div>
        <div className='flex-1'>
          <EventForm
            roomId={roomId}
            initialData={eventData || undefined}
            onSuccess={() => {
              onSuccess();
              setIsEditing(false); // 成功したら詳細表示に戻る
            }}
          />
        </div>
        <Button
          variant='outline'
          onClick={() => setIsEditing(false)}
          className='w-full mt-2'
        >
          キャンセル
        </Button>
      </div>
    );
  }

  return (
    <>
      {/* パネル全体を縦スクロール可能にするコンテナ */}
      <div className='h-full flex flex-col gap-6 overflow-y-auto pr-1 relative'>
        {/* 📋 ヘッダー部分（元DialogHeaderの代わり） */}
        <div className='flex flex-col gap-1 pr-12'>
          <h2 className='text-2xl font-bold text-zinc-900 tracking-tight'>
            {eventData.title}
          </h2>
          <p className='text-sm text-zinc-500'>イベントの詳細情報</p>

          {/* 🛠️ 右上のアクションボタン群（絶対配置で右上に固定） */}
          <div className='absolute top-0 right-0'>
            {mode === 'hosted' && (
              <Button
                variant='secondary'
                size='icon'
                className='rounded-full shadow-sm'
                onClick={() => setIsEditing(true)}
              >
                <PenBoxIcon className='h-5 w-5' />
              </Button>
            )}

            {mode === 'joined' && (
              <Button
                variant='destructive'
                size='icon'
                className='rounded-full shadow-sm'
                onClick={() => setIsLeaveDialogOpen(true)}
              >
                <LogOut className='h-5 w-5' />
              </Button>
            )}

            {mode === 'explore' && (
              <Button
                variant='default'
                onClick={handleJoinAction}
                disabled={isProcessing}
              >
                参加
              </Button>
            )}
          </div>
        </div>

        {/*お店・日時・人数のカード */}
        <Card
          size='default'
          variant='secondary shadow-none'
          className='min-h-0! overflow-visible! py-2! bg-zinc-50/80 border-none'
        >
          <CardContent className='flex-none! gap-0'>
            <div className='flex items-center gap-3 border-b border-zinc-200/60 py-3'>
              <Store className='size-4 text-zinc-500' />
              <span className='text-zinc-600 font-medium'>お店</span>
              <span className='ml-auto text-zinc-900 font-semibold'>
                {eventData.location_name}
              </span>
            </div>
            <div className='flex items-center gap-3 border-b border-zinc-200/60 py-3'>
              <Calendar className='size-4 text-zinc-500' />
              <span className='text-zinc-600 font-medium'>日時</span>
              <span className='ml-auto text-zinc-900 font-semibold'>
                {eventData.event_start_at
                  ? formatDate(eventData.event_start_at)
                  : '未定'}
              </span>
            </div>
            <div className='flex items-center gap-3 py-3'>
              <UsersRound className='size-4 text-zinc-500' />
              <span className='text-zinc-600 font-medium'>参加人数</span>
              <span className='ml-auto text-zinc-900 font-semibold'>
                {eventData.user_rooms.length}/{eventData.capacity_limit}人
              </span>
            </div>
          </CardContent>
        </Card>

        {/* 参加者一覧 */}
        <div className='flex flex-col gap-3'>
          <p className='text-sm font-semibold text-zinc-500 tracking-wider'>
            参加者
          </p>
          <div className='flex flex-wrap gap-2'>
            {visibleDetailParticipants.map((participant) =>
              renderDetailParticipantBadge(participant),
            )}

            {overflowDetailParticipants.length > 0 ? (
              <HoverCard openDelay={120} closeDelay={120}>
                <HoverCardTrigger asChild>
                  <Badge
                    asChild
                    variant='secondary'
                    size='sm'
                    className='cursor-pointer rounded-full font-bold'
                  >
                    <button
                      type='button'
                      aria-label={`残り${overflowDetailParticipants.length}名を表示`}
                    >
                      +{overflowDetailParticipants.length}
                    </button>
                  </Badge>
                </HoverCardTrigger>
                <HoverCardContent
                  align='start'
                  className='w-auto min-w-40 bg-transparent p-0 shadow-none ring-0'
                >
                  <Card
                    variant='default shadow-none'
                    className='h-auto min-h-0! w-auto py-0!'
                  >
                    <CardContent className='p-3'>
                      <div className='flex flex-wrap gap-2'>
                        {overflowDetailParticipants.map((participant) =>
                          renderDetailParticipantBadge(participant),
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </HoverCardContent>
              </HoverCard>
            ) : null}
          </div>
        </div>

        {/* アレルギー情報 */}
        {allergyEntries.length > 0 ? (
          <Card
            variant='destructive'
            className='gap-2 border-none bg-red-50/50 text-red-900'
          >
            <CardHeader className='gap-2 pb-1'>
              <CircleAlert className='size-4 text-red-500' />
              <CardTitle className='text-sm font-bold text-red-800'>
                アレルギー情報
              </CardTitle>
            </CardHeader>
            <CardContent className='gap-2'>
              {allergyEntries.map(({ allergies, participant }) => (
                <Card
                  key={`allergy-${participant.user_id}`}
                  size='sm'
                  variant='default shadow-none'
                  className='bg-white/80 border-red-100'
                >
                  <CardContent className='flex-row items-center text-foreground p-2.5'>
                    <span className='mr-auto text-sm font-medium text-zinc-700'>
                      {getDisplayName(participant.profiles)}
                    </span>
                    <span className='ml-auto flex flex-wrap justify-end gap-1.5'>
                      {renderAllergyTags(participant.user_id, allergies)}
                    </span>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        ) : null}
      </div>

      {/* 退出時の警告アラート（モーダルの外でも正常に動作します） */}
      <ExitEventAlertDialog
        isLeaveDialogOpen={isLeaveDialogOpen}
        handleLeaveDialogOpenChange={(open) => setIsLeaveDialogOpen(open)}
        handleConfirmLeave={handleExitAction}
        disabled={isProcessing}
      />
    </>
  );
};
