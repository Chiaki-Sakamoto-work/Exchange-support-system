import type * as React from 'react';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';
import { UserAvatar } from './UserAvatar';

type UserBadgeVariant = 'default' | 'accept' | 'destructive' | 'secondary';
type UserBadgeLeadingVisual = 'avatar' | 'dot';

type UserBadgeUser = {
  name: string;
  avatarUrl?: string | null;
  isNewRecruit?: boolean;
};

type UserBadgeProps = {
  user: UserBadgeUser;
  variant?: UserBadgeVariant;
  label?: React.ReactNode;
  leadingVisual?: UserBadgeLeadingVisual;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  className?: string;
};

const userBadgeVariantClasses: Record<UserBadgeVariant, string> = {
  default: '',
  accept: 'bg-accent text-accent-foreground hover:bg-accent/80',
  destructive:
    'bg-destructive text-destructive-foreground hover:bg-destructive/85',
  secondary: '',
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

function UserBadge({
  user,
  variant = 'default',
  label,
  leadingVisual = 'avatar',
  onClick,
  className,
}: UserBadgeProps) {
  const avatarSpacingClass = leadingVisual === 'avatar' ? 'pl-1' : undefined;

  if (onClick) {
    return (
      <Badge
        asChild
        variant={badgeVariantByUserBadgeVariant[variant]}
        size='sm'
        className={cn(
          'cursor-pointer transition-colors',
          avatarSpacingClass,
          userBadgeVariantClasses[variant],
          className,
        )}
      >
        <button type='button' onClick={onClick}>
          <UserBadgeContent
            label={label}
            leadingVisual={leadingVisual}
            user={user}
          />
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
        avatarSpacingClass,
        userBadgeVariantClasses[variant],
        className,
      )}
    >
      <UserBadgeContent
        label={label}
        leadingVisual={leadingVisual}
        user={user}
      />
    </Badge>
  );
}

function UserBadgeContent({
  user,
  label,
  leadingVisual,
}: {
  user: UserBadgeUser;
  label?: React.ReactNode;
  leadingVisual: UserBadgeLeadingVisual;
}) {
  return (
    <>
      {leadingVisual === 'avatar' ? (
        <UserAvatar
          size='sm'
          name={user.name}
          imageSrc={user.avatarUrl ?? undefined}
          fallbackClassName={
            user.isNewRecruit ? 'bg-accent text-accent-foreground' : undefined
          }
        />
      ) : (
        <span
          aria-hidden='true'
          className={cn(
            'size-1.5 shrink-0 rounded-full',
            user.isNewRecruit ? 'bg-accent' : 'bg-muted-foreground',
          )}
        />
      )}
      {label ?? user.name}
      {user.isNewRecruit ? (
        <Badge variant='accent' size='xs'>
          新
        </Badge>
      ) : null}
    </>
  );
}

export type {
  UserBadgeLeadingVisual,
  UserBadgeProps,
  UserBadgeUser,
  UserBadgeVariant,
};
export { UserBadge };
