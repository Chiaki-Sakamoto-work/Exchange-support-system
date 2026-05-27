'use client';

import type { Participant, Room } from '@type';
import {
  Calendar,
  CheckCircle2,
  CircleAlert,
  HelpCircle,
  Sparkles,
  Store,
  UsersRound,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { DialogBody } from '@/components/ui/Dialog';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/HoverCard';
import { Switch } from '@/components/ui/Switch';
import { toggleSupportAction } from '@/features/events/actions/eventActions';
import { ParticipantBadge } from '@/features/profile/components/ParticipantBadge';
import { getDisplayName } from '@/features/users/lib/profile';
import { formatDate } from '@/lib/date';

type EventDetailContentProps = {
  eventData: Room;
  currentUserId?: string;
};

export const EventDetailContent = ({
  eventData,
  currentUserId,
}: EventDetailContentProps) => {
  const [hoveredUserId, setHoveredUserId] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const myData = currentUserId
    ? eventData.user_rooms.find((ur) => ur.user_id === currentUserId)
    : null;
  const storageKey = `support_room_${eventData.id}`;
  const isAppliedFromDb = myData?.is_support_applied || false;

  // 🌟 Linter対策：オブジェクトの参照ではなく、存在するかどうかの真偽値を作る
  const hasMyData = !!myData;

  const [isApplied, setIsApplied] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem(storageKey);
      if (saved !== null) return saved === 'true';
    }
    return isAppliedFromDb;
  });

  // 🌟 useEffectの依存配列エラーを完全にクリアするクリーンな同期処理
  useEffect(() => {
    if (hasMyData) {
      const saved = sessionStorage.getItem(storageKey);
      if (saved !== null) {
        setIsApplied(saved === 'true');
      } else {
        setIsApplied(isAppliedFromDb);
      }
    }
  }, [storageKey, isAppliedFromDb, hasMyData]); // 🌟 プリミティブな値だけを並べる

  const hasAlreadyUsedSupport = myData?.profiles?.is_support_used === true;
  const hasNewRecruit = eventData.user_rooms.some(
    (ur) => ur.profiles?.user_type === '新入社員',
  );
  const isEligibleForSupport =
    (eventData.is_mandatory_new_recruit || hasNewRecruit) &&
    !hasAlreadyUsedSupport;

  const handleToggle = async (checked: boolean) => {
    if (isUpdating) return; // 連打ブロック

    setIsApplied(checked); // 通信を待たずに1ミリ秒でトグルを動かす
    sessionStorage.setItem(storageKey, String(checked)); // 記憶を保存して親の破壊を防御
    setIsUpdating(true);

    const result = await toggleSupportAction(eventData.id, checked);

    if (result.success) {
      toast.success(
        checked ? '交流支援制度の利用をONにしました' : '利用をOFFにしました',
      );
    } else {
      setIsApplied(!checked);
      sessionStorage.setItem(storageKey, String(!checked));
      toast.error(result.error || '更新に失敗しました');
    }
    setIsUpdating(false);
  };

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
    const participantId = `${participant.room_id}-${participant.user_id}`;

    return (
      <ParticipantBadge
        key={`detail-${participantId}`}
        participant={participant}
        isOpen={hoveredUserId === participantId}
        onHover={() => setHoveredUserId(participantId)}
        onLeave={() =>
          setHoveredUserId((prev) => (prev === participantId ? null : prev))
        }
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
    <DialogBody className='flex flex-col gap-6'>
      {myData && (
        <div
          className={`
            flex items-start justify-between p-4 rounded-xl border transition-all duration-200
            ${
              hasAlreadyUsedSupport
                ? 'bg-emerald-50/20 border-emerald-100'
                : !isEligibleForSupport
                  ? 'bg-zinc-50/50 border-zinc-200/60 opacity-70'
                  : isApplied
                    ? 'bg-[#1DE9B7]/5 border-[#1DE9B7]/30 shadow-sm shadow-[#1DE9B7]/10'
                    : 'bg-white border-zinc-200 shadow-sm hover:border-zinc-300'
            }
          `}
        >
          <div className='flex gap-3'>
            <div className='mt-0.5 flex-shrink-0'>
              {hasAlreadyUsedSupport ? (
                <CheckCircle2 className='size-4 text-emerald-600' />
              ) : !isEligibleForSupport ? (
                <HelpCircle className='size-4 text-zinc-400' />
              ) : (
                <Sparkles
                  className={`size-4 transition-colors duration-200 ${
                    isApplied ? 'text-[#1DE9B7] animate-pulse' : 'text-zinc-400'
                  }`}
                />
              )}
            </div>

            <div className='flex flex-col gap-1'>
              <div className='flex items-center gap-2 flex-wrap'>
                <span className='font-semibold text-sm text-zinc-900 tracking-tight'>
                  交流支援制度の利用
                </span>

                {isEligibleForSupport && isApplied && (
                  <span className='inline-flex items-center rounded-md bg-[#1DE9B7]/10 px-1.5 py-0.5 text-[10px] font-medium text-[#11bfa6] ring-1 ring-inset ring-[#1DE9B7]/20'>
                    適用中
                  </span>
                )}
              </div>

              <span className='text-xs text-zinc-500 leading-relaxed max-w-[280px]'>
                {hasAlreadyUsedSupport
                  ? '今年度の制度はすでに利用済みです。'
                  : isEligibleForSupport
                    ? '新入社員が参加しているため、このイベントで制度を利用できます。'
                    : '新入社員が参加していないため、現在は利用できません。'}
              </span>
            </div>
          </div>

          {/* 右側のSwitchコンポーネントの配置調整 */}
          <div className='flex items-center h-full pt-0.5 pl-4'>
            <Switch
              checked={isApplied}
              onCheckedChange={handleToggle}
              disabled={!isEligibleForSupport}
              className='data-[state=unchecked]:bg-zinc-300 data-[state=checked]:bg-[#1DE9B7]'
            />
          </div>
        </div>
      )}

      <Card
        size='default'
        variant='secondary shadow-none'
        className='min-h-0! overflow-visible! py-0!'
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
                  className='text-accent transition-colors hover:text-accent/70 hover:underline'
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
  );
};
