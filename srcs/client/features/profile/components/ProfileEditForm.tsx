'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import type { departments } from '@prisma/client';
import { Building2, CircleAlert, Sparkles, UserRoundCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { KeyboardEvent } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { RadioCard } from '@/components/ui/RadioCard';
import { RadioGroup } from '@/components/ui/RadioGroup';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { cn } from '@/lib/utils';
import { updateProfile } from '../actions/profile';
import { type ProfileFormValues, profileSchema } from '../schemas/profile';

export interface ProfileEditFormProps {
  initialData: ProfileFormValues & {
    id: string;
    email: string;
    avatar_url: string | null;
  };
  departments: Pick<departments, 'id' | 'name'>[];
}

const ALLERGY_OPTIONS = [
  '卵',
  '乳製品',
  '小麦',
  'そば',
  '落花生',
  'えび',
  'かに',
  'アーモンド',
  'くるみ',
];

export function ProfileEditForm({
  initialData,
  departments,
}: ProfileEditFormProps) {
  const router = useRouter();

  // 1. フォームの初期化
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { isSubmitting },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: initialData.username || '',
      bio: initialData.bio || '',
      department_id: initialData.department_id,
      user_type: initialData.user_type,
      allergies: initialData.allergies || [],
      is_support_used: initialData.is_support_used || false,
    },
  });

  // 2. 現在選択されているアレルギーをリアルタイムで監視
  const selectedAllergies = watch('allergies') || [];
  const userName = watch('username') || '';
  const isSupportUsed = watch('is_support_used') || false;
  const userType = watch('user_type') || '一般社員';
  const departmentId = watch('department_id');

  // 3. チップをクリックした時の追加/削除ロジック（ここが抜けていた部分です）
  const toggleAllergy = (allergy: string) => {
    const current = [...selectedAllergies];
    const index = current.indexOf(allergy);

    if (index > -1) {
      current.splice(index, 1); // すでに選ばれていたら消す
    } else {
      current.push(allergy); // 選ばれていなければ足す
    }

    // react-hook-formの状態を更新
    setValue('allergies', current, { shouldDirty: true });
  };

  const toggleSupport = () => {
    setValue('is_support_used', !isSupportUsed, { shouldDirty: true });
  };

  const handleSupportKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggleSupport();
    }
  };

  // 4. 保存（送信）処理
  const onSubmit = async (data: ProfileFormValues) => {
    try {
      const result = await updateProfile(
        initialData.id,
        initialData.email,
        initialData.avatar_url,
        data,
      );
      if (result.success) {
        toast.success('プロフィールを保存しました！');
        router.push('/profile');
        router.refresh();
      } else {
        toast.error('保存に失敗しました');
      }
    } catch {
      toast.error('予期せぬエラーが発生しました');
    }
  };

  // 5. キャンセル処理
  const onCancel = () => {
    toast.info('編集をキャンセルしました');
    router.push('/profile');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-6'>
      <Card variant='default' className='space-y-2 shadow-none!'>
        <CardContent className='mx-auto'>
          <Avatar size='lg' variant='rounded-full'>
            <AvatarImage src='https://github.com/shadcn.png' />
            <AvatarFallback>{userName.charAt(0) || '無'}</AvatarFallback>
          </Avatar>
        </CardContent>
      </Card>

      <div className='flex flex-col gap-1'>
        <Label htmlFor='username'>名前</Label>
        <Input
          {...register('username')}
          placeholder='田中 太郎'
          className='border-backgroud'
        />
      </div>

      <div className='flex flex-col gap-1'>
        <Label htmlFor='bio'>紹介</Label>
        <Textarea
          id='bio'
          {...register('bio')}
          rows={3}
          placeholder='自己紹介を入力してください'
          className='w-full p-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-zinc-900 transition-all resize-none'
        />
      </div>

      <Card className='min-h-0! shadow-none!'>
        <CardContent>
          <CardDescription className='flex items-center text-sm gap-2'>
            <Building2 className='w-4 h-4' /> 部署
          </CardDescription>
          <CardContent>
            <Select
              value={departmentId ? String(departmentId) : 'none'}
              onValueChange={(value) => {
                setValue(
                  'department_id',
                  value === 'none' ? null : Number(value),
                  { shouldDirty: true },
                );
              }}
            >
              <SelectTrigger className='w-full bg-muted border'>
                <SelectValue placeholder='部署を選択してください' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='none'>所属なし</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept.id} value={String(dept.id)}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </CardContent>
      </Card>

      <Card className='min-h-0! shadow-none!'>
        <CardContent className='flex flex-col gap-1'>
          <CardDescription className='flex items-center text-sm gap-2'>
            <UserRoundCheck className='w-4 h-4' /> 区分
          </CardDescription>
          <RadioGroup
            defaultValue={userType}
            className='flex-row!'
            onValueChange={(value) =>
              setValue('user_type', value as '一般社員' | '新卒', {
                shouldDirty: true,
              })
            }
          >
            <RadioCard value='一般社員' className='h-auto! bg-muted py-3!'>
              <p className='text-sm!'>一般社員</p>
            </RadioCard>
            <RadioCard value='新卒' className='h-auto! bg-muted  py-3!'>
              <p>新卒</p>
            </RadioCard>
          </RadioGroup>
        </CardContent>
      </Card>

      <Card className='min-h-0! shadow-none!'>
        <CardContent className='flex flex-col gap-1'>
          <span className='flex items-center gap-2'>
            <CircleAlert className='size-4' />
            <span>
              アレルギー <span className='text-xs'>(任意・複数選択可)</span>
            </span>
          </span>

          <span className='text-xs text-zinc-400'>
            該当するものをすべて選んでください
          </span>

          <div className='flex flex-wrap gap-2 py-2'>
            {ALLERGY_OPTIONS.map((allergy) => {
              const isSelected = selectedAllergies.includes(allergy);
              return (
                <Badge
                  key={allergy}
                  onClick={() => toggleAllergy(allergy)}
                  className={`
                    cursor-pointer
                    ${
                      isSelected
                        ? 'bg-red-50 border-red-400 text-red-600 shadow-sm scale-105'
                        : 'bg-zinc-50 border-zinc-200 text-zinc-500 hover:border-zinc-300'
                    }`}
                >
                  {allergy}
                </Badge>
              );
            })}
          </div>
        </CardContent>
      </Card>

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
            onClick={toggleSupport}
            onKeyDown={handleSupportKeyDown}
            className={cn(
              'min-h-0! cursor-pointer select-none border! py-2.5! focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50',
              isSupportUsed
                ? 'bg-accent/[0.08]! border-accent/[0.4]!'
                : 'bg-muted! border-border!',
            )}
          >
            <CardContent className='flex-row! justify-between! items-center! text-foreground! w-full!'>
              <span className='text-sm'>飲み会補助</span>
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

      <div className='flex gap-4 pt-6'>
        <Button
          variant='secondary'
          className='flex-1 py-7 rounded-2xl font-bold'
          type='button'
          onClick={onCancel}
        >
          キャンセル
        </Button>
        <Button
          variant='default'
          className='flex-1 py-7 bg-zinc-950 text-white rounded-2xl font-bold'
          type='submit'
          disabled={isSubmitting}
        >
          {isSubmitting ? '保存中...' : '保存する'}
        </Button>
      </div>
    </form>
  );
}
