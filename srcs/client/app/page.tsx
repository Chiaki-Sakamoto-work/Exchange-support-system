'use client';

import { useState } from 'react';
import { AuthView } from '../features/auth/components/auth-view';
import EventIndexPage from './event-index/page';

export default function RootPage() {
  // 認証状態（実際は Supabase の Session 等を監視）
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // ログイン処理（モック）
  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  // 1. 未ログイン時：GoogleボタンのみのAuthViewを表示
  if (!isLoggedIn) {
    return <AuthView onLogin={handleLogin} />;
  }

  // 2. ログイン後：メインコンテンツ（EventIndexPage）を表示
  return <EventIndexPage />;
}
