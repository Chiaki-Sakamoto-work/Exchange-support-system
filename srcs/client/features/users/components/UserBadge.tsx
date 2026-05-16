import type * as React from 'react';
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';

type UserBadgeVariant = 'default' | 'accept' | 'destructive' | 'secondary';

type UserBadgeUser = {
  name: string;
  avatarUrl?: string | null;
  isNewRecruit?: boolean;
};

type UserBadgeProps = {
  user: UserBadgeUser;
  variant?: UserBadgeVariant;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  className?: string;
};

const userBadgeVariantClasses: Record<UserBadgeVariant, string> = {
  default: 'hover:bg-accent hover:text-accent-foreground',
  accept: 'bg-accent text-accent-foreground hover:bg-accent/80',
  destructive:
    'bg-destructive text-destructive-foreground hover:bg-destructive/85',
  secondary: 'hover:bg-accent hover:text-accent-foreground',
};

const badgeVariantByUserBadgeVariant: Record<
  UserBadgeVariant,
  React.ComponentProps<typeof Badge>['variant']
> = {
  default: 'default',
  accept: 'accent',
  destructive: 'destructive',
  secondary: 'secondary',
};

const getFallback = (name: string) => name.slice(0, 1).toUpperCase();

function UserBadge({
  user,
  variant = 'default',
  onClick,
  className,
}: UserBadgeProps) {
  if (onClick) {
    return (
      <Badge
        asChild
        variant={badgeVariantByUserBadgeVariant[variant]}
        size='sm'
        className={cn(
          'cursor-pointer transition-colors',
          userBadgeVariantClasses[variant],
          className,
        )}
      >
        <button type='button' onClick={onClick}>
          <UserBadgeContent user={user} />
        </button>
      </Badge>
    );
  }

  return (
    <Badge
      variant={badgeVariantByUserBadgeVariant[variant]}
      size='sm'
      className={cn(
        'cursor-pointer transition-colors',
        userBadgeVariantClasses[variant],
        className,
      )}
    >
      <UserBadgeContent user={user} />
    </Badge>
  );
}

function UserBadgeContent({ user }: { user: UserBadgeUser }) {
  return (
    <>
      <Avatar size='sm' variant='rounded-full'>
        <AvatarImage src={user.avatarUrl ?? undefined} />
        <AvatarFallback>{getFallback(user.name)}</AvatarFallback>
        {user.isNewRecruit ? (
          <AvatarBadge className='size-3 bg-accent text-[8px] font-bold text-accent-foreground'>
            新
          </AvatarBadge>
        ) : null}
      </Avatar>
      {user.name}
    </>
  );
}

export type { UserBadgeProps, UserBadgeUser, UserBadgeVariant };
export { UserBadge };
