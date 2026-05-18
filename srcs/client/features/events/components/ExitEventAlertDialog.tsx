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

type Props = {
  isLeaveDialogOpen: boolean;
  handleLeaveDialogOpenChange: (open: boolean) => void;
  handleConfirmLeave: React.MouseEventHandler<HTMLButtonElement>;
};

export const ExitEventAlertDialog = ({
  isLeaveDialogOpen,
  handleLeaveDialogOpenChange,
  handleConfirmLeave,
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

        {/* <AlertDialogBody>本当に退室しますか？</AlertDialogBody> */}

        <AlertDialogFooter>
          <AlertDialogCancel variant='outline'>キャンセル</AlertDialogCancel>
          <AlertDialogAction variant='destructive' onClick={handleConfirmLeave}>
            退室する
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
