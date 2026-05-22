import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/Dialog';
import { cn } from '@/lib/utils';
import type { Room } from '@/types';
import { EventForm } from './EventForm';

type EventEditDialogContentProps = {
<<<<<<< HEAD
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
=======
  className?: string;
  eventData: Room;
  onSuccess: () => void;
  onOpenChange: (arg0: boolean) => void;
};

export const EventEditDialogContent = ({
  className,
  eventData,
  onOpenChange,
  onSuccess,
}: EventEditDialogContentProps) => {
  return (
    <Dialog open={true} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className={cn('max-h-[80vh] -mx-6 px-6', className)}
      >
        <DialogHeader>
          <DialogTitle>{eventData.title}を編集</DialogTitle>
          <DialogDescription>内容を更新できます</DialogDescription>
        </DialogHeader>
        <DialogBody className='-mx-6 px-6'>
          <EventForm
            roomId={eventData.id}
            initialData={eventData || undefined}
            onSuccess={onSuccess}
          />
        </DialogBody>
      </DialogContent>
    </Dialog>
>>>>>>> eb97202 (refactor: ~ing (too many error now))
  );
};
