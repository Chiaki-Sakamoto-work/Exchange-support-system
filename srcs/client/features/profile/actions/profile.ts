'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { type ProfileFormValues, profileSchema } from '../schemas/profile';

// 💡 引数に email と avatarUrl を追加します
export async function updateProfile(
  userId: string,
  email: string,
  avatarUrl: string | null,
  data: ProfileFormValues,
) {
  const validatedData = profileSchema.parse(data);

  try {
    await prisma.profiles.upsert({
      where: { id: userId },
      // 💡 既にレコードがある場合（Update）
      update: {
        username: validatedData.username,
        bio: data.bio,
        department_id: validatedData.department_id,
        user_type: validatedData.user_type,
        allergies: validatedData.allergies,
        is_support_used: validatedData.is_support_used,
        avatar_url: avatarUrl, // 💡 Google側でアイコンが変わった場合のために、アップデート時も上書きする
        updated_at: new Date(),
      },
      // 💡 レコードが無い場合：db-reset直後など（Create）
      create: {
        id: userId, // Supabaseから取ってきた sub (ユーザーID)
        email: email, // Supabaseから取ってきた email
        avatar_url: avatarUrl, // Supabaseから取ってきた avatar_url
        username: validatedData.username,
        bio: data.bio,
        department_id: validatedData.department_id,
        user_type: validatedData.user_type,
        allergies: validatedData.allergies,
        is_support_used: validatedData.is_support_used,
      },
    });

    revalidatePath('/profile');
    return { success: true };
  } catch (error) {
    console.error('Prisma Upsert Error:', error);
    return { success: false, error: '更新に失敗しました' };
  }
}
