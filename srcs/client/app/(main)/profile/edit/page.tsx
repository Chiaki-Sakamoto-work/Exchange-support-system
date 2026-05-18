import { ProfileEditForm } from '@/features/profile/components/ProfileEditForm';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/supabase/auth';

export default async function ProfileEditPage() {
  const session = await auth();

  if (!session?.user) {
    return <div>ログインが必要です</div>;
  }

  const profile = await prisma.profiles.findUnique({
    where: { id: session.user.id },
    include: { departments: true },
  });

  if (!profile) return <div>読み込みエラー</div>;

  const initialData = {
    ...profile,
    username: profile.username ?? '', // 💡 null なら空文字にする
    bio: profile.bio ?? '', // 💡 null なら空文字にする
    is_support_used: profile.is_support_used ?? false,
    user_type: profile.user_type as '一般社員' | '新卒' | null, // スキーマの型に合わせる
  };

  // 3. 整形した initialData を渡す
  return <ProfileEditForm initialData={initialData} />;
}
