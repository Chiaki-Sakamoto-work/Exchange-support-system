'use client';

import { useRouter } from 'next/navigation';
import { EventCreateForm } from '../../features/events/components/EventCreateForm';

export default function CreatePage() {
  const router = useRouter();

  // フォーム側で「作成成功！」となった時に実行される処理
  const handleSuccess = () => {
    // ホーム画面（イベント一覧）に戻して、最新のデータを読み込ませる
    router.push('/'); 
    router.refresh(); 
  };

  return (
    <div className="max-w-xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">新しい予定を作成</h1>
      
      {/* 子に「終わったら handleSuccess を実行してね」と渡す */}
      <EventCreateForm onSuccess={handleSuccess} />
    </div>
  );
}