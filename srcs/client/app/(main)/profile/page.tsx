import { ProfileView } from '@/features/profile/components/ProfileView';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/supabase/auth';

export default async function ProfilePage() {
  const session = await auth();
  
  // DBから最新のユーザー情報を取得（Cでいうところの SELECT * FROM profiles WHERE id = ...）
  const profile = await prisma.profiles.findUnique({
    where: { id: session.user.id },
  });

  return (
    <main className="p-4">
      {/* 取得した生データを View に流し込む */}
      <ProfileView user={profile} />
    </main>
  );
}
