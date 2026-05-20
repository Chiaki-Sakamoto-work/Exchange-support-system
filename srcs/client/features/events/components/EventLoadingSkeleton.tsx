import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/Card';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/Dialog';
import { cn } from '@/lib/utils';

const SkeltonBlock = ({ className }: { className?: string }) => (
  <span className={cn('block rounded-full bg-muted', className)} />
);

type EventDetailLoadingSkeletonMode = 'hosted' | 'joined' | 'explore';

const EventCardSkelton = () => (
  <Card
    className='h-36.5 min-h-36.5 max-h-36.5 animate-pulse'
    variant='default'
  >
    <CardHeader className='flex flex-row items-center gap-4'>
      <SkeltonBlock className='size-10 shrink-0 rounded' />

      <div className='flex-1 space-y-2'>
        <SkeltonBlock className='h-4 w-3/5' />
        <SkeltonBlock className='h-3 w-2/5' />
      </div>
      <SkeltonBlock className='size-5 rounded' />
    </CardHeader>
    <CardContent className='flex min-h-6 flex-row flex-wrap gap-2'>
      <SkeltonBlock className='h-5 w-16' />
      <SkeltonBlock className='h-5 w-20' />
      <SkeltonBlock className='h-5 w-14' />
    </CardContent>

    <CardFooter className='flex w-full flex-row items-center justify-between'>
      <SkeltonBlock className='h-3 w-24' />
      <SkeltonBlock className='h-3 w-16' />
    </CardFooter>
  </Card>
);

export const EventListLoadingSkeleton = ({
  showHeader = false,
}: {
  showHeader?: boolean;
}) => (
  <div className='animate-in fade-in duration-300'>
    <span className='sr-only'>読み込み中</span>

    {showHeader && (
      <div className='mb-6 animate-pulse space-y-3'>
        <SkeltonBlock className='h-7 w-44 rounded-md' />
        <SkeltonBlock className='h-4 w-52 rounded-md' />
      </div>
    )}

    <div className='space-y-4'>
      {Array.from({ length: 3 }, (_, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: <this is only used skeleton>
        <EventCardSkelton key={index} />
      ))}
    </div>
  </div>
);

export const EventDetailLoadingSkeleton = ({
  mode,
}: {
  mode: EventDetailLoadingSkeletonMode;
}) => (
  <Dialog open={true}>
    <DialogContent
      preventOutsideClose
      showCloseButton={false}
      className='max-h-[80vh]'
    >
      <span className='sr-only'>読み込み中</span>

      <div className='animate-pulse'>
        <DialogHeader className='gap-0.5'>
          <DialogTitle>
            <SkeltonBlock className='h-5 w-2/3 rounded-md' />
          </DialogTitle>
          <DialogDescription>
            <SkeltonBlock className='h-4 w-32 rounded-md' />
          </DialogDescription>

          <SkeltonBlock
            className={cn(
              'absolute top-6 right-6 rounded-full',
              mode === 'explore' ? 'h-9 w-18' : 'size-8',
            )}
          />
        </DialogHeader>

        <DialogBody className='flex flex-col gap-6'>
          <Card
            size='default'
            variant='secondary shadow-none'
            className='min-h-0! overflow-visible! py-2!'
          >
            <CardContent className='flex-none! gap-0'>
              {Array.from({ length: 3 }, (_, index) => (
                <div
                  // biome-ignore lint/suspicious/noArrayIndexKey: <this is only used skeleton>
                  key={index}
                  className={cn(
                    'flex items-center gap-3 py-3',
                    index < 2 && 'border-b border-border',
                  )}
                >
                  <SkeltonBlock className='size-4 shrink-0 rounded-md' />
                  <SkeltonBlock className='h-4 w-14 rounded-md' />
                  <SkeltonBlock className='ml-auto h-4 w-28 rounded-md' />
                </div>
              ))}
            </CardContent>
          </Card>

          <div className='flex flex-col gap-3'>
            <SkeltonBlock className='h-4 w-14 rounded-md' />
            <div className='flex flex-wrap gap-2'>
              <SkeltonBlock className='h-8 w-24 rounded-full' />
              <SkeltonBlock className='h-8 w-28 rounded-full' />
              <SkeltonBlock className='h-8 w-20 rounded-full' />
              <SkeltonBlock className='h-8 w-24 rounded-full' />
            </div>
          </div>
        </DialogBody>
      </div>
    </DialogContent>
  </Dialog>
);

export const EventLoadingSkeleton = () => {
  return EventDetailLoadingSkeleton;
};
