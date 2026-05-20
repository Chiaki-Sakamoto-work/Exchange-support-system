import type { profiles } from '@prisma/client';
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
import { Badge } from '@/components/ui/Badge';
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card';
import { UserAvatar } from '@/features/users/components/UserAvatar';
import { getDisplayName, isNewRecruit } from '@/features/users/lib/profile';

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
              <UserAvatar
                name={leaveDialogProfile?.username}
                imageSrc={leaveDialogProfile?.avatar_url ?? undefined}
                fallbackClassName={
                  isNewRecruit(leaveDialogProfile)
                    ? 'bg-accent text-accent-foreground'
                    : undefined
                }
              />
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
