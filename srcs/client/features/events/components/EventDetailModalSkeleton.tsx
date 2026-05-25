import { Card, CardContent } from '@/components/ui/Card';
import {
  DialogBody,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/Dialog';
import { SkeletonBlock } from '@/components/ui/SkeletonBlock';
import { cn } from '@/lib/utils';

export type EventDetailSkeletonMode = 'hosted' | 'joined' | 'explore';

type EventDetailSkeletonProps = {
  mode: EventDetailSkeletonMode;
};

type SkeletonTone = 'default' | 'panel';

const panelSkeletonClassName =
  'bg-zinc-300/45 ring-1 ring-zinc-400/10 before:via-white/35';

const PanelSkeletonBlock = ({ className }: { className?: string }) => (
  <SkeletonBlock className={cn(panelSkeletonClassName, className)} />
);

const EventDetailBodySkeleton = ({
  tone = 'default',
}: {
  tone?: SkeletonTone;
}) => {
  const Block = tone === 'panel' ? PanelSkeletonBlock : SkeletonBlock;

  return (
    <DialogBody className='flex flex-col gap-6'>
      <Card
        size='default'
        variant='secondary shadow-none'
        className='min-h-0! overflow-visible! py-2!'
      >
        <CardContent className='flex-none! gap-0'>
          {Array.from({ length: 3 }, (_, index) => (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: skeleton rows are static placeholders
              key={index}
              className={cn(
                'flex items-center gap-3 py-3',
                index < 2 && 'border-b border-border',
              )}
            >
              <Block className='size-4 shrink-0 rounded-md' />
              <Block className='h-4 w-14 rounded-md' />
              <Block className='ml-auto h-4 w-28 rounded-md' />
            </div>
          ))}
        </CardContent>
      </Card>

      <div className='flex flex-col gap-3'>
        <Block className='h-4 w-14 rounded-md' />
        <div className='flex flex-wrap gap-2'>
          <Block className='h-6 w-24 rounded-full' />
          <Block className='h-6 w-28 rounded-full' />
          <Block className='h-6 w-20 rounded-full' />
          <Block className='h-6 w-24 rounded-full' />
        </div>
      </div>
    </DialogBody>
  );
};

const EventDetailActionSkeleton = () => (
  <PanelSkeletonBlock className='absolute top-0 right-0 size-8 rounded-full' />
);

export const EventDetailPanelSkeleton = (_props: EventDetailSkeletonProps) => (
  <div
    aria-busy='true'
    className='h-full flex flex-col gap-6 overflow-y-auto pr-1 relative animate-in fade-in duration-300'
  >
    <span className='sr-only'>読み込み中</span>
    <div className='flex flex-col gap-1 pr-12'>
      <PanelSkeletonBlock className='h-7 w-3/5 rounded-md' />
      <PanelSkeletonBlock className='h-4 w-32 rounded-md' />
      <EventDetailActionSkeleton />
    </div>
    <EventDetailBodySkeleton tone='panel' />
  </div>
);

export const EventDetailModalSkeleton = ({
  mode,
}: EventDetailSkeletonProps) => (
  <div aria-busy='true' className='animate-in fade-in duration-300'>
    <span className='sr-only'>読み込み中</span>
    <DialogHeader className='gap-0.5'>
      <DialogTitle>
        <SkeletonBlock className='h-5 w-2/3 rounded-md' />
      </DialogTitle>
      <DialogDescription asChild>
        <SkeletonBlock className='h-4 w-32 rounded-md' />
      </DialogDescription>
      <SkeletonBlock
        className={cn(
          'absolute top-6 right-6 rounded-full',
          mode === 'explore' ? 'h-9 w-18' : 'size-8',
        )}
      />
    </DialogHeader>
    <EventDetailBodySkeleton />
  </div>
);
