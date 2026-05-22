'use client';

import type { Participant, Room } from '@type';
import { Calendar, CircleAlert, Store, UsersRound } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Dialog, DialogBody, DialogContent } from '@/components/ui/Dialog';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/HoverCard';
import { getEventDetail } from '@/features/events/actions/eventActions';
import { EventDetailLoadingSkeleton } from '@/features/events/components/EventLoadingSkeleton';
import { ParticipantBadge } from '@/features/profile/components/ParticipantBadge';
import { getDisplayName } from '@/features/users/lib/profile';
import { formatDate } from '@/lib/date';

type Props = {
  roomId: number;
  onClose: () => void;
  children: React.ReactNode;
};

export const EventDetailDialog = ({ roomId, onClose, children }: Props) => {
  const [eventData, setEventData] = useState<Room>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(true);
  const [hoveredUserId, setHoveredUserId] = useState<string | null>(null);

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

  const renderDetailParticipantBadge = (participant: Participant) => {
    // 参加者ごとのユニークなIDを作成
    const pId = `${participant.user_id}`;

    return (
      <ParticipantBadge
        key={`detail-${pId}`}
        participant={participant}
        // 🌟 今自分がホバーされているか判定して渡す
        isOpen={hoveredUserId === pId}
        // 🌟 乗ったら自分のIDを親にセット
        onHover={() => setHoveredUserId(pId)}
        onLeave={() => setHoveredUserId((prev) => (prev === pId ? null : prev))}
      />
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
        className='max-h-[80vh] -mx-6 px-6'
      >
        {children}

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
                  {eventData.location_address ? (
                    <a
                      href={eventData.location_address}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-blue-500 hover:text-blue-700 hover:underline transition-colors'
                    >
                      {eventData.location_name}
                    </a>
                  ) : (
                    eventData.location_name || '未定'
                  )}
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
  );
};
