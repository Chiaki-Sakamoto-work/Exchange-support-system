import type { UseFormRegisterReturn } from 'react-hook-form';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Textarea } from '@/components/ui/Textarea';

type ProfileBasicInfoSectionProps = {
  usernameField: UseFormRegisterReturn<'username'>;
  bioField: UseFormRegisterReturn<'bio'>;
};

export const ProfileBasicInfoSection = ({
  usernameField,
  bioField,
}: ProfileBasicInfoSectionProps) => {
  return (
    <>
      <div className='flex flex-col gap-1'>
        <Label htmlFor='username'>名前</Label>
        <Input
          {...usernameField}
          placeholder='田中 太郎'
          className='border-backgroud'
        />
      </div>

      <div className='flex flex-col gap-1'>
        <Label htmlFor='bio'>紹介</Label>
        <Textarea
          id='bio'
          {...bioField}
          rows={3}
          placeholder='自己紹介を入力してください'
          className='w-full p-4 bg-card border border-zinc-200 rounded-[14px] focus:outline-none focus:ring-2 focus:ring-zinc-900 transition-all resize-none'
        />
      </div>
    </>
  );
};
