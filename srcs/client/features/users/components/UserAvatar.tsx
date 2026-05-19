import type React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import { cn } from '@/lib/utils';

type UserAvatarProps = {
  name?: string | null;
  imageSrc?: string | null;
  imageAlt?: string;
  size?: React.ComponentProps<typeof Avatar>['size'];
  variant?: React.ComponentProps<typeof Avatar>['variant'];
  className?: string;
  imageClassName?: string;
  fallbackClassName?: string;
};

const getFallbackText = (name?: string | null) =>
  name?.trim().slice(0, 1).toUpperCase() || '?';

export function UserAvatar({
  name,
  imageSrc,
  imageAlt,
  size = 'default',
  variant = 'rounded-full',
  className,
  imageClassName,
  fallbackClassName,
}: UserAvatarProps) {
  const displayName = name?.trim() || 'User';

  return (
    <Avatar size={size} variant={variant} className={className}>
      <AvatarImage
        src={imageSrc ?? undefined}
        alt={imageAlt ?? displayName}
        className={imageClassName}
      />
      <AvatarFallback className={cn('font-bold', fallbackClassName)} />
      {getFallbackText(name)}
    </Avatar>
  );
}
