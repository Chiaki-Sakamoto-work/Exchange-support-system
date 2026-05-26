import { Sparkles } from 'lucide-react';
import type { KeyboardEvent } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent } from '@/components/ui/Card';
import { cn } from '@/lib/utils';

type ProfileWelfareSectionProps = {
  isSupportUsed: boolean;
  onKeyDown: (event: KeyboardEvent<HTMLDivElement>) => void;
  onToggleSupport: () => void;
};

export const ProfileWelfareSection = ({
  isSupportUsed,
  onKeyDown,
  onToggleSupport,
}: ProfileWelfareSectionProps) => {
  return (
    <Card className='shadow-none! min-h-0!'>
      <CardContent>
        <div className='flex justify-between items-center mb-4'>
          <div className='flex items-center gap-2'>
            <Sparkles className='w-4 h-4' />
            <span className='text-xs'>5月の福利厚生制度</span>
          </div>
          <span className='text-xs'>使ったらONにしてください</span>
        </div>

        <Card
          variant='default shadow-none'
          role='button'
          tabIndex={0}
          aria-pressed={isSupportUsed}
          onClick={onToggleSupport}
          onKeyDown={onKeyDown}
          className={cn(
            'min-h-0! cursor-pointer select-none border! py-2.5! focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50',
            isSupportUsed
              ? 'bg-accent/[0.08]! border-accent/[0.4]!'
              : 'bg-muted! border-border!',
          )}
        >
          <CardContent className='flex-row! justify-between! items-center! text-foreground! w-full!'>
            <span className='text-sm'>交流支援制度</span>
            <Badge
              variant={isSupportUsed ? 'accent' : 'secondary'}
              size='sm'
              className='w-20 cursor-pointer'
            >
              {isSupportUsed ? '利用済み' : '未利用'}
            </Badge>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};
