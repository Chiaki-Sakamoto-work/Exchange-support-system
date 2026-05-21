import { ChevronRight, PenBox, UsersRound } from 'lucide-react';
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
import { relative } from 'node:path';

export type EventCardProps = {
  title: string;
  shop: string;
  date: string;
  onClick?: () => void;
  tags: { id: number; name: string }[];
  participants: string;
  icon?: 'show' | 'edit';
  ownerProfile?: { image?: string; name: string };
  isOngoing?: boolean;
};

const CARD_ICON = {
  show: { icon: ChevronRight, size: 'size-5' },
  edit: { icon: PenBox, size: 'size-4' },
};

export const EventCard = ({
  title,
  shop,
  date,
  onClick,
  tags,
  participants,
  ownerProfile,
  icon = 'show',
  isOngoing = false,
}: EventCardProps) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault(); // スペースで画面がスクロールするのを防ぐ
      onClick?.();
    }
  };
  const Icon = CARD_ICON[icon];
  return (
    <Card
      role='button'
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onClick={onClick}
      className={cn(
        'cursor-pointer',
        'hover:scale-[1.02] focus-visible:scale-[1.02]',
        'active:scale-[0.98]',
        'focus-visible:outline-none',
        'h-36.5 relative overflow-hidden',
        isOngoing ? 'border-2 border-green-500/70' : ''
      )}
      variant='default'
    >
      <CardHeader className='flex flex-row items-center gap-4'>
        {ownerProfile && (
          <UserAvatar
            name={ownerProfile.name}
            imageSrc={ownerProfile.image}
            size='default'
            className='rounded shrink-0'
            variant='default'
          />
        )}
        <div className='flex-1 min-w-0'>
          <CardTitle className='flex items-center gap-2 min-w-0'>
            <span className='truncate' title={title}>
              {title}
            </span>

            {isOngoing && (
              <Badge 
                variant='accent' 
                size='sm' 
                className='bg-green-500 px-1.5 py-0 text-[10px] shrink-0'
              >
                開催中
              </Badge>
            )}
          </CardTitle>
          <CardDescription>{shop}</CardDescription>
        </div>
        <CardAction>
          <Icon.icon className={cn(Icon.size, 'text-muted-foreground')} />
        </CardAction>
      </CardHeader>

      <CardContent className='flex flex-row flex-wrap gap-2 min-h-6'>
        {tags?.map((tag) => (
          <Badge key={tag.id} variant='secondary' size='sm'>
            {tag.name}
          </Badge>
        ))}
      </CardContent>

      <CardFooter className='flex flex-row justify-between items-center w-full'>
        <div>{date}</div>
        <div className='flex items-center gap-1.5'>
          <UsersRound className='h-4 w-4' />
          {participants}
        </div>
      </CardFooter>
    </Card>
  );
};
