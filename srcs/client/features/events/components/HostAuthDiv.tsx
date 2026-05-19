'use client';

import type { profiles } from '@prisma/client';
import { ArrowLeftRight } from 'lucide-react';
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
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/HoverCard';
import { Label } from '@/components/ui/Label';
import { UserBadge } from '@/features/users/components/UserBadge';

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

interface Participant {
  id: string | number;
  profiles: profiles;
  name: string;
}
type HostAuthDivProps = {
  participants: Participant[];
  handleConfirm: (newHostId: string | number) => void;
};

export const HostAuthDiv = ({
  participants,
  handleConfirm,
}: HostAuthDivProps) => {
  const [selectedParticipant, setSelectedParticipant] = useState<Participant>();
  const [isTransferDialogOpen, setIsTransferDialogOpen] = useState(false);

  const shouldCollapse = participants.length > 7;
  const visibleParticipants = shouldCollapse
    ? participants.slice(0, 6)
    : participants;
  const overflowParticipants = shouldCollapse ? participants.slice(6) : [];
  const selectedProfile = selectedParticipant?.profiles ?? null;

  const handleSelectParticipant = (participant: Participant) => {
    setSelectedParticipant(participant);
    setIsTransferDialogOpen(true);
  };

  const handleConfirmTransfer = () => {
    if (selectedParticipant) {
      handleConfirm(selectedParticipant.id);
    }
    setIsTransferDialogOpen(false);
  };

  const renderParticipantBadge = (
    participant: Participant,
    variant: 'default' | 'secondary' = 'default',
  ) => {
    const profile = participant.profiles;

    return (
      <UserBadge
        key={`${participant.id}`}
        leadingVisual='dot'
        variant={variant}
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
          </AlertDialogBody>

          <AlertDialogFooter>
            <AlertDialogCancel variant='outline'>キャンセル</AlertDialogCancel>
            <AlertDialogAction variant='accent' onClick={handleConfirmTransfer}>
              ホストを移動
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
