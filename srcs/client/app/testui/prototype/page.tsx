'use client';

import type { profiles, rooms, user_rooms } from '@prisma/client';
import {
  ArrowLeftRight,
  Calendar,
  CircleAlert,
  PenBoxIcon,
  Store,
  UsersRound,
} from 'lucide-react';
import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogBody,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
} from '@/components/ui/AlertDialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
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
import { Label } from '@/components/ui/Label';
import { UserBadge } from '@/features/users/components/UserBadge';

type MockRoomWithUsers = rooms & {
  user_rooms: (user_rooms & {
    profiles: profiles | null;
  })[];
};

const mockDate = new Date('2026-05-16T09:00:00.000Z');

const mockUsers: profiles[] = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    email: 'myuser@example.com',
    username: '姫城太一',
    avatar_url: 'https://github.com/shadcn.png',
    department_id: 1,
    user_type: '一般社員',
    is_support_used: true,
    is_admin: false,
    allergies: [],
    created_at: mockDate,
    updated_at: mockDate,
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    email: 'other@example.com',
    username: '田中一郎',
    avatar_url: null,
    department_id: 2,
    user_type: '一般社員',
    is_support_used: false,
    is_admin: false,
    allergies: ['そば', '甲殻類', '小麦', '乳製品'],
    created_at: mockDate,
    updated_at: mockDate,
  },
  {
    id: '33333333-3333-3333-3333-333333333333',
    email: 'sato@example.com',
    username: '佐藤花子',
    avatar_url: null,
    department_id: 1,
    user_type: '一般社員',
    is_support_used: true,
    is_admin: false,
    allergies: [],
    created_at: mockDate,
    updated_at: mockDate,
  },
  {
    id: '44444444-4444-4444-4444-444444444444',
    email: 'suzuki@example.com',
    username: '鈴木健太',
    avatar_url: null,
    department_id: 2,
    user_type: '新入社員',
    is_support_used: false,
    is_admin: false,
    allergies: [],
    created_at: mockDate,
    updated_at: mockDate,
  },
  {
    id: '55555555-5555-5555-5555-555555555555',
    email: 'takahashi@example.com',
    username: '高橋美咲',
    avatar_url: null,
    department_id: 2,
    user_type: '一般社員',
    is_support_used: true,
    is_admin: false,
    allergies: ['えび'],
    created_at: mockDate,
    updated_at: mockDate,
  },
  {
    id: '66666666-6666-6666-6666-666666666666',
    email: 'watanabe@example.com',
    username: '渡辺大輔',
    avatar_url: null,
    department_id: 1,
    user_type: '一般社員',
    is_support_used: false,
    is_admin: false,
    allergies: [],
    created_at: mockDate,
    updated_at: mockDate,
  },
  {
    id: '77777777-7777-7777-7777-777777777777',
    email: 'ito@example.com',
    username: '伊藤葵',
    avatar_url: null,
    department_id: 2,
    user_type: '新入社員',
    is_support_used: false,
    is_admin: false,
    allergies: ['卵'],
    created_at: mockDate,
    updated_at: mockDate,
  },
  {
    id: '88888888-8888-8888-8888-888888888888',
    email: 'yamamoto@example.com',
    username: '山本拓也',
    avatar_url: null,
    department_id: 2,
    user_type: '一般社員',
    is_support_used: true,
    is_admin: false,
    allergies: [],
    created_at: mockDate,
    updated_at: mockDate,
  },
  {
    id: '99999999-9999-9999-9999-999999999999',
    email: 'nakamura@example.com',
    username: '中村莉子',
    avatar_url: null,
    department_id: 2,
    user_type: '一般社員',
    is_support_used: false,
    is_admin: false,
    allergies: [],
    created_at: mockDate,
    updated_at: mockDate,
  },
  {
    id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    email: 'kobayashi@example.com',
    username: '小林直樹',
    avatar_url: null,
    department_id: 1,
    user_type: '新入社員',
    is_support_used: false,
    is_admin: false,
    allergies: ['乳'],
    created_at: mockDate,
    updated_at: mockDate,
  },
];

const createUserRoom = (
  roomId: number,
  profile: profiles,
  isOwner = false,
): MockRoomWithUsers['user_rooms'][number] => ({
  user_id: profile.id,
  room_id: roomId,
  is_owner: isOwner,
  joined_at: mockDate,
  left_at: null,
  created_at: mockDate,
  updated_at: mockDate,
  profiles: profile,
});

const mockRooms: MockRoomWithUsers[] = [
  {
    id: 1,
    title: 'ホスト権限移動テスト会',
    description: 'プロトタイプで参加者選択を確認するための予定です。',
    capacity_limit: 12,
    is_mandatory_new_recruit: false,
    location_name: '渋谷コワーキング',
    location_address: '東京都渋谷区道玄坂1-1-1',
    open_at: new Date('2026-05-10T00:00:00.000Z'),
    close_at: new Date('2026-05-16T09:00:00.000Z'),
    event_start_at: new Date('2026-05-18T12:00:00.000Z'),
    event_end_at: new Date('2026-05-18T13:00:00.000Z'),
    status: 'OPEN',
    created_at: mockDate,
    updated_at: mockDate,
    user_rooms: mockUsers.map((user, index) =>
      createUserRoom(1, user, index === 0),
    ),
  },
  {
    id: 2,
    title: 'エンジニア交流ランチ',
    description: '他部署との交流を深めるランチ会です。',
    capacity_limit: 6,
    is_mandatory_new_recruit: false,
    location_name: '代官山カフェ',
    location_address: '東京都渋谷区代官山町2-2-2',
    open_at: new Date('2026-05-11T00:00:00.000Z'),
    close_at: new Date('2026-05-18T02:00:00.000Z'),
    event_start_at: new Date('2026-05-18T03:00:00.000Z'),
    event_end_at: new Date('2026-05-18T04:00:00.000Z'),
    status: 'OPEN',
    created_at: mockDate,
    updated_at: mockDate,
    user_rooms: [mockUsers[1], mockUsers[0], mockUsers[4], mockUsers[7]].map(
      (user, index) => createUserRoom(2, user, index === 0),
    ),
  },
  {
    id: 3,
    title: '新入社員歓迎ボードゲーム会',
    description: '新入社員と既存メンバーで交流する会です。',
    capacity_limit: 8,
    is_mandatory_new_recruit: true,
    location_name: '新宿ミーティングルーム',
    location_address: '東京都新宿区西新宿3-3-3',
    open_at: new Date('2026-05-12T00:00:00.000Z'),
    close_at: new Date('2026-05-23T09:00:00.000Z'),
    event_start_at: new Date('2026-05-24T09:00:00.000Z'),
    event_end_at: new Date('2026-05-24T11:00:00.000Z'),
    status: 'OPEN',
    created_at: mockDate,
    updated_at: mockDate,
    user_rooms: [
      mockUsers[3],
      mockUsers[6],
      mockUsers[9],
      mockUsers[2],
      mockUsers[8],
    ].map((user, index) => createUserRoom(3, user, index === 0)),
  },
];

const getDisplayName = (profile: profiles | null) =>
  profile?.username ?? '名無しさん';

const getFallback = (profile: profiles | null) =>
  getDisplayName(profile).slice(0, 1).toUpperCase();

const isNewRecruit = (profile: profiles | null) =>
  profile?.user_type === '新入社員';

const getUserBadgeUser = (profile: profiles | null) => ({
  name: getDisplayName(profile),
  avatarUrl: profile?.avatar_url,
  isNewRecruit: isNewRecruit(profile),
});

const formatDetailDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

export default function PrototypePage() {
  const [selectedParticipant, setSelectedParticipant] = useState<
    MockRoomWithUsers['user_rooms'][number] | null
  >(null);
  const [leavingParticipantId, setLeavingParticipantId] = useState<
    string | null
  >(null);
  const [leaveDialogParticipant, setLeaveDialogParticipant] = useState<
    MockRoomWithUsers['user_rooms'][number] | null
  >(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(true);
  const [isTransferDialogOpen, setIsTransferDialogOpen] = useState(false);
  const [isLeaveDialogOpen, setIsLeaveDialogOpen] = useState(false);
  const [transferredHostUserId, setTransferredHostUserId] = useState<
    string | null
  >(null);
  const room = mockRooms[0];
  const participants = room.user_rooms.filter(
    (participant) => !participant.is_owner,
  );
  const shouldCollapse = participants.length > 7;
  const visibleParticipants = shouldCollapse
    ? participants.slice(0, 6)
    : participants;
  const overflowParticipants = shouldCollapse ? participants.slice(6) : [];
  const detailParticipants = room.user_rooms;
  const shouldCollapseDetailParticipants = detailParticipants.length > 7;
  const visibleDetailParticipants = shouldCollapseDetailParticipants
    ? detailParticipants.slice(0, 6)
    : detailParticipants;
  const overflowDetailParticipants = shouldCollapseDetailParticipants
    ? detailParticipants.slice(6)
    : [];
  const selectedProfile = selectedParticipant?.profiles ?? null;
  const leaveDialogProfile = leaveDialogParticipant?.profiles ?? null;
  const allergyEntries = room.user_rooms
    .map((participant) => ({
      allergies: participant.profiles?.allergies ?? [],
      participant,
    }))
    .filter(({ allergies }) => allergies.length > 0);

  const handleSelectParticipant = (
    participant: MockRoomWithUsers['user_rooms'][number],
  ) => {
    setSelectedParticipant(participant);
    setIsTransferDialogOpen(true);
  };

  const handleConfirmTransfer = () => {
    if (selectedParticipant) {
      setTransferredHostUserId(selectedParticipant.user_id);
    }
    setIsTransferDialogOpen(false);
  };

  const handleSelectDetailParticipant = (
    participant: MockRoomWithUsers['user_rooms'][number],
  ) => {
    if (leavingParticipantId === participant.user_id) {
      setLeaveDialogParticipant(participant);
      setIsLeaveDialogOpen(true);
      return;
    }

    setLeavingParticipantId(participant.user_id);
  };

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

  const renderAllergyTags = (userId: string, allergies: string[]) => {
    if (allergies.length <= 3) {
      return allergies.map((allergy) => (
        <Badge key={`${userId}-${allergy}`} variant='destructive' size='sm'>
          {allergy}
        </Badge>
      ));
    }

    const visibleAllergies = allergies.slice(0, 2);
    const overflowAllergies = allergies.slice(2);

    return (
      <>
        {visibleAllergies.map((allergy) => (
          <Badge key={`${userId}-${allergy}`} variant='destructive' size='sm'>
            {allergy}
          </Badge>
        ))}
        <HoverCard openDelay={120} closeDelay={120}>
          <HoverCardTrigger asChild>
            <Badge
              asChild
              variant='destructive'
              size='sm'
              className='cursor-pointer'
            >
              <button
                type='button'
                aria-label={`残り${overflowAllergies.length}件のアレルギーを表示`}
              >
                +{overflowAllergies.length}
              </button>
            </Badge>
          </HoverCardTrigger>
          <HoverCardContent align='end' className='w-auto'>
            <div className='flex flex-wrap gap-2'>
              {overflowAllergies.map((allergy) => (
                <Badge
                  key={`${userId}-overflow-${allergy}`}
                  variant='destructive'
                  size='sm'
                >
                  {allergy}
                </Badge>
              ))}
            </div>
          </HoverCardContent>
        </HoverCard>
      </>
    );
  };

  const renderDetailParticipantBadge = (
    participant: MockRoomWithUsers['user_rooms'][number],
  ) => {
    const profile = participant.profiles;
    const isLeaving = leavingParticipantId === participant.user_id;

    return (
      <UserBadge
        key={`detail-${participant.room_id}-${participant.user_id}`}
        className='transition-all duration-200 hover:scale-105 active:scale-95'
        label={isLeaving ? '退室' : undefined}
        variant={isLeaving ? 'destructive' : 'secondary'}
        user={{
          ...getUserBadgeUser(profile),
          isNewRecruit: isLeaving ? false : isNewRecruit(profile),
        }}
        onClick={() => handleSelectDetailParticipant(participant)}
      />
    );
  };

  const renderParticipantBadge = (
    participant: MockRoomWithUsers['user_rooms'][number],
    variant: 'default' | 'secondary' = 'default',
  ) => {
    const profile = participant.profiles;

    return (
      <UserBadge
        key={`${participant.room_id}-${participant.user_id}`}
        leadingVisual='dot'
        variant={
          transferredHostUserId === participant.user_id ? 'accept' : variant
        }
        className='hover:bg-accent hover:text-accent-foreground'
        user={getUserBadgeUser(profile)}
        onClick={() => handleSelectParticipant(participant)}
      />
    );
  };

  return (
    <>
      <section className='w-[398px] mx-auto mt-10'>
        <Card
          variant='secondary shadow-none'
          className='h-auto w-full min-h-0!'
        >
          <CardContent>
            <Label>
              <ArrowLeftRight className='w-4 h-4' />
              ホスト権限を移動
            </Label>
            <span className='py-1 text-[12px]'>
              選ぶと自分は普通の参加者になり、その人がホストになります。
            </span>

            <div className='py-2 flex flex-wrap gap-2'>
              {visibleParticipants.map((participant) =>
                renderParticipantBadge(participant),
              )}
              {overflowParticipants.length > 0 ? (
                <HoverCard openDelay={120} closeDelay={120}>
                  <HoverCardTrigger asChild>
                    <Badge
                      asChild
                      variant='secondary'
                      size='sm'
                      className='translate-y-0.5 cursor-pointer border-0 focus-visible:border-transparent focus-visible:ring-0'
                    >
                      <button
                        type='button'
                        aria-label={`残り${overflowParticipants.length}名を表示`}
                      >
                        +{overflowParticipants.length}
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
                          {overflowParticipants.map((participant) =>
                            renderParticipantBadge(participant, 'secondary'),
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </HoverCardContent>
                </HoverCard>
              ) : null}
            </div>
          </CardContent>
        </Card>
      </section>

      <AlertDialog
        open={isTransferDialogOpen}
        onOpenChange={setIsTransferDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogTitle className='text-xl'>
            ホストを移動しますか？
          </AlertDialogTitle>
          <AlertDialogDescription>
            この人にホスト権限を渡します。あなたは普通の参加者になり、このルームは「参加予定」に移ります。
          </AlertDialogDescription>

          <AlertDialogBody>
            <Card variant='secondary shadow-none' className='min-h-0! py-4!'>
              <CardHeader className='flex flex-row items-center gap-3 px-4'>
                <Avatar variant='rounded-full'>
                  <AvatarImage src={selectedProfile?.avatar_url ?? undefined} />
                  <AvatarFallback
                    className={
                      isNewRecruit(selectedProfile)
                        ? 'bg-accent text-accent-foreground'
                        : undefined
                    }
                  >
                    {getFallback(selectedProfile)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle>{getDisplayName(selectedProfile)}</CardTitle>
                  <CardDescription>さんを新しいホストにします</CardDescription>
                </div>
                {isNewRecruit(selectedProfile) ? (
                  <CardAction className='self-center'>
                    <Badge variant='accent' size='xs'>
                      新
                    </Badge>
                  </CardAction>
                ) : null}
              </CardHeader>
            </Card>
            {/* <Card variant='secondary shadow-none'>
              <Avatar variant='rounded-full'>
                <AvatarImage src={selectedProfile?.avatar_url ?? undefined} />
                <AvatarFallback>
                  {getFallback(selectedProfile)}
                </AvatarFallback>
              </Avatar>
              <CardContent>
              
                <CardHeader>
                  {getDisplayName(selectedProfile)}
                </CardHeader>
                <CardDescription>
                  さんを新しいホストにします
                </CardDescription>
              {isNewRecruit(selectedProfile) ? (
                <Badge variant='accent' size='xs'>
                  新
                </Badge>
              ) : null}
              </CardContent>
            </Card> */}
          </AlertDialogBody>

          <AlertDialogFooter>
            <AlertDialogCancel variant='outline'>キャンセル</AlertDialogCancel>
            <AlertDialogAction variant='accent' onClick={handleConfirmTransfer}>
              ホストを移動
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* 詳細popup */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent showCloseButton={false} className='max-h-[80vh]'>
          <DialogHeader className='gap-0.5'>
            <DialogTitle>{room.title}</DialogTitle>
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
                    {room.location_name}
                  </span>
                </div>
                <div className='flex items-center gap-3 border-b border-border py-3'>
                  <Calendar className='size-4' />
                  <span>日時</span>
                  <span className='ml-auto text-foreground'>
                    {formatDetailDate(room.event_start_at ?? mockDate)}
                  </span>
                </div>
                <div className='flex items-center gap-3 py-3'>
                  <UsersRound className='size-4' />
                  <span>参加人数</span>
                  <span className='ml-auto text-foreground'>
                    {room.user_rooms.length}/{room.capacity_limit}人
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

      <AlertDialog
        open={isLeaveDialogOpen}
        onOpenChange={handleLeaveDialogOpenChange}
      >
        <AlertDialogContent>
          <AlertDialogTitle className='text-xl'>
            ホストを移動しますか？
          </AlertDialogTitle>
          <AlertDialogDescription>
            この人にホスト権限を渡します。あなたは普通の参加者になり、このルームは「参加予定」に移ります。
          </AlertDialogDescription>

          <AlertDialogBody>
            <Card variant='secondary shadow-none' className='min-h-0! py-4!'>
              <CardHeader className='flex flex-row items-center gap-3 px-4'>
                <Avatar variant='rounded-full'>
                  <AvatarImage
                    src={leaveDialogProfile?.avatar_url ?? undefined}
                  />
                  <AvatarFallback
                    className={
                      isNewRecruit(leaveDialogProfile)
                        ? 'bg-accent text-accent-foreground'
                        : undefined
                    }
                  >
                    {getFallback(leaveDialogProfile)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle>{getDisplayName(leaveDialogProfile)}</CardTitle>
                  <CardDescription>さんを新しいホストにします</CardDescription>
                </div>
                {isNewRecruit(leaveDialogProfile) ? (
                  <CardAction className='self-center'>
                    <Badge variant='accent' size='xs'>
                      新
                    </Badge>
                  </CardAction>
                ) : null}
              </CardHeader>
            </Card>
          </AlertDialogBody>

          <AlertDialogFooter>
            <AlertDialogCancel variant='outline'>キャンセル</AlertDialogCancel>
            <AlertDialogAction variant='accent' onClick={handleConfirmLeave}>
              ホストを移動
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
