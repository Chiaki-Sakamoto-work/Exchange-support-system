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
  });
  const initialData = profile
    ? {
        ...profile,
        username: profile.username ?? '',
        bio: profile.bio ?? '',
        is_support_used: profile.is_support_used ?? false,
        user_type: profile.user_type as '一般社員' | '新卒' | null,
        email: profile.email,
        avatar_url: profile.avatar_url,
      }
    : {
        id: session.user.id,
        email: session.user.email ?? '',
        avatar_url:
          (session.user as { user_metadata?: { avatar_url?: string } })
            .user_metadata?.avatar_url ?? null,
        username: '',
        bio: '',
        department_id: null,
        user_type: null,
        allergies: [],
        is_support_used: false,
      };

  return <ProfileEditForm initialData={initialData} />;
}
