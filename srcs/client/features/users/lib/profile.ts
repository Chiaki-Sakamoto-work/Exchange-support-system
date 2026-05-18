import type { profiles } from '@prisma/client';

export const isNewRecruit = (profile: profiles | null) =>
  profile?.user_type === '新入社員';

export const getDisplayName = (profile: profiles | null) =>
  profile?.username ?? '名無しさん';

export const getFallback = (profile: profiles | null) =>
  getDisplayName(profile).slice(0, 1).toUpperCase();
