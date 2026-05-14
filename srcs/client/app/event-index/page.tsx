'use client';

import { useState } from 'react';
import { EventExplore } from '@/features/events/components/EventExplore';
import { EventForm } from '@/features/events/components/EventForm';
import { BottomNav } from '../../components/Layout/BottomNav';
import { EventHome } from '../../features/events/components/EventHome';
import { Profile } from '@features/profile/ProfileView'

export default function EventIndexPage() {
  const [activeTab, setActiveTab] = useState<
    'home' | 'create' | 'join' | 'mypage'
  >('home');

  return (
    <div className='min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50'>
      <header className='p-6 flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800'>
        <div className='w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold'>
          N
        </div>
        <h1 className='text-xl font-bold tracking-tight'>Nomikai Hub</h1>
      </header>

      <main className='max-w-md mx-auto p-4 pb-24'>
        {activeTab === 'home' && <EventHome />}

        {activeTab === 'create' && (
          <EventForm onSuccess={() => setActiveTab('home')} />
        )}
        {activeTab === 'join' && <EventExplore />}
        {activeTab === 'mypage' && (
          <div className='text-xl font-bold mt-10 text-center'>
            マイページ（作成中）
          </div>
        )}
      </main>

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
