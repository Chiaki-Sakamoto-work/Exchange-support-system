'use client';

import type { Room } from '@type';
import { DialogBody } from '@/components/ui/Dialog';
import { EventDetailAllergySection } from './EventDetailAllergySection';
import { EventDetailParticipantsSection } from './EventDetailParticipantsSection';
import { EventDetailSummarySection } from './EventDetailSummarySection';

type EventDetailContentProps = {
  eventData: Room;
};

export const EventDetailContent = ({ eventData }: EventDetailContentProps) => {
  return (
    <DialogBody className='flex flex-col gap-6'>
      <EventDetailSummarySection eventData={eventData} />
      <EventDetailParticipantsSection participants={eventData.user_rooms} />
      <EventDetailAllergySection participants={eventData.user_rooms} />
    </DialogBody>
  );
};
