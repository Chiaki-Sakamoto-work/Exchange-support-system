import { Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent } from '@/components/ui/Card';
import { cn } from '@/lib/utils';

interface WelfareStatusProps {
  is_support_used: boolean | null;
}

export const WelfareStatus = ({ is_support_used }: WelfareStatusProps) => {
  const isSupportUsed = is_support_used === true;

  return (
    <Card className='shadow-none! min-h-0!'>
      <CardContent>
        <div className='flex justify-between items-center mb-4'>
          <div className='flex items-center gap-2'>
            <Sparkles className='w-4 h-4' />
            <span className='text-xs'>5月の福利厚生制度</span>
          </div>
          <span className='text-xs'>利用状況</span>
        </div>

        <Card
          variant='default shadow-none'
          className={cn(
            'min-h-0! border! py-2.5!',
            isSupportUsed
              ? 'bg-accent/[0.08]! border-accent/[0.4]!'
              : 'bg-muted! border-border!',
          )}
        >
          <CardContent className='flex-row! justify-between! items-center! text-foreground! w-full!'>
            <span className='text-sm'>飲み会補助</span>
            <Badge variant={isSupportUsed ? 'accent' : 'secondary'} size='sm'>
              {isSupportUsed ? '利用済み' : '未利用'}
            </Badge>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};
