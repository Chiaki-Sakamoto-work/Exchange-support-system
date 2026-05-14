'use client';

import { useState } from 'react';
import { createEvent } from '../actions/eventActions';

type Props = {
  // 作成に成功した時に、親(page.tsx)に「終わったよ！」と知らせるためのスイッチ
  onSuccess: () => void; 
};

export const EventCreateForm = ({ onSuccess }: Props) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ユーザーの入力を覚えておくための箱
  const [formData, setFormData] = useState({
    title: '',
    datetime: '',
    capacity: 3, // 初期値は4人にしておく
    tags: '',
    shop: '',
  });

  // 入力欄が書き換えられた時に、箱の中身を更新する共通関数
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 「作成する」ボタンが押された時の処理
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // 🌟 超重要：ブラウザの標準機能（画面の勝手なリロード）を止める！
    setIsProcessing(true);
    setError(null);

    // 裏側の createEvent 関数に入力データを渡す
    const result = await createEvent({
      ...formData,
      capacity: Number(formData.capacity), // ここだけ数字型に直してあげる
    });

    if (result.success) {
      alert('予定を作成しました！');
      onSuccess(); // 親に「終わったよ！(画面を切り替える等してね)」と報告
    } else {
      setError(result.error || '作成に失敗しました');
    }

    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800">
      
      {error && <div className="p-3 bg-red-100 text-red-600 rounded-lg text-sm">{error}</div>}

      <div>
        <label className="block text-sm font-bold mb-2">イベント名 <span className="text-red-500">*</span></label>
        <input
          required
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="例：週末焼肉会！"
          className="w-full p-3 bg-zinc-100 dark:bg-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      <div>
        <label className="block text-sm font-bold mb-2">お店・場所 <span className="text-red-500">*</span></label>
        <input
          required
          name="shop"
          value={formData.shop}
          onChange={handleChange}
          placeholder="例：渋谷の〇〇苑"
          className="w-full p-3 bg-zinc-100 dark:bg-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold mb-2">日時 <span className="text-red-500">*</span></label>
          <input
            required
            type="datetime-local" // 👈 カレンダーと時計が出る便利な入力欄
            name="datetime"
            value={formData.datetime}
            onChange={handleChange}
            className="w-full p-3 bg-zinc-100 dark:bg-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
        <div>
          <label className="block text-sm font-bold mb-2">募集人数 <span className="text-red-500">*</span></label>
          <input
            required
            type="number"
            min="2"
            max="100"
            name="capacity"
            value={formData.capacity}
            onChange={handleChange}
            className="w-full p-3 bg-zinc-100 dark:bg-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold mb-2">一言メモ（タグなど）</label>
        <textarea
          name="tags"
          value={formData.tags}
          onChange={handleChange}
          placeholder="例：予算4000円くらいです！"
          className="w-full p-3 bg-zinc-100 dark:bg-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 min-h-[100px]"
        />
      </div>

      <button
        type="submit"
        disabled={isProcessing}
        className="w-full bg-orange-500 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-orange-600 transition active:scale-95 disabled:opacity-50"
      >
        {isProcessing ? '作成中...' : '予定を作成する'}
      </button>
    </form>
  );
};