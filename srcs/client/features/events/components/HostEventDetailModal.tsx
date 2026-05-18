'use client';

// 1. インポートの順番をアルファベット順に (p -> r -> u)
import type { profiles, rooms, user_rooms } from '@prisma/client';
import {
  Calendar,
  CircleAlert,
  PenBoxIcon,
  Store,
  UsersRound,
} from 'lucide-react';
// import { getDisplayName } from 'next/dist/shared/lib/utils';
import { type MouseEvent, useEffect, useState } from 'react';
import type { EventWithDetails, Participant } from '@/app/types';
// import type { User } from '@/app/types'; // 실제 Prisma 데이터 타입을 사용할 것이므로 주석처리
import { Badge } from '@/components/ui/Badge';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card';
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
import { ExitParticipantAlertDialog } from '@/features/events/components/ExitParticipantAlertDialog';
import { UserBadge } from '@/features/users/components/UserBadge';
import { getDisplayName } from '@/features/users/lib/profile';
import { formatDate } from '@/lib/date';
import {
  cancelParticipationAction,
  deleteEventAction,
  getEventDetail,
  joinEventAction,
} from '../actions/eventActions';
import { EventForm } from './EventForm';

type Props = {
  roomId: number;
  mode: 'hosted' | 'joined' | 'explore';
  onClose: () => void;
  onSuccess: () => void;
};

export const HostEventDetailModal = ({
  roomId,
  mode,
  onClose,
  onSuccess,
}: Props) => {
  // const [isEditing, setIsEditing] = useState(false);
  // const [isProcessing, setIsProcessing] = useState(false);
  const [eventData, setEventData] = useState<EventWithDetails>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedParticipant, setSelectedParticipant] =
    useState<Participant | null>(null);
  const [leaveDialogParticipant, setLeaveDialogParticipant] =
    useState<Participant | null>(null);
  const [leavingParticipantId, setLeavingParticipantId] = useState<
    string | null
  >(null);
  const [transferredHostUserId, setTransferredHostUserId] = useState<
    string | null
  >(null);

  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(true);
  const [isTransferDialogOpen, setIsTransferDialogOpen] = useState(false);
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

  const participants = eventData.user_rooms.filter(
    (participant) => !participant.is_owner,
  );
  const shouldCollapse = participants.length > 7;
  const visibleParticipants = shouldCollapse
    ? participants.slice(0, 6)
    : participants;
  const overflowParticipants = shouldCollapse ? participants.slice(6) : [];

  const detailParticipants = eventData.user_rooms;
  const shouldCollapseDetailParticipants = detailParticipants.length > 7;
  const visibleDetailParticipants = shouldCollapseDetailParticipants
    ? detailParticipants.slice(0, 6)
    : detailParticipants;
  const overflowDetailParticipants = shouldCollapseDetailParticipants
    ? detailParticipants.slice(6)
    : [];

  const selectedProfile = selectedParticipant?.profiles ?? null;
  const leaveDialogProfile = leaveDialogParticipant?.profiles ?? null;

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

    setLeavingParticipantId(null);
  };

  const handleSelectParticipant = (participant: Participant) => {
    setSelectedParticipant(participant);
    setIsTransferDialogOpen(true);
  };

  const handleConfirmTransfer = () => {
    if (selectedParticipant) {
      setTransferredHostUserId(selectedParticipant.user_id);
    }
    setIsTransferDialogOpen(false);
  };

  const handleSelectDetailParticipant = (participant: Participant) => {
    if (leavingParticipantId === participant.user_id) {
      setLeaveDialogParticipant(participant);
      setIsLeaveDialogOpen(true);
      return;
    }

    setLeavingParticipantId(participant.user_id);
  };

  // const handleAction = async (actionType: 'delete' | 'cancel' | 'join') => {
  //   if (actionType === 'delete') {
  //     if (
  //       !window.confirm(
  //         'この予定を完全に削除しますか？\n（この操作は取り消せません）',
  //       )
  //     )
  //       return;
  //   }
  //   if (actionType === 'cancel') {
  //     if (!window.confirm('この予定への参加をキャンセルしますか？')) return;
  //   }

  //   setIsProcessing(true);
  //   let result: { success: boolean; error?: string } | undefined;

  //   if (actionType === 'delete') result = await deleteEventAction(roomId);
  //   if (actionType === 'cancel')
  //     result = await cancelParticipationAction(roomId);
  //   if (actionType === 'join') result = await joinEventAction(roomId);

  //   if (result?.success) {
  //     alert('処理が完了しました！');
  //     onSuccess();
  //     onClose();
  //   } else {
  //     alert(result?.error || 'エラーが発生しました');
  //   }
  //   setIsProcessing(false);
  // };

  // // 🌟 編集モード
  // if (isEditing) {
  //   return (
  //     <div className='fixed inset-0 bg-black/60 z-[100] flex justify-center items-center p-4'>
  //       <div
  //         role='dialog'
  //         aria-modal='true'
  //         className='bg-white dark:bg-zinc-900 w-full max-w-md max-h-[90vh] overflow-y-auto rounded-3xl p-6 pb-12 shadow-2xl relative'
  //         onClick={(e) => e.stopPropagation()}
  //         onKeyDown={(e) => {
  //           if (e.key === 'Escape') {
  //             setIsEditing(false);
  //           }
  //         }}
  //       >
  //         <h2 className='text-xl font-bold mb-6'>予定を編集</h2>

  //         <EventForm
  //           roomId={roomId}
  //           initialData={eventData || undefined}
  //           onSuccess={() => {
  //             onSuccess();
  //             setIsEditing(false);
  //           }}
  //         />

  //         <button
  //           type='button'
  //           onClick={() => setIsEditing(false)}
  //           className='w-full mt-2 py-4 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 font-bold rounded-xl transition hover:bg-zinc-200 dark:hover:bg-zinc-700 active:scale-95'
  //         >
  //           キャンセルして戻る
  //         </button>
  //       </div>
  //     </div>
  //   );
  // }

  const handleConfirmLeave = () => {
    setIsLeaveDialogOpen(false);
    setLeavingParticipantId(null);
  };

  const handleLeaveDialogOpenChange = (open: boolean) => {
    setIsLeaveDialogOpen(open);
    if (!open) {
      setLeavingParticipantId(null);
    }
  };

  const renderDetailParticipantBadge = (participant: Participant) => {
    const profile = participant.profiles;
    const isLeaving = leavingParticipantId === participant.user_id;
    const isOwner = participant.is_owner;
    return (
      <span
        key={`detail-${participant.room_id}-${participant.user_id}`}
        data-detail-participant-control='true'
      >
        <UserBadge
          className={
            isOwner
              ? ''
              : 'transition-all duration-200 hover:scale-105 active:scale-95'
          }
          label={isLeaving ? '退室' : undefined}
          variant={isLeaving ? 'destructive' : 'secondary'}
          user={{
            ...getUserBadgeUser(profile),
            isNewRecruit: isLeaving ? false : isNewRecruit(profile),
          }}
          onClick={
            isOwner
              ? undefined
              : () => handleSelectDetailParticipant(participant)
          }
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
            <DialogIconAction variant='secondary' className='top-6 right-6'>
              <PenBoxIcon className='h-5 w-5' />
            </DialogIconAction>
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

      <ExitParticipantAlertDialog
        isLeaveDialogOpen={isLeaveDialogOpen}
        handleLeaveDialogOpenChange={handleLeaveDialogOpenChange}
        handleConfirmLeave={handleConfirmLeave}
        leaveDialogProfile={leaveDialogProfile}
      />
    </>
    // // biome-ignore lint/a11y/useSemanticElements: 背景クリックで閉じる挙動をdivで実装するため
    // <div
    //   role='button'
    //   tabIndex={-1}
    //   aria-label='モーダルを閉じる'
    //   className='fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4'
    //   onClick={onClose}
    //   onKeyDown={(e) => e.key === 'Escape' && onClose()}
    // >
    //   <div
    //     role='dialog'
    //     aria-modal='true'
    //     className='bg-white dark:bg-zinc-900 w-full max-w-md max-h-[90vh] overflow-y-auto rounded-3xl p-6 shadow-2xl relative'
    //     onClick={(e) => e.stopPropagation()}
    //     onKeyDown={(e) => e.stopPropagation()}
    //   >
    //     <button
    //       type='button'
    //       onClick={onClose}
    //       className='absolute top-4 right-4 text-zinc-400 hover:text-zinc-600'
    //     >
    //       ✕
    //     </button>

    //     {isLoading ? (
    //       <div className='py-20 text-center text-zinc-500'>読み込み中...</div>
    //     ) : error || !eventData ? (
    //       <div className='py-20 text-center text-red-500'>
    //         {error || 'データの取得に失敗しました'}
    //       </div>
    //     ) : (
    //       <div className='space-y-6'>
    //         <h2 className='text-2xl font-bold'>{eventData.title}</h2>

    //         <div className='space-y-2 text-sm text-zinc-600 dark:text-zinc-400'>
    //           <p>📍 場所: {eventData.location_name || '未定'}</p>
    //           <p>
    //             👥 人数: {eventData.user_rooms?.length || 0} /{' '}
    //             {eventData.capacity_limit}名
    //           </p>
    //           <p>🏷 タグ: {eventData.description || 'なし'}</p>
    //         </div>

    //         <div className='border-t border-zinc-200 dark:border-zinc-800 pt-4'>
    //           <h3 className='font-bold mb-3'>参加者</h3>
    //           <div className='space-y-2'>
    //             {eventData.user_rooms?.map((ur) => (
    //               <div
    //                 key={ur.user_id}
    //                 className='flex items-center gap-2 text-sm'
    //               >
    //                 <div className='w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center'>
    //                   👤
    //                 </div>
    //                 <span>{ur.profiles?.username || '名無しさん'}</span>
    //               </div>
    //             ))}
    //           </div>
    //         </div>

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

    //           {mode === 'explore' && (
    //             <button
    //               type='button'
    //               onClick={() => handleAction('join')}
    //               disabled={isProcessing}
    //               className='w-full bg-orange-500 text-white font-bold py-4 rounded-xl shadow-lg'
    //             >
    //               この予定に参加する
    //             </button>
    //           )}
    //         </div>
    //       </div>
    //     )}
    //   </div>
    // </div>
  );
};
