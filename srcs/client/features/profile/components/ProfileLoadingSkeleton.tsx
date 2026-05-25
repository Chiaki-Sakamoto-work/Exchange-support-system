import { Card, CardContent, CardDescription } from '@/components/ui/Card';
import { SkeletonBlock } from '@/components/ui/SkeletonBlock';

const ProfileHeaderLoadingSkeleton = () => (
  <Card className='shadow-none!'>
    <CardContent>
      <div className='flex flex-col items-center'>
        <SkeletonBlock className='size-24 rounded-full' />
        <SkeletonBlock className='mt-4 h-6 w-32 rounded-md' />
        <SkeletonBlock className='mt-2 mb-4 h-4 w-48 rounded-md' />
        <div className='flex w-full flex-col items-center gap-2'>
          <SkeletonBlock className='h-4 w-4/5 max-w-72 rounded-md' />
          <SkeletonBlock className='h-4 w-3/5 max-w-56 rounded-md' />
        </div>
        <div className='mt-4 mb-4 flex gap-2'>
          <SkeletonBlock className='h-7 w-20 rounded-full' />
          <SkeletonBlock className='h-7 w-24 rounded-full' />
        </div>
        <div className='mb-4 flex flex-wrap justify-center gap-2'>
          <SkeletonBlock className='h-7 w-24 rounded-full' />
          <SkeletonBlock className='h-7 w-28 rounded-full' />
        </div>
      </div>
    </CardContent>
  </Card>
);

const WelfareStatusLoadingSkeleton = () => (
  <Card className='shadow-none! min-h-0!'>
    <CardContent>
      <div className='mb-4 flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <SkeletonBlock className='size-4 rounded-md' />
          <SkeletonBlock className='h-4 w-28 rounded-md' />
        </div>
        <SkeletonBlock className='h-4 w-14 rounded-md' />
      </div>

      <Card variant='default shadow-none' className='min-h-0! border! py-2.5!'>
        <CardContent className='flex-row! items-center! justify-between! text-foreground! w-full!'>
          <SkeletonBlock className='h-4 w-20 rounded-md' />
          <SkeletonBlock className='h-6 w-16 rounded-full' />
        </CardContent>
      </Card>
    </CardContent>
  </Card>
);

const ProfileActionsLoadingSkeleton = () => (
  <div className='mt-2 flex flex-col gap-3'>
    <SkeletonBlock className='h-12 w-full rounded-2xl' />
    <SkeletonBlock className='h-12 w-full rounded-2xl' />
  </div>
);

export const ProfileLoadingSkeleton = () => (
  <div aria-busy='true' className='animate-in fade-in duration-300'>
    <span className='sr-only'>読み込み中</span>
    <div className='flex flex-col gap-4 px-4'>
      <ProfileHeaderLoadingSkeleton />
      <WelfareStatusLoadingSkeleton />
      <ProfileActionsLoadingSkeleton />
    </div>
  </div>
);

const FormFieldLoadingSkeleton = ({
  multiline = false,
}: {
  multiline?: boolean;
}) => (
  <div className='flex flex-col gap-1'>
    <SkeletonBlock className='h-4 w-16 rounded-md' />
    <SkeletonBlock
      className={
        multiline ? 'h-24 w-full rounded-[14px]' : 'h-10 w-full rounded-lg'
      }
    />
  </div>
);

const ProfileEditCardLoadingSkeleton = ({
  rows = 1,
  chips = 0,
}: {
  rows?: number;
  chips?: number;
}) => (
  <Card className='min-h-0! shadow-none!'>
    <CardContent className='flex flex-col gap-3'>
      <CardDescription className='flex items-center gap-2'>
        <SkeletonBlock className='size-4 rounded-md' />
        <SkeletonBlock className='h-4 w-16 rounded-md' />
      </CardDescription>
      {Array.from({ length: rows }, (_, index) => (
        <SkeletonBlock
          // biome-ignore lint/suspicious/noArrayIndexKey: this is only used for fixed skeleton rows
          key={index}
          className='h-10 w-full rounded-lg'
        />
      ))}
      {chips > 0 && (
        <div className='flex flex-wrap gap-2 py-2'>
          {Array.from({ length: chips }, (_, index) => (
            <SkeletonBlock
              // biome-ignore lint/suspicious/noArrayIndexKey: this is only used for fixed skeleton chips
              key={index}
              className='h-7 w-16 rounded-full'
            />
          ))}
        </div>
      )}
    </CardContent>
  </Card>
);

export const ProfileEditLoadingSkeleton = () => (
  <div aria-busy='true' className='animate-in fade-in duration-300'>
    <span className='sr-only'>読み込み中</span>
    <div className='flex flex-col gap-6'>
      <Card variant='default' className='space-y-2 shadow-none!'>
        <CardContent className='mx-auto'>
          <SkeletonBlock className='size-24 rounded-full' />
        </CardContent>
      </Card>

      <FormFieldLoadingSkeleton />
      <FormFieldLoadingSkeleton multiline />
      <ProfileEditCardLoadingSkeleton />
      <ProfileEditCardLoadingSkeleton rows={2} />
      <ProfileEditCardLoadingSkeleton chips={9} />
      <WelfareStatusLoadingSkeleton />

      <div className='flex gap-4 pt-6'>
        <SkeletonBlock className='h-14 flex-1 rounded-2xl' />
        <SkeletonBlock className='h-14 flex-1 rounded-2xl' />
      </div>
    </div>
  </div>
);
