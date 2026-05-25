import { EventForm } from '@feature/events/components/EventForm';
import type { Room } from '@type';

type EventEditPanelProps = {
  eventData: Room;
  onSuccess: () => void;
  onCancel: () => void;
};

export const EventEditPanel = ({
  eventData,
  onCancel,
  onSuccess,
}: EventEditPanelProps) => {
  return (
    <div className='h-full flex flex-col gap-4 overflow-y-auto pr-1'>
      <div className='flex flex-col gap-1 pb-2 border-b border-zinc-200'>
        <h2 className='text-xl font-bold text-zinc-900'>
          {eventData.title}を編集
        </h2>
        <p className='text-sm text-zinc-500'>内容を更新できます</p>
      </div>
      <div className='flex-1'>
        <EventForm
          roomId={eventData.id}
          initialData={eventData}
          onSuccess={onSuccess}
          onCancel={onCancel}
        />
      </div>
    </div>
  );
};
