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
import { Delete, Trash2, Undo2 } from 'lucide-react';

type Props = {
  isDeleteDialogOpen: boolean;
  handleDeleteDialogOpenChange: (open: boolean) => void;
  handleConfirmDelete: React.MouseEventHandler<HTMLButtonElement>;
  disabled: boolean;
};

export const DeleteEventAlertDialog = ({
  isDeleteDialogOpen,
  handleDeleteDialogOpenChange,
  handleConfirmDelete,
  disabled,
}: Props) => {
  return (
    <AlertDialog
      open={isDeleteDialogOpen}
      onOpenChange={handleDeleteDialogOpenChange}
    >
      <AlertDialogContent>
        <AlertDialogTitle className='text-xl'>削除の確認</AlertDialogTitle>
        <AlertDialogDescription>
          この操作は取り消せません。
        </AlertDialogDescription>

        <AlertDialogBody>
          <span>この予定を削除してもよろしいですか？</span>
          <span>削除すると参加者全員に反映されます。</span>
        </AlertDialogBody>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={disabled} variant='outline'>
            <Undo2/>
            キャンセル
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={disabled}
            variant='destructive'
            onClick={handleConfirmDelete}
          >
            <Trash2/>
            削除する
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
