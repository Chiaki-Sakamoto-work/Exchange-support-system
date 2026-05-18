import type { profiles } from '@prisma/client';
import type { MouseEventHandler } from 'react';
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
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card';

import {
  getDisplayName,
  getFallback,
  isNewRecruit,
} from '@/features/users/lib/profile';

type Props = {
  isLeaveDialogOpen: boolean;
  handleLeaveDialogOpenChange: (open: boolean) => void;
  handleConfirmLeave: React.MouseEventHandler<HTMLButtonElement>;
  leaveDialogProfile: profiles | null;
};

export const ExitParticipantAlertDialog = ({
  isLeaveDialogOpen,
  handleLeaveDialogOpenChange,
  handleConfirmLeave,
  leaveDialogProfile,
}: Props) => {
  return (
    <AlertDialog
      open={isLeaveDialogOpen}
      onOpenChange={handleLeaveDialogOpenChange}
    >
      <AlertDialogContent>
        <AlertDialogTitle className='text-xl'>退室の確認</AlertDialogTitle>
        <AlertDialogDescription>
          この操作は取り消せません。
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
                <CardDescription>さんを退室させます</CardDescription>
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
          <AlertDialogAction variant='destructive' onClick={handleConfirmLeave}>
            退室させる
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
