'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { type ProfileFormValues, profileSchema } from '../schemas/profile';

export async function updateProfile(userId: string, data: ProfileFormValues) {
  const validatedData = profileSchema.parse(data);

  try {
    await prisma.profiles.update({
      where: { id: userId },
      data: {
        username: validatedData.username,
        bio: data.bio,
        department_id: validatedData.department_id,
        user_type: validatedData.user_type,
        allergies: validatedData.allergies,
        is_support_used: validatedData.is_support_used,
        updated_at: new Date(),
      },
    });

    revalidatePath('/profile');
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: '更新に失敗しました' };
  }
}
