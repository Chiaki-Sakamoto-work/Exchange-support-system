import type { profiles } from '@prisma/client';
import { getDisplayName, isNewRecruit } from '../../lib/profile';

export type UserBadgeViewModel = {
  name: string;
  avatarUrl?: string | null;
  isNewRecruit?: boolean;
};

export const toUserBadgeViewModel = (
  profile: profiles | null,
): UserBadgeViewModel => ({
  name: getDisplayName(profile),
  avatarUrl: profile?.avatar_url ?? undefined,
  isNewRecruit: isNewRecruit(profile),
});
