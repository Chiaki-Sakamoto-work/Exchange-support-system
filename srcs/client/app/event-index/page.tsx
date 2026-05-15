'use client';

import { useState } from 'react';
import { BottomNav, type BottomTab } from '@/components/layout/BottomNav';
import { EventForm } from '@/features/events/components/EventForm';
import { EventHome } from '@/features/events/components/EventHome';

export default function EventIndexPage() {
  const [activeTab, setActiveTab] = useState<BottomTab>('home');

  return (
    <div className='min-h-screen'>
      <header className='p-6 flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800'>
        <div className='w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold'>
          N
        </div>
        <h1 className='text-xl font-bold tracking-tight'>Nomikai Hub</h1>
      </header>

      <main className='w-full mx-auto p-4 pb-24 flex justify-center mt-2'>
        {activeTab === 'home' && <EventHome />}

        {activeTab === 'create' && (
          <EventForm onSuccess={() => setActiveTab('home')} />
        )}
        {activeTab === 'join' && (
          <div className='text-xl font-bold mt-10 text-center'>
            参加画面（作成中）
          </div>
        )}
        {activeTab === 'mypage' && (
          <div className='text-xl font-bold mt-10 text-center'>
            マイページ（作成中）
          </div>
        )}
      </main>

      <BottomNav
        activeTab={activeTab}
        className='fixed max-w-[672px] bottom-0 mb-5'
        onTabChange={setActiveTab}
      />
    </div>
  );
}
