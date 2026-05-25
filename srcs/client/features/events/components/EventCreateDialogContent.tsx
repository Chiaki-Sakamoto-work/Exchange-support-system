import {
  DialogBody,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/Dialog';
import { EventForm } from './EventForm';

type EventCreateDialogContentProps = {
  onSuccess: () => void;
};

export const EventCreateDialogContent = ({
  onSuccess,
}: EventCreateDialogContentProps) => {
  return (
    <>
      <DialogHeader>
        <DialogTitle>イベントを作成</DialogTitle>
        <DialogDescription>
          新しいイベントの情報を入力してください
        </DialogDescription>
      </DialogHeader>
      <DialogBody>
        <EventForm onSuccess={onSuccess} />
      </DialogBody>
    </>
  );
};
