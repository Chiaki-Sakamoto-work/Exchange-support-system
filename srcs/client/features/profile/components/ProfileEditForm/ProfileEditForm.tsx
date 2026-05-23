'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import type { departments } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { type KeyboardEvent, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import type { UserType } from '@/types/user';
import { createDepartment, updateProfile } from '../../actions/profile';
import { type ProfileFormValues, profileSchema } from '../../schemas/profile';
import { ProfileAllergySection } from './ProfileAllergySection';
import { ProfileAvatarSection } from './ProfileAvatarSection';
import { ProfileBasicInfoSection } from './ProfileBasicInfoSection';
import { ProfileDepartmentSection } from './ProfileDepartmentSection';
import { ProfileUserTypeSection } from './ProfileUserTypeSection';
import { ProfileWelfareSection } from './ProfileWelfareSection';

export interface ProfileEditFormProps {
  initialData: ProfileFormValues & {
    id: string;
    email: string;
    avatar_url: string | null;
  };
  departments: Pick<departments, 'id' | 'name'>[];
}

export function ProfileEditForm({
  initialData,
  departments,
}: ProfileEditFormProps) {
  const router = useRouter();
  const [departmentOptions, setDepartmentOptions] = useState(departments);
  const [departmentSelectOpen, setDepartmentSelectOpen] = useState(false);
  const [newDepartmentName, setNewDepartmentName] = useState('');
  const [isAddingDepartment, setIsAddingDepartment] = useState(false);
  const [isSaveLocked, setIsSaveLocked] = useState(false);
  const saveLockRef = useRef(false);

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

  const selectedAllergies = watch('allergies') || [];
  const userName = watch('username') || '';
  const isSupportUsed = watch('is_support_used') || false;
  const userType: NonNullable<UserType> = watch('user_type') || '一般社員';
  const departmentId = watch('department_id');
  const isSaving = isSubmitting || isSaveLocked;

  const toggleAllergy = (allergy: string) => {
    const current = [...selectedAllergies];
    const index = current.indexOf(allergy);

    if (index > -1) {
      current.splice(index, 1);
    } else {
      current.push(allergy);
    }

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

  const selectDepartment = (departmentId: number | null) => {
    setValue('department_id', departmentId, { shouldDirty: true });
    setDepartmentSelectOpen(false);
  };

  const handleDepartmentValueChange = (value: string) => {
    selectDepartment(value === 'none' ? null : Number(value));
  };

  const handleUserTypeChange = (value: NonNullable<UserType>) => {
    setValue('user_type', value, { shouldDirty: true });
  };

  const handleAddDepartment = async () => {
    const trimmedName = newDepartmentName.trim();

    if (!trimmedName || isAddingDepartment) {
      return;
    }

    const existingDepartment = departmentOptions.find(
      (department) =>
        department.name.trim().toLocaleLowerCase() ===
        trimmedName.toLocaleLowerCase(),
    );

    if (existingDepartment) {
      selectDepartment(existingDepartment.id);
      setNewDepartmentName('');
      return;
    }

    setIsAddingDepartment(true);
    const result = await createDepartment(trimmedName);
    setIsAddingDepartment(false);

    if (!result.success || !result.department) {
      toast.error(result.error ?? '部署の追加に失敗しました');
      return;
    }

    setDepartmentOptions((currentDepartments) => {
      if (
        currentDepartments.some(
          (department) => department.id === result.department.id,
        )
      ) {
        return currentDepartments;
      }

      return [...currentDepartments, result.department];
    });
    selectDepartment(result.department.id);
    setNewDepartmentName('');
  };

  const onSubmit = async (data: ProfileFormValues) => {
    if (saveLockRef.current) {
      return;
    }

    saveLockRef.current = true;
    setIsSaveLocked(true);

    const releaseSaveLock = () => {
      saveLockRef.current = false;
      setIsSaveLocked(false);
    };

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
        releaseSaveLock();
      }
    } catch {
      toast.error('予期せぬエラーが発生しました');
      releaseSaveLock();
    }
  };

  const onCancel = () => {
    toast.info('編集をキャンセルしました');
    router.push('/profile');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-6'>
      <ProfileAvatarSection
        avatarUrl={initialData.avatar_url}
        userName={userName}
      />
      <ProfileBasicInfoSection
        bioField={register('bio')}
        usernameField={register('username')}
      />
      <ProfileDepartmentSection
        departmentId={departmentId}
        departmentOptions={departmentOptions}
        isAddingDepartment={isAddingDepartment}
        isOpen={departmentSelectOpen}
        newDepartmentName={newDepartmentName}
        onAddDepartment={handleAddDepartment}
        onNewDepartmentNameChange={setNewDepartmentName}
        onOpenChange={setDepartmentSelectOpen}
        onValueChange={handleDepartmentValueChange}
      />
      <ProfileUserTypeSection
        userType={userType}
        onUserTypeChange={handleUserTypeChange}
      />
      <ProfileAllergySection
        selectedAllergies={selectedAllergies}
        onToggleAllergy={toggleAllergy}
      />
      <ProfileWelfareSection
        isSupportUsed={isSupportUsed}
        onKeyDown={handleSupportKeyDown}
        onToggleSupport={toggleSupport}
      />
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
          disabled={isSaving}
        >
          {isSaving ? '保存中...' : '保存する'}
        </Button>
      </div>
    </form>
  );
}
