import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/Card';
import { cn } from '@/lib/utils';

const SkeletonBlock = ({ className }: { className?: string }) => (
  <div
    className={cn(
      'relative overflow-hidden rounded-full bg-muted',
      'before:absolute before:inset-0 before:-translate-x-full',
      'before:bg-linear-to-r before:from-transparent before:via-white/55 before:to-transparent',
      'before:motion-safe:animate-skeleton-gradient',
      className,
    )}
  />
);

const EventCardSkeleton = () => (
  <Card className='h-36.5' variant='default'>
    <CardHeader className='flex flex-row items-center gap-4'>
      <SkeletonBlock className='size-10 shrink-0 rounded-full' />

      <div className='flex-1 space-y-2'>
        <SkeletonBlock className='h-4 w-3/5' />
        <SkeletonBlock className='h-3 w-2/5' />
      </div>
      <SkeletonBlock className='size-5 rounded-md' />
    </CardHeader>
    <CardContent className='flex min-h-6 flex-row gap-2'>
      <SkeletonBlock className='h-6 w-16' />
      <SkeletonBlock className='h-6 w-20' />
      <SkeletonBlock className='h-6 w-14' />
    </CardContent>

    <CardFooter className='flex w-full flex-row items-center justify-between'>
      <SkeletonBlock className='h-3 w-24' />
      <SkeletonBlock className='h-3 w-16' />
    </CardFooter>
  </Card>
);

export const EventListLoadingSkeleton = ({
  showHeader = false,
  showTabs = false,
}: {
  showHeader?: boolean;
  showTabs?: boolean;
}) => (
  <div className='animate-in fade-in duration-300'>
    <span className='sr-only'>読み込み中</span>

    {showHeader && (
      <div className='mb-6 space-y-3'>
        <SkeletonBlock className='h-7 w-44 rounded-md' />
        <SkeletonBlock className='h-4 w-52 rounded-md' />
      </div>
    )}

    {showTabs && (
      <div className='mb-4 space-y-4'>
        <SkeletonBlock className='h-12 w-full rounded-2xl' />
        <SkeletonBlock className='mx-auto h-9 w-64 rounded-full' />
      </div>
    )}

    <div className='space-y-4'>
      {Array.from({ length: 3 }, (_, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: <this is only used skeleton>
        <EventCardSkeleton key={index} />
      ))}
    </div>
  </div>
);

export const EventDetailLoadingSkeleton = () => (
  <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4'>
    <span className='sr-only'>読み込み中</span>

    <Card className='w-full max-w-md p-5' variant='default'>
      <div className='mb-5 flex items-start gap-3'>
        <SkeletonBlock className='size-10 shrink-0 rounded-md' />
        <div className='flex-1 space-y-3'>
          <SkeletonBlock className='h-5 w-2/3 rounded-md' />
          <SkeletonBlock className='h-3 w-1/2 rounded-md' />
        </div>
        <SkeletonBlock className='size-8 rounded-md' />
      </div>

      <div className='space-y-3'>
        <SkeletonBlock className='h-14 w-full rounded-xl' />
        <SkeletonBlock className='h-14 w-full rounded-xl' />
        <SkeletonBlock className='h-14 w-full rounded-xl' />
      </div>

      <div className='mt-5 flex gap-2'>
        <SkeletonBlock className='h-9 flex-1 rounded-md' />
        <SkeletonBlock className='h-9 flex-1 rounded-md' />
      </div>
    </Card>
  </div>
);

export const EventLoadingSkeleton = () => {
  return EventDetailLoadingSkeleton;
};
