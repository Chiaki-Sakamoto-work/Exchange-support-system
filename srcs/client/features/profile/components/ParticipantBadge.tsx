import type { profiles } from '@prisma/client';
import { Badge } from '@/components/ui/Badge';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/HoverCard';
import { UserBadge } from '@/features/users/components/UserBadge/UserBadge';
import { toUserBadgeViewModel } from '@/features/users/components/UserBadge/UserBadge.viewmodel';
import { getDisplayName } from '@/features/users/lib/profile';
import type { Participant } from '@/types';

interface ParticipantBadgeProps {
  participant: Participant;
  isOpen: boolean; // 親から「開いているか」を受け取る
  onHover: () => void; // 乗ったことを親に伝える
  onLeave: () => void; // 外れたことを親に伝える
}

export const ParticipantBadge = ({
  participant,
  isOpen,
  onHover,
  onLeave,
}: ParticipantBadgeProps) => {
  const profile = participant.profiles;

  const userProfile = profile as profiles & {
    departments?: { name: string } | null;
  };

  return (
    <HoverCard open={isOpen}>
      <HoverCardTrigger asChild>
        <button
          type='button'
          data-detail-participant-control='true'
          className='cursor-pointer text-left' // ※Tailwindを使っていればbuttonのデザインはリセットされるので、spanと同じ見た目になります
          onMouseEnter={onHover}
          onMouseLeave={onLeave}
        >
          <UserBadge
            variant={'secondary'}
            user={toUserBadgeViewModel(profile)}
          />
        </button>
      </HoverCardTrigger>

      <HoverCardContent
        side='left'
        // 🌟 追加1：インラインスタイルで「マウスブロック」を強制解除
        style={{ pointerEvents: 'none' }}
        // 🌟 追加2：Tailwind側も「!」をつけて強制適用（!pointer-events-none）
        className='!pointer-events-none w-auto min-w-56 max-w-72 p-4 flex flex-col gap-3 z-50 shadow-md bg-background'
      >
        <div className='flex items-center gap-3'>
          <div className='flex flex-col'>
            <span className='font-bold text-sm'>{getDisplayName(profile)}</span>
            <span className='text-xs text-muted-foreground mt-0.5'>
              {/* 🌟 修正1-B：anyを消して、上で作った userProfile を使う */}
              {userProfile?.departments?.name
                ? `${userProfile.departments.name} / `
                : ''}
              {profile?.user_type || '社員'}
            </span>
          </div>
        </div>

        {profile?.bio && (
          <div className='text-xs text-foreground border-t border-border pt-3 whitespace-pre-wrap'>
            {profile.bio}
          </div>
        )}

        {profile?.allergies && profile.allergies.length > 0 && (
          <div className='flex flex-wrap gap-1 mt-1'>
            {profile.allergies.map((allergy) => (
              <Badge
                key={`${participant.user_id}-${allergy}`}
                variant='destructive'
                size='sm'
                className='text-[10px] px-1 py-0'
              >
                {allergy}
              </Badge>
            ))}
          </div>
        )}
      </HoverCardContent>
    </HoverCard>
  );
};
