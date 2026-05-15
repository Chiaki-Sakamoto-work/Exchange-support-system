'use client';

import type { rooms } from '@prisma/client';
import { useState } from 'react';
import { createEvent, updateEventAction } from '../actions/eventActions';

type Props = {
  onSuccess: () => void;
  initialData?: rooms;
  roomId?: number;
};

export const EventForm = ({ onSuccess, initialData, roomId }: Props) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, _setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    datetime: initialData?.event_start_at
      ? new Date(initialData.event_start_at).toISOString().slice(0, 16)
      : '',
    capacity: initialData?.capacity_limit || 4,
    tags: initialData?.description || '',
    shop: initialData?.location_name || '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    let result: { success: boolean; error?: string } | undefined;
    if (roomId) {
      result = await updateEventAction(roomId, formData);
    } else {
      result = await createEvent(formData);
    }

    // 🌟 result?.success とすることで、undefined の可能性を考慮
    if (result?.success) {
      alert(roomId ? '更新しました！' : '作成しました！');
      onSuccess();
    }
    setIsProcessing(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className='space-y-6 bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800'
    >
      {error && (
        <div className='p-3 bg-red-100 text-red-600 rounded-lg text-sm'>
          {error}
        </div>
      )}

      {/* 1. イベント名 */}
      <div>
        <label htmlFor='title' className='block text-sm font-bold mb-2'>
          イベント名 <span className='text-red-500'>*</span>
        </label>
        <input
          id='title'
          required
          name='title'
          value={formData.title}
          onChange={handleChange}
          placeholder='例：週末焼肉会！'
          className='w-full p-3 bg-zinc-100 dark:bg-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500'
        />
      </div>

      {/* 2. お店・場所 */}
      <div>
        {/* 🌟 htmlFor='shop' を追加 */}
        <label htmlFor='shop' className='block text-sm font-bold mb-2'>
          お店・場所 <span className='text-red-500'>*</span>
        </label>
        <input
          id='shop'
          required
          name='shop'
          value={formData.shop}
          onChange={handleChange}
          placeholder='例：渋谷の〇〇苑'
          className='w-full p-3 bg-zinc-100 dark:bg-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500'
        />
      </div>

      <div className='grid grid-cols-2 gap-4'>
        {/* 3. 日時 */}
        <div>
          {/* 🌟 htmlFor='datetime' を追加 */}
          <label htmlFor='datetime' className='block text-sm font-bold mb-2'>
            日時 <span className='text-red-500'>*</span>
          </label>
          <input
            id='datetime'
            required
            type='datetime-local'
            name='datetime'
            value={formData.datetime}
            onChange={handleChange}
            className='w-full p-3 bg-zinc-100 dark:bg-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500'
          />
        </div>

        {/* 4. 募集人数 */}
        <div>
          {/* 🌟 htmlFor='capacity' を追加 */}
          <label htmlFor='capacity' className='block text-sm font-bold mb-2'>
            募集人数 <span className='text-red-500'>*</span>
          </label>
          <input
            id='capacity'
            required
            type='number'
            min='2'
            max='100'
            name='capacity'
            value={formData.capacity}
            onChange={handleChange}
            className='w-full p-3 bg-zinc-100 dark:bg-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500'
          />
        </div>
      </div>

      {/* 5. メモ */}
      <div>
        {/* 🌟 htmlFor='tags' を追加 */}
        <label htmlFor='tags' className='block text-sm font-bold mb-2'>
          一言メモ（タグなど）
        </label>
        <textarea
          id='tags'
          name='tags'
          value={formData.tags}
          onChange={handleChange}
          placeholder='例：予算4000円くらいです！'
          className='w-full p-3 bg-zinc-100 dark:bg-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 min-h-[100px]'
        />
      </div>

      <button
        type='submit'
        disabled={isProcessing}
        className='w-full bg-orange-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-orange-200 dark:shadow-none transition active:scale-95 disabled:opacity-50 mt-4'
      >
        {isProcessing ? (
          <span className='flex items-center justify-center gap-2'>
            <span className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin' />
            処理中...
          </span>
        ) : roomId ? (
          '変更を保存する'
        ) : (
          '予定を作成する'
        )}
      </button>
    </form>
  );
};
