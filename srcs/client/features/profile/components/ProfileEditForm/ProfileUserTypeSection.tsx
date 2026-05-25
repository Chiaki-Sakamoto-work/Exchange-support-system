import { UserRoundCheck } from 'lucide-react';
import { Card, CardContent, CardDescription } from '@/components/ui/Card';
import { RadioCard } from '@/components/ui/RadioCard';
import { RadioGroup } from '@/components/ui/RadioGroup';
import type { UserType } from '@/types/user';

type ProfileUserTypeSectionProps = {
  userType: NonNullable<UserType>;
  onUserTypeChange: (value: NonNullable<UserType>) => void;
};

export const ProfileUserTypeSection = ({
  userType,
  onUserTypeChange,
}: ProfileUserTypeSectionProps) => {
  return (
    <Card className='min-h-0! shadow-none!'>
      <CardContent className='flex flex-col gap-2'>
        <CardDescription className='flex items-center text-sm gap-2'>
          <UserRoundCheck className='w-4 h-4' /> 区分
        </CardDescription>
        <RadioGroup
          defaultValue={userType}
          className='flex-row!'
          onValueChange={(value) =>
            onUserTypeChange(value as NonNullable<UserType>)
          }
        >
          <RadioCard
            value='一般社員'
            className='h-auto! bg-muted py-3!  data-[state=checked]:text-foreground'
          >
            <p className='text-sm!'>一般社員</p>
          </RadioCard>
          <RadioCard
            value='新卒'
            className='h-auto! bg-muted  py-3!  data-[state=checked]:text-foreground'
          >
            <p>新卒</p>
          </RadioCard>
        </RadioGroup>
      </CardContent>
    </Card>
  );
};
