import { Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent } from '@/components/ui/Card';

export const WelfareStatus = () => {
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
          className='min-h-0! bg-accent/[0.08]! border! border-accent/[0.4]! py-2.5!'
        >
          <CardContent className='flex-row! justify-between! items-center! text-foreground! w-full!'>
            <span className='text-sm'>飲み会補助</span>
            <Badge variant='accent' size='sm'>
              利用済み
            </Badge>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};
