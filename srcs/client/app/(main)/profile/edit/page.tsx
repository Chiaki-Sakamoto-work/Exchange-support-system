import { ProfileEditForm } from '@/features/profile/components/ProfileEditForm';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/supabase/auth';

export default async function ProfileEditPage() {
  const session = await auth();
  
  const profile = await prisma.profiles.findUnique({
    where: { id: session.user.id },
    include: { departments: true }
  });

  if (!profile) return <div>読み込みエラー</div>;

  return (
    <div className="container mx-auto max-w-2xl py-10">
      <h1 className="text-2xl font-bold mb-8">プロフィール編集</h1>
      <ProfileEditForm initialData={profile} />
    </div>
  );
}
