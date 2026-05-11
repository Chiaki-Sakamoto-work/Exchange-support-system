'use client';

import React, { useState } from 'react';
// 相対パスで読み込む（エラー回避のため）
import { BottomNav } from '../components/Layout/BottomNav';
import { EventHome } from '../features/events/components/EventHome';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'home' | 'create' | 'join' | 'mypage'>('home');

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50">
      
      {/* ヘッダー */}
      <header className="p-6 flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800">
        <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold">N</div>
        <h1 className="text-xl font-bold tracking-tight">Nomikai Hub</h1>
      </header>

      {/* メインエリア */}
      <main className="max-w-md mx-auto p-4 pb-24">
        {/* ホームタブが選ばれている時だけ、EventHomeコンポーネントを表示 */}
        {activeTab === 'home' && <EventHome />}
        
        {activeTab === 'create' && <div className="text-xl font-bold mt-10 text-center">開催画面（作成中）</div>}
        {activeTab === 'join' && <div className="text-xl font-bold mt-10 text-center">参加画面（作成中）</div>}
        {activeTab === 'mypage' && <div className="text-xl font-bold mt-10 text-center">マイページ（作成中）</div>}
      </main>

      {/* フッターナビゲーション */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
