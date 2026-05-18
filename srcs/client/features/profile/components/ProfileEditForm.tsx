'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import { updateProfile } from '../actions/profile';
import { type ProfileFormValues, profileSchema } from '../schemas/profile';

export interface ProfileEditFormProps {
  initialData: ProfileFormValues & {
    id: string;
  };
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

export function ProfileEditForm({ initialData }: ProfileEditFormProps) {
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

  // 4. 保存（送信）処理
  const onSubmit = async (data: ProfileFormValues) => {
    try {
      const result = await updateProfile(initialData.id, data);
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
    <form
      onSubmit={handleSubmit(onSubmit)}
      className='space-y-8 bg-white p-6 rounded-3xl border border-zinc-200'
    >
      <div className='space-y-2'>
        <label htmlFor='username' className='text-sm font-bold text-zinc-700'>
          名前
        </label>
        <input
          {...register('username')}
          placeholder='田中 太郎'
          className='w-full p-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-zinc-900 transition-all'
        />
      </div>

      <div className='space-y-2'>
        <label htmlFor='bio' className='text-sm font-bold text-zinc-700'>
          紹介
        </label>
        <textarea
          id='bio'
          {...register('bio')}
          rows={4}
          placeholder='自己紹介を入力してください'
          className='w-full p-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-zinc-900 transition-all resize-none'
        />
      </div>

      <div className='space-y-4'>
        <div className='flex flex-col'>
          <span className='text-sm font-bold text-zinc-700'>アレルギー</span>
          <span className='text-xs text-zinc-400'>
            該当するものをすべて選んでください
          </span>
        </div>

        <div className='flex flex-wrap gap-2'>
          {ALLERGY_OPTIONS.map((allergy) => {
            const isSelected = selectedAllergies.includes(allergy);
            return (
              <button
                key={allergy}
                type='button'
                onClick={() => toggleAllergy(allergy)}
                className={`px-5 py-2.5 rounded-full border text-sm font-bold transition-all duration-200 ${
                  isSelected
                    ? 'bg-red-50 border-red-400 text-red-600 shadow-sm scale-105'
                    : 'bg-zinc-50 border-zinc-200 text-zinc-500 hover:border-zinc-300'
                }`}
              >
                {allergy}
              </button>
            );
          })}
        </div>
      </div>

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
