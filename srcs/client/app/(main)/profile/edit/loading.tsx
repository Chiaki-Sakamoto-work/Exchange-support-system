import { ProfileEditLoadingSkeleton } from '@/features/profile/components/ProfileLoadingSkeleton';

export default function Loading() {
  return (
    <div className='min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-6'>
      <ProfileEditLoadingSkeleton />
    </div>
  );
}
