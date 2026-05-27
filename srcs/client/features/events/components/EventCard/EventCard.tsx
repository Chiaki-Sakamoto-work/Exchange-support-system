import { ChevronRight, LogIn, PenBox, Plus, SquarePlus, Star, UserRoundPlus, UsersRound } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card';
import { UserAvatar } from '@/features/users/components/UserAvatar';
import { cn } from '@/lib/utils';
import type { EventCardViewModel } from './eventCard.viewmodel';

export type EventCardProps = {
  event: EventCardViewModel;
  onClick?: () => void;
  icon?: 'show' | 'edit' | 'plus';
};

const CARD_ICON = {
  plus: { icon: ChevronRight, size: 'size-5' },
  show: { icon: ChevronRight, size: 'size-5' },
  edit: { icon: PenBox, size: 'size-4' },
};

export const EventCard = ({
  event,
  onClick,
  icon = 'show',
}: EventCardProps) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault(); // スペースで画面がスクロールするのを防ぐ
      onClick?.();
    }
  };
  const Icon = CARD_ICON[icon];
  return (
    <div className='relative group'>
      <Card
        role='button'
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onClick={onClick}
        className={cn(
          'cursor-pointer',
          'group-hover:scale-[1.02] focus-visible:scale-[1.02]',
          'active:scale-[0.98]',
          'focus-visible:outline-none',
          'h-36.5 relative overflow-hidden',
          event.isOngoing ? 'border-2 border-green-500/70' : '',
        )}
        variant='default'
      >
        <CardHeader className='flex flex-row items-center gap-4'>
          {event.ownerProfile && (
            <UserAvatar
              name={event.ownerProfile.name}
              imageSrc={event.ownerProfile.image}
              size='default'
              className='rounded shrink-0'
              variant='default'
            />
          )}
          <div className='flex-1 min-w-0'>
            <CardTitle className='flex items-center gap-2 min-w-0'>
              <span className='truncate' title={event.title}>
                {event.title}
              </span>

              {event.isOngoing && (
                <Badge variant='green' size='sm' className='text-[10px]'>
                  開催中
                </Badge>
              )}
              {event.hasNewRecruit && (
                <Badge
                  variant='accent'
                  size='sm'
                  className='text-[10px] flex flex-row items-center'
                >
                  <Star fill='white' className='w-1 h-1' />
                  <span>制度利用可</span>
                  <Star fill='white' className='w-1 h-1' />
                </Badge>
              )}
            </CardTitle>
            <CardDescription>{event.shop}</CardDescription>
          </div>
          <CardAction>
            <Icon.icon className={cn(Icon.size, 'text-muted-foreground')} />
          </CardAction>
        </CardHeader>

        <CardContent className='flex flex-row flex-wrap gap-2 min-h-6'>
          {event.tags?.map((tag) => (
            <Badge key={tag.id} variant='secondary' size='sm'>
              {tag.name}
            </Badge>
          ))}
        </CardContent>

        <CardFooter className='flex flex-row justify-between items-center w-full'>
          <div>{event.date}</div>
          <div className='flex items-center gap-1.5'>
            <UsersRound className='h-4 w-4' />
            {event.participants}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};
