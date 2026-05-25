import { SkeletonBlock } from '@/components/ui/SkeletonBlock';

const RESTAURANT_SKELETON_COUNT = 3;

const RestaurantRadioCardSkeletonItem = () => (
  <div className='h-[84px] w-[98%] rounded-[16px] bg-card px-6 py-4'>
    <div className='flex h-full items-center justify-between gap-4'>
      <div className='min-2-0 flex-1 space-y-2'>
        <div className='flex items-center gap-2'>
          <SkeletonBlock className='size-4 rounded-md' />
          <SkeletonBlock className='h-4 w-36 rounded-md' />
        </div>
        <div className='flex items-center gap-2'>
          <SkeletonBlock className='h-3 w-14 rounded-md' />
          <SkeletonBlock className='h-3 w-10 rounded-md' />
          <SkeletonBlock className='h-3 w-16 rounded-md' />
        </div>
        <div className='flex gap-1'>
          <SkeletonBlock className='h-5 w-12 rounded-full' />
          <SkeletonBlock className='h-5 w-14 rounded-full' />
          <SkeletonBlock className='h-5 w-10 rounded-full' />
        </div>
      </div>

      <SkeletonBlock className='size-6 shrink-0 rounded-full' />
    </div>
  </div>
);

export const RestaurantRadioCardSkeleton = () => (
  <div className='grid gap-2'>
    <span className='sr-only'>お店情報を読み込み中</span>
    {Array.from({ length: RESTAURANT_SKELETON_COUNT }, (_, index) => (
      // biome-ignore lint/suspicious/noArrayIndexKey: <skeleton only>
      <RestaurantRadioCardSkeletonItem key={index} />
    ))}
  </div>
);
