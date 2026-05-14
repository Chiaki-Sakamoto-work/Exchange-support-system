'use client';

import { useState } from 'react';
import { createEvent } from '../actions/eventActions';

type Props = {
  onSuccess: () => void;
};

export const EventCreateForm = ({ onSuccess }: Props) => {
  const [title, setTitle] = useState('');
  const [datetime, setDatetime] = useState('');
  const [capacity, setCapacity] = useState<number | ''>('');
  const [tags, setTags] = useState('');
  const [shop, setShop] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!capacity) return; //容量が空の場合は弾く

    setIsSubmitting(true); // 送信中状態にする

    // Server Actionを呼び出してDBに保存！
    const result = await createEvent({
      title,
      datetime,
      capacity: Number(capacity),
      tags,
      shop,
    });

    setIsSubmitting(false);

    if (result.success) {
      alert('予定を作成しました！');
      onSuccess(); // 成功したら親に教えて、ホーム画面に切り替えてもらう
    } else {
      alert('エラーが発生しました。もう一度お試しください。');
    }
  };

  return (
    <div className='animate-in fade-in duration-500 space-y-6'>
      <div className='mb-2'>
        <h2 className='text-2xl font-bold'>飲み会を開催する</h2>
        <p className='text-sm text-zinc-500'>
          詳細を入力してメンバーを募集しましょう。
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className='space-y-5 bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm'
      >
        {/* タイトル */}
        <div>
          {/* 追加: htmlFor='title' */}
          <label
            htmlFor='title'
            className='block text-xs font-bold uppercase text-zinc-500 mb-1.5'
          >
            タイトル <span className='text-orange-500'>*</span>
          </label>
          <input
            id='title' // 追加: id='title'
            type='text'
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder='例：【営業部】月末お疲れ様会🍻'
            className='w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 outline-none focus:border-orange-500 transition-colors text-sm'
          />
        </div>

        <div className='grid grid-cols-2 gap-4'>
          {/* 開催日時 */}
          <div>
            {/* 追加: htmlFor='datetime' */}
            <label
              htmlFor='datetime'
              className='block text-xs font-bold uppercase text-zinc-500 mb-1.5'
            >
              開催日時 <span className='text-orange-500'>*</span>
            </label>
            <input
              id='datetime' // 追加: id='datetime'
              type='datetime-local'
              required
              value={datetime}
              onChange={(e) => setDatetime(e.target.value)}
              className='w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 outline-none focus:border-orange-500 transition-colors text-sm'
            />
          </div>

          {/* 参加人数の上限 */}
          <div>
            {/* 追加: htmlFor='capacity' */}
            <label
              htmlFor='capacity'
              className='block text-xs font-bold uppercase text-zinc-500 mb-1.5'
            >
              上限人数 <span className='text-orange-500'>*</span>
            </label>
            <div className='relative'>
              <input
                id='capacity' // 追加: id='capacity'
                type='number'
                min='2'
                required
                value={capacity}
                onChange={(e) => setCapacity(Number(e.target.value))}
                placeholder='4'
                className='w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 outline-none focus:border-orange-500 transition-colors text-sm'
              />
              <span className='absolute right-4 top-1/2 -translate-y-1/2 text-sm text-zinc-400'>
                名
              </span>
            </div>
          </div>
        </div>

        {/* タグ */}
        <div>
          {/* 追加: htmlFor='tags' */}
          <label
            htmlFor='tags'
            className='block text-xs font-bold uppercase text-zinc-500 mb-1.5'
          >
            タグ
          </label>
          <input
            id='tags' // 追加: id='tags'
            type='text'
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder='例：新人歓迎, 日本酒好き （カンマ区切り）'
            className='w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 outline-none focus:border-orange-500 transition-colors text-sm'
          />
        </div>

        {/* お店選択（テキスト入力） */}
        <div>
          {/* 追加: htmlFor='shop' */}
          <label
            htmlFor='shop'
            className='block text-xs font-bold uppercase text-zinc-500 mb-1.5 flex justify-between items-end'
          >
            <span>お店の名前</span>
            <span className='text-[10px] text-orange-500 bg-orange-50 dark:bg-orange-950/30 px-2 py-0.5 rounded-full'>
              ※API自動提案は後日実装
            </span>
          </label>
          <input
            id='shop' // 追加: id='shop'
            type='text'
            value={shop}
            onChange={(e) => setShop(e.target.value)}
            placeholder='例：炭火焼肉 おおた'
            className='w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 outline-none focus:border-orange-500 transition-colors text-sm'
          />
        </div>

        {/* Component: 保存/作成ボタン */}
        <div className='pt-4'>
          <button
            type='submit'
            disabled={isSubmitting} // 送信中はボタンを押せなくする
            className='w-full bg-orange-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-orange-200 dark:shadow-none active:scale-95 transition-all'
          >
            {isSubmitting ? '作成中...' : 'この内容で開催する'}
          </button>
        </div>
      </form>
    </div>
  );
};
