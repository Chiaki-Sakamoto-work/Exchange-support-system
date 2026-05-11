'use client';

import React from 'react';

// Propsの型定義：現在のタブと、タブを切り替えるための関数を受け取る
type BottomNavProps = {
  activeTab: string;
  onTabChange: (tab: 'home' | 'create' | 'join' | 'mypage') => void;
};

export const BottomNav = ({ activeTab, onTabChange }: BottomNavProps) => {
  const tabs = [
    { id: 'home', label: 'ホーム', icon: '🏠' },
    { id: 'create', label: '開催', icon: '➕' },
    { id: 'join', label: '参加', icon: '🍻' },
    { id: 'mypage', label: 'マイ', icon: '👤' },
  ] as const;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 px-6 py-3 pb-8 flex justify-around items-center z-50">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex flex-col items-center gap-1 transition-all ${
            activeTab === tab.id ? 'text-orange-500 scale-110' : 'text-zinc-400'
          }`}
        >
          <span className="text-xl">{tab.icon}</span>
          <span className="text-[10px] font-bold">{tab.label}</span>
          {/* アクティブな時だけ下にポチをつける演出 */}
          {activeTab === tab.id && (
            <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-in zoom-in" />
          )}
        </button>
      ))}
    </nav>
  );
};