import { ChevronRight, UsersRound } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
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
import { cn } from '@/lib/utils';

export type EventCardProps = {
  title: string;
  shop: string;
  date: string;
  onClick?: () => void;
  tags: { id: number; name: string }[];
  participants: string;
  ownerProfile?: { image?: string; name: string };
};

export const EventCard = ({
  title,
  shop,
  date,
  onClick,
  tags,
  participants,
  ownerProfile,
}: EventCardProps) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault(); // スペースで画面がスクロールするのを防ぐ
      onClick?.();
    }
  };

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
      )}
    >
      <CardHeader className='flex flex-row items-center gap-4'>
        {ownerProfile && (
          <Avatar>
            <AvatarImage src={ownerProfile.image} alt={ownerProfile.name} />
            <AvatarFallback>{ownerProfile.name.charAt(0)}</AvatarFallback>
          </Avatar>
        )}
        <div className='flex-1'>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{shop}</CardDescription>
        </div>
        <CardAction>
          {/* <Button variant='ghost' size='icon'> */}
          <ChevronRight className='h-5 w-5 text-muted-foreground' />
          {/* </Button> */}
        </CardAction>
      </CardHeader>

      <CardContent className='flex flex-wrap gap-2'>
        {tags?.map((tag) => (
          <Badge key={tag.id} variant='secondary'>
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
