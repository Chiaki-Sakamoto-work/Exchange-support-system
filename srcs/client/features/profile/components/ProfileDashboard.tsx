import { ProfileHeader } from './ProfileHeader';
import { WelfareStatus } from './WelfareStatus';
import { Button } from '@/components/ui/Button';
import { LayoutDashboard, PlusCircle, Users, UserCircle } from 'lucide-react'; // アイコン例
import Link from 'next/link';

export const ProfileDashboard = ({ user }: { user: any }) => {
  return (
    <div className="min-h-screen bg-zinc-50 pb-24">
      {/* 上部タイトル */}
      <div className="p-6">
        <h1 className="text-xl font-bold text-zinc-900">のみ会</h1>
      </div>

      <div className="px-4 flex flex-col gap-4">
        {/* メインカード (ProfileHeaderをラップ) */}
        <div className="bg-white rounded-3xl p-6 border border-zinc-200 shadow-sm border-b-4 border-b-blue-500">
          <ProfileHeader user={user} />
        </div>

        {/* 福利厚生セクション */}
        <WelfareStatus />

        {/* アクションボタン */}
        <div className="flex flex-col gap-3 mt-2">
          <Button asChild variant="default" className="w-full py-7 bg-zinc-950 rounded-2xl shadow-lg">
            <Link href="/profile/edit">
              <span className="mr-2">📝</span> プロフィールを編集
            </Link>
          </Button>

          <Button variant="outline" className="w-full py-7 bg-white text-zinc-600 rounded-2xl border-zinc-200">
            <span className="mr-2">↪</span> ログアウト
          </Button>
        </div>
      </div>

    </div>
  );
};

// ナビ用小コンポーネント（同じファイル内か、components/uiへ）
const NavItem = ({ icon, label, active = false }: any) => (
  <div className={`flex flex-col items-center gap-1 px-4 py-2 rounded-2xl transition-colors ${active ? 'bg-zinc-100 text-zinc-900' : 'text-zinc-400'}`}>
    {icon}
    <span className="text-[10px] font-bold">{label}</span>
  </div>
);
