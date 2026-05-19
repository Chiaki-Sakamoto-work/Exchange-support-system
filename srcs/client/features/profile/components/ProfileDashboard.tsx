import { signOut } from '@feature/auth/actions';
import { LogOut, PenBox } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ProfileHeader } from './ProfileHeader';
import { WelfareStatus } from './WelfareStatus';

export interface UserProfileProps {
  id: string;
  username: string | null; // 💡 「| null」を追加して、nullも受け取れるようにします
  email: string;
  bio?: string | null;
  department_id: number | null;
  user_type: string | null;
  allergies: string[];
  is_support_used: boolean | null;
  departments?: {
    name: string;
  } | null;
}

export const ProfileDashboard = ({ user }: { user: UserProfileProps }) => {
  return (
    <div>
      <div className='px-4 flex flex-col gap-4'>
        {/* メインカード (ProfileHeaderをラップ) */}

        <ProfileHeader user={user} />

        {/* 福利厚生セクション */}
        <WelfareStatus is_support_used={user.is_support_used} />

        {/* アクションボタン */}
        <div className='flex flex-col gap-3 mt-2'>
          <Button asChild variant='default' className='w-full'>
            <Link href='/profile/edit'>
              <PenBox /> プロフィールを編集
            </Link>
          </Button>
          <form action={signOut}>
            <Button variant='outline' className='w-full' type='submit'>
              <LogOut /> ログアウト
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
