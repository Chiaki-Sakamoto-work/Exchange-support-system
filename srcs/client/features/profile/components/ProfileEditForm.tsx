'use client'

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { profileSchema, type ProfileFormValues } from '../schemas/profile';
import { updateProfile } from '../actions/profile';
import { Button } from '@/components/ui/Button'; // あなたが作ったButton！

const ALLERGY_OPTIONS = ['卵', '乳製品', '小麦', 'そば', '落花生', 'えび', 'かに', 'アーモンド', 'くるみ'];

export function ProfileEditForm({ initialData }: { initialData: any }) {
  const { register, handleSubmit, setValue, watch, formState: { isSubmitting } } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: initialData.username || '',
      bio: initialData.bio || '',
      department_id: initialData.department_id,
      user_type: initialData.user_type,
      allergies: initialData.allergies || [],
      is_support_used: initialData.is_support_used || false,
    }
  });

  const selectedAllergies = watch('allergies');

  // チップをクリックした時の切り替えロジック
  const toggleAllergy = (allergy: string) => {
    const current = [...selectedAllergies];
    const index = current.indexOf(allergy);
    if (index > -1) {
      current.splice(index, 1);
    } else {
      current.push(allergy);
    }
    setValue('allergies', current);
  };

  const onSubmit = async (data: ProfileFormValues) => {
    await updateProfile(initialData.id, data);
    // 保存後の遷移処理など
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* 名前入力 */}
      <div className="space-y-2">
        <label className="text-sm font-bold">名前</label>
        <input {...register('username')} className="w-full p-3 border rounded-xl" />
      </div>

      {/* アレルギーチップ選択 */}
      <div className="space-y-4">
        <label className="text-sm font-bold">アレルギー</label>
        <div className="flex flex-wrap gap-2">
          {ALLERGY_OPTIONS.map(allergy => (
            <button
              key={allergy}
              type="button"
              onClick={() => toggleAllergy(allergy)}
              className={`px-4 py-2 rounded-full border transition-all ${
                selectedAllergies.includes(allergy)
                ? 'bg-red-50 border-red-400 text-red-600'
                : 'bg-gray-50 border-gray-200 text-gray-500'
              }`}
            >
              {allergy}
            </button>
          ))}
        </div>
      </div>

      {/* 下部のボタンエリア */}
      <div className="flex gap-4 pt-6">
        <Button variant="secondary" className="flex-1" type="button">キャンセル</Button>
        <Button variant="default" className="flex-1 bg-slate-900" type="submit" disabled={isSubmitting}>
          {isSubmitting ? '保存中...' : '保存'}
        </Button>
      </div>
    </form>
  );
}
