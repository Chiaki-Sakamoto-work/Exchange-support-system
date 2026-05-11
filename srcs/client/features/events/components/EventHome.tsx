'use client';

import React, { useState } from 'react';
import { EventCard } from './EventCard'; // 先ほど作ったカードを読み込む

export const EventHome = () => {
  // ホーム画面内だけの状態（サブタブ）は、このコンポーネントで管理する
  const [subTab, setSubTab] = useState<'upcoming' | 'joined'>('upcoming');

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* サブタブ切り替えスイッチ */}
      <div className="flex p-1 bg-zinc-200/50 dark:bg-zinc-800/50 rounded-xl">
        <button 
          onClick={() => setSubTab('upcoming')}
          className={`flex-1 py-2 text-sm font-bold rounded-lg transition ${
            subTab === 'upcoming' ? 'bg-white dark:bg-zinc-700 shadow-sm' : 'text-zinc-500'
          }`}
        >
          開催予定
        </button>
        <button 
          onClick={() => setSubTab('joined')}
          className={`flex-1 py-2 text-sm font-bold rounded-lg transition ${
            subTab === 'joined' ? 'bg-white dark:bg-zinc-700 shadow-sm' : 'text-zinc-500'
          }`}
        >
          参加予定
        </button>
      </div>

      {/* リスト表示エリア */}
      <div className="space-y-4">
        {subTab === 'upcoming' ? (
          <>
            <EventCard 
              title="プロジェクト打ち上げ" 
              shop="肉の万世" 
              date="2024/05/20 19:00" 
              detail="👥 8名 / 主催: あなた" 
              colorClass="bg-orange-500" 
            />
            <EventCard 
              title="金曜定例飲み" 
              shop="HUB 渋谷店" 
              date="2024/05/24 20:30" 
              detail="👥 4名 / 主催: あなた" 
              colorClass="bg-orange-500" 
            />
          </>
        ) : (
          <>
            <EventCard 
              title="エンジニア交流会" 
              shop="代官山カフェ" 
              date="2024/05/18 18:00" 
              detail="👤 代表: 田中さん" 
              colorClass="bg-blue-500" 
            />
            <EventCard 
              title="デザインチーム歓迎会" 
              shop="イタリアン バル" 
              date="2024/06/02 19:30" 
              detail="👤 代表: 佐藤さん" 
              colorClass="bg-blue-500" 
            />
          </>
        )}
      </div>
    </div>
  );
};