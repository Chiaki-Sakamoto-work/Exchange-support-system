'use client';

// 1. インポートの順番をアルファベット順に (p -> r -> u)
import type { profiles } from '@prisma/client';
import {
  Calendar,
  CircleAlert,
  LogOut,
  PenBoxIcon,
  Store,
  UsersRound,
} from 'lucide-react';
// import { getDisplayName } from 'next/dist/shared/lib/utils';
import { type MouseEvent, useEffect, useState } from 'react';
import type { Participant, Room } from '@/app/types';
// import type { User } from '@/app/types'; // 실제 Prisma 데이터 타입을 사용할 것이므로 주석처리
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogIconAction,
  DialogTitle,
} from '@/components/ui/Dialog';
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
} from '../actions/eventActions';
import { EventForm } from './EventForm';
import { ExitEventAlertDialog } from './ExitEventAlertDialog';

type Props = {
  roomId: number;
  mode: 'hosted' | 'joined' | 'explore';
  onClose: () => void;
  onSuccess: () => void;
};

export const EventDetailModal = ({
  roomId,
  mode,
  onClose,
  onSuccess,
}: Props) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [eventData, setEventData] = useState<Room>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(true);
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
    return (
      <div className='fixed inset-0 bg-black/60 z-50 flex justify-center items-center'>
        <div className='text-white'>読み込み中...</div>
      </div>
    );
  }
  if (error || !eventData) {
    return (
      <div className='fixed inset-0 bg-black/60 z-50 flex justify-center items-center'>
        <div className='text-red-500 bg-white p-4 rounded-xl'>
          {error || 'データの取得に失敗しました'}
        </div>
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

  const handleDetailDialogClick = (event: MouseEvent<HTMLDivElement>) => {
    const target = event.target;

    if (
      target instanceof Element &&
      target.closest('[data-detail-participant-control]')
    ) {
      return;
    }
  };

  const handleExitAction = async () => {
    setIsProcessing(true);
    let result: { success: boolean; error?: string } | undefined;

    result = await cancelParticipationAction(roomId);

    if (result?.success) {
      alert('処理が完了しました！');
      onSuccess();
      onClose();
    } else {
      alert(result?.error || 'エラーが発生しました');
    }
    setIsProcessing(false);
  };

  const handleLeaveDialogOpenChange = (open: boolean) => {
    setIsLeaveDialogOpen(open);
  };

  const renderDetailParticipantBadge = (participant: Participant) => {
    const profile = participant.profiles;
    return (
      <span
        key={`detail-${participant.room_id}-${participant.user_id}`}
        data-detail-participant-control='true'
      >
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
    <Dialog>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{eventData.title}を編集</DialogTitle>
          <DialogDescription>内容を更新できます</DialogDescription>
        </DialogHeader>
        <DialogBody>
          <EventForm
            roomId={roomId}
            initialData={eventData || undefined}
            onSuccess={() => {
              onSuccess();
              setIsEditing(false);
            }}
          />
        </DialogBody>
      </DialogContent>
    </Dialog>;
  }

  return (
    <>
      <Dialog
        open={isDetailDialogOpen}
        onOpenChange={(open) => {
          setIsDetailDialogOpen(open);
          if (!open) {
            onClose();
          }
        }}
      >
        <DialogContent
          showCloseButton={false}
          className='max-h-[80vh]'
          onClick={handleDetailDialogClick}
        >
          <DialogHeader className='gap-0.5'>
            <DialogTitle>{eventData.title}</DialogTitle>
            <DialogDescription>イベントの詳細情報</DialogDescription>
            {mode === 'hosted' && (
              <DialogIconAction variant='secondary' className='top-6 right-6'>
                <PenBoxIcon
                  className='h-5 w-5'
                  onClick={() => setIsEditing(true)}
                />
              </DialogIconAction>
            )}
            {mode === 'joined' && (
              <DialogIconAction
                variant='destructive'
                className='top-6 right-6'
                onClick={() => setIsLeaveDialogOpen(true)}
              >
                <LogOut className='h-5 w-5' />
              </DialogIconAction>
            )}
            {mode === 'explore' && (
              <Button size='sm' variant='default' className='top-6 right-6'>
                参加
              </Button>
            )}
          </DialogHeader>

          <DialogBody className='flex flex-col gap-6'>
            <Card
              size='default'
              variant='secondary shadow-none'
              className='min-h-0! overflow-visible! py-2!'
            >
              <CardContent className='flex-none! gap-0'>
                <div className='flex items-center gap-3 border-b border-border py-3'>
                  <Store className='size-4' />
                  <span>お店</span>
                  <span className='ml-auto text-foreground'>
                    {eventData.location_name}
                  </span>
                </div>
                <div className='flex items-center gap-3 border-b border-border py-3'>
                  <Calendar className='size-4' />
                  <span>日時</span>
                  <span className='ml-auto text-foreground'>
                    {eventData.event_start_at
                      ? formatDate(eventData.event_start_at)
                      : '未定'}
                  </span>
                </div>
                <div className='flex items-center gap-3 py-3'>
                  <UsersRound className='size-4' />
                  <span>参加人数</span>
                  <span className='ml-auto text-foreground'>
                    {eventData.user_rooms.length}/{eventData.capacity_limit}人
                  </span>
                </div>
              </CardContent>
            </Card>

            <div className='flex flex-col gap-3'>
              <p className='text-muted-foreground'>参加者</p>
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
                        className='cursor-pointer'
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

            {allergyEntries.length > 0 ? (
              <Card variant='destructive' className='gap-2'>
                <CardHeader className='gap-2'>
                  <CircleAlert className='size-4' />
                  <CardTitle>アレルギー情報</CardTitle>
                </CardHeader>
                <CardContent className='gap-2'>
                  {allergyEntries.map(({ allergies, participant }) => (
                    <Card
                      key={`allergy-${participant.user_id}`}
                      size='sm'
                      variant='default shadow-none'
                    >
                      <CardContent className='flex-row items-center text-foreground'>
                        <span className='mr-auto text-foreground'>
                          {getDisplayName(participant.profiles)}
                        </span>
                        <span className='ml-auto flex flex-wrap justify-end gap-2'>
                          {renderAllergyTags(participant.user_id, allergies)}
                        </span>
                      </CardContent>
                    </Card>
                  ))}
                </CardContent>
              </Card>
            ) : null}
          </DialogBody>
        </DialogContent>
      </Dialog>

      <ExitEventAlertDialog
        isLeaveDialogOpen={isLeaveDialogOpen}
        handleLeaveDialogOpenChange={handleLeaveDialogOpenChange}
        handleConfirmLeave={handleExitAction}
        disabled={isProcessing}
      />
    </>

    //         <div className='pt-6 mt-6 border-t border-zinc-200 dark:border-zinc-800 space-y-3'>
    //           {mode === 'hosted' && (
    //             <>
    //               <button
    //                 type='button'
    //                 onClick={() => setIsEditing(true)}
    //                 className='w-full bg-zinc-800 dark:bg-zinc-200 text-white dark:text-black font-bold py-3 rounded-xl transition active:scale-95'
    //               >
    //                 予定を編集する
    //               </button>
    //               <button
    //                 type='button'
    //                 onClick={() => handleAction('delete')}
    //                 disabled={isProcessing}
    //                 className='w-full bg-red-100 dark:bg-red-950/30 text-red-600 font-bold py-3 rounded-xl transition active:scale-95 disabled:opacity-50'
    //               >
    //                 この予定を削除する
    //               </button>
    //             </>
    //           )}

    //           {mode === 'joined' && (
    //             <button
    //               type='button'
    //               onClick={() => handleAction('cancel')}
    //               disabled={isProcessing}
    //               className='w-full bg-red-100 dark:bg-red-950/30 text-red-600 font-bold py-3 rounded-xl'
    //             >
    //               参加をキャンセルする
    //             </button>
    //           )}
  );
};
