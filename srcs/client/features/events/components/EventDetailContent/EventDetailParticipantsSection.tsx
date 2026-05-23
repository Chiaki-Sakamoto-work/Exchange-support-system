'use client';

import type { Participant } from '@type';
import { useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent } from '@/components/ui/Card';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/HoverCard';
import { ParticipantBadge } from '@/features/profile/components/ParticipantBadge';

type EventDetailParticipantsSectionProps = {
  participants: Participant[];
};

export const EventDetailParticipantsSection = ({
  participants,
}: EventDetailParticipantsSectionProps) => {
  const [hoveredUserId, setHoveredUserId] = useState<string | null>(null);

  const shouldCollapseParticipants = participants.length > 7;
  const visibleParticipants = shouldCollapseParticipants
    ? participants.slice(0, 6)
    : participants;
  const overflowParticipants = shouldCollapseParticipants
    ? participants.slice(6)
    : [];

  const renderParticipantBadge = (participant: Participant) => {
    const participantId = `${participant.room_id}-${participant.user_id}`;

    return (
      <ParticipantBadge
        key={`detail-${participantId}`}
        participant={participant}
        isOpen={hoveredUserId === participantId}
        onHover={() => setHoveredUserId(participantId)}
        onLeave={() =>
          setHoveredUserId((prev) => (prev === participantId ? null : prev))
        }
      />
    );
  };

  const renderOverflowParticipants = () => {
    if (overflowParticipants.length === 0) {
      return null;
    }

    return (
      <HoverCard openDelay={120} closeDelay={120}>
        <HoverCardTrigger asChild>
          <Badge
            asChild
            variant='secondary'
            size='sm'
            className='cursor-pointer'
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
                  renderParticipantBadge(participant),
                )}
              </div>
            </CardContent>
          </Card>
        </HoverCardContent>
      </HoverCard>
    );
  };

  return (
    <div className='flex flex-col gap-3'>
      <p className='text-muted-foreground'>参加者</p>
      <div className='flex flex-wrap gap-2'>
        {visibleParticipants.map((participant) =>
          renderParticipantBadge(participant),
        )}
        {renderOverflowParticipants()}
      </div>
    </div>
  );
};
