import { redirect } from 'next/navigation';
import { ProfileDashboard } from '@/features/profile/components/ProfileDashboard';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/supabase/auth';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Profile',
  description: 'Profile 画面',
};

export default async function ProfilePage() {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  const profile = await prisma.profiles.findUnique({
    where: { id: session.user.id },
    include: { departments: true },
  });

  if (!profile) {
    return <div>プロフィールが見つかりません。</div>;
  }

  return <ProfileDashboard user={profile} />;
}
