import { Button } from '@/components/ui/Button';
import {
  DialogBody,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/Dialog';
import type { Room } from '@/types';
import { EventForm } from './EventForm';

type EventEditDialogContentProps = {
  eventData: Room;
  onSuccess: () => void;
  onCancel: () => void;
};

export const EventEditDialogContent = ({
  eventData,
  onCancel,
  onSuccess,
}: EventEditDialogContentProps) => {
  return (
    <>
      <DialogHeader>
        <DialogTitle>{eventData.title}を編集</DialogTitle>
        <DialogDescription>内容を更新できます</DialogDescription>
      </DialogHeader>
      <DialogBody className='-mx-6 px-6'>
        <EventForm
          roomId={eventData.id}
          initialData={eventData}
          onSuccess={onSuccess}
        />
        <Button
          type='button'
          variant='outline'
          className='mt-4 w-full'
          onClick={onCancel}
        >
          キャンセル
        </Button>
      </DialogBody>
    </>
  );
};
