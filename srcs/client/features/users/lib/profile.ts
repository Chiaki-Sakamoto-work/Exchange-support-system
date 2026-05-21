import type { profiles } from '@prisma/client';

export const isNewRecruit = (profile: profiles | null) =>
  isStringNewRecruit(profile?.user_type);

export const getDisplayName = (profile: profiles | null) =>
  profile?.username ?? '名無しさん';

export const getFallback = (profile: profiles | null) =>
  getDisplayName(profile).slice(0, 1).toUpperCase();

export const isStringNewRecruit = (userType: string | null | undefined) =>
  userType === '新卒';
