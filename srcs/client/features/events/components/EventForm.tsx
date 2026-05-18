'use client';

import { Calendar1, FileText, Store, Tag, UserRound } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import type { Room } from '@/app/types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { DateTimePicker } from '@/components/ui/DateTimePicker';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import {
  RadioCard,
  RadioCardDescription,
  RadioCardHeader,
  RadioCardTitle,
} from '@/components/ui/RadioCard';
import { RadioGroup } from '@/components/ui/RadioGroup';
import { Stepper } from '@/components/ui/Stepper';
import { createEvent, updateEventAction } from '../actions/eventActions';

// テストデータ
const MOCK_SHOPS = [
  {
    name: '居酒屋たぬき',
    description: '渋谷・和食・¥¥',
  },
  {
    name: '焼き鳥みやび',
    description: '新宿・焼き鳥・¥¥',
  },
  {
    name: '焼き鳥みやび (2号店)',
    description: '新宿・焼き鳥・¥¥',
  },
  // {
  //   name: '焼き鳥みやび (3号店)',
  //   description: '新宿・和食・¥¥',
  // },
  // {
  //   name: '焼き鳥みやび (4号店)',
  //   description: '新宿・焼き鳥・¥¥',
  // },
];

type Props = {
  onSuccess: () => void;
  initialData?: Room;
  roomId?: number;
};

export const EventForm = ({ onSuccess, initialData, roomId }: Props) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, _setError] = useState<string | null>(null);

  const [tagInput, setTagInput] = useState('');

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    datetime: initialData?.event_start_at
      ? new Date(initialData.event_start_at).toISOString().slice(0, 16)
      : '',
    capacity: initialData?.capacity_limit || 4,
    tags: initialData?.room_tags?.map((rt) => rt.tags.name) || ([] as string[]),
    shop: initialData?.location_name || '',
  });

  const today = new Date().toISOString().split('T')[0];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleShopChange = (newValue: string) => {
    setFormData((prev) => ({ ...prev, shop: newValue }));
  };

  const handleDateTimeChange = (newValue: string) => {
    setFormData((prev) => ({ ...prev, datetime: newValue }));
  };

  const handlecCpacityChange = (newValue: number) => {
    setFormData((prev) => ({ ...prev, capacity: newValue }));
  };

  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagInput(e.target.value);
  };

  const handleAddTag = () => {
    const trimmedTag = tagInput.trim();

    if (!trimmedTag || formData.tags.includes(trimmedTag)) return;

    setFormData((prev) => ({
      ...prev,
      tags: [...prev.tags, trimmedTag],
    }));

    setTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    let result: { success: boolean; error?: string } | undefined;

    const submitData = {
      ...formData,
      capacity: Number(formData.capacity),
      tags: formData.tags,
    };

    if (roomId) {
      result = await updateEventAction(roomId, submitData);
    } else {
      result = await createEvent(submitData);
    }

    // 🌟 result?.success とすることで、undefined の可能性を考慮
    if (result?.success) {
      toast.success(roomId ? '更新しました！' : '作成しました！');
      onSuccess();
    } else if (result?.error) {
      _setError(result.error);
    }
    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-6 w-full'>
      {error && (
        <div className='p-3 bg-red-100 text-red-600 rounded-lg text-sm'>
          {error}
        </div>
      )}

      {/* 1. イベント名 */}
      <Card variant='secondary shadow-none'>
        <CardContent className='gap-5'>
          <div className='flex flex-col gap-2.5'>
            <Label htmlFor='title'>
              <FileText className='w-4 h-4' />
              タイトル
            </Label>
            <Input
              id='title'
              required
              name='title'
              value={formData.title}
              onChange={handleChange}
              placeholder='例：週末焼肉会！'
            />
          </div>

          {/* 日時 */}
          <div className='flex flex-col gap-2.5'>
            <Label htmlFor='datetime'>
              <Calendar1 className='w-4 h-4' />
              開催日時
            </Label>
            <DateTimePicker
              value={formData.datetime}
              onChange={handleDateTimeChange}
              minDate={today}
            />
          </div>
        </CardContent>
      </Card>

      <Card variant='secondary shadow-none' className='h-[70px] !min-h-0'>
        {/* 💡 classNameに「flex-row」だけでなく「!flex-row」とビックリマークをつけて強制上書きします */}
        <CardContent className='!flex-row items-center justify-between w-full h-full py-0 '>
          {/* 募集人数（左側）: 不要な外側の div を消して Label を直接配置 */}
          <Label htmlFor='capacity'>
            <UserRound className='w-4 h-4' />
            {/* アイコンのサイズが崩れる場合は調整してください */}
            <span>参加人数の上限</span>
          </Label>
          <Stepper
            size='sm'
            className='w-[130px] h-[38px]'
            value={formData.capacity}
            onChange={handlecCpacityChange}
            min={2}
            max={100}
          />
        </CardContent>
      </Card>

      {/* 5. タグ */}
      <Card
        variant='secondary shadow-none'
        className='min-h-[104px] h-auto !min-h-0 py-4'
      >
        <CardContent>
          <div className='flex flex-col gap-2.5 w-full'>
            <Label htmlFor='tags'>
              <Tag className='w-4 h-4' />
              タグ (任意)
            </Label>
            <Input
              id='tags'
              type='text'
              value={tagInput}
              onChange={handleTagInputChange}
              placeholder='例: 雑談、和食、ワイワイ'
              buttonText='追加'
              buttonProps={{
                variant: 'secondary',
                size: 'xs',
                onClick: (e) => {
                  e.preventDefault();
                  handleAddTag();
                },
                type: 'button',
              }}
              onKeyDown={(e) => {
                if (e.nativeEvent.isComposing) return;

                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddTag();
                }
              }}
            />

            {formData.tags.length > 0 && (
              <div className='flex flex-wrap gap-1.5 mt-1 max-w-full'>
                {formData.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant='accent'
                    size='sm'
                    className='cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors'
                    onClick={() => handleRemoveTag(tag)}
                  >
                    #{tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 2. お店・場所 */}
      <Card variant='secondary shadow-none'>
        <CardContent>
          <div className='flex flex-col gap-2.5'>
            {/* 🌟 htmlFor='shop' を追加 */}
            <Label htmlFor='shop'>
              <Store className='w-4 h-4' />
              お店を選ぶ (任意)
            </Label>
            {/* RadioGroupで全体を囲み、RadioCardで個別の選択肢を作ります */}
            <RadioGroup value={formData.shop} onValueChange={handleShopChange}>
              {MOCK_SHOPS.map((shop) => (
                <RadioCard key={shop.name} value={shop.name} className='w-full'>
                  <RadioCardHeader>
                    <RadioCardTitle>{shop.name}</RadioCardTitle>
                    <RadioCardDescription>
                      {shop.description}
                    </RadioCardDescription>
                  </RadioCardHeader>
                </RadioCard>
              ))}
            </RadioGroup>
          </div>
        </CardContent>
      </Card>

      <Button
        type='submit'
        className='w-full'
        variant='accent'
        disabled={isProcessing}
      >
        {isProcessing ? (
          <span className='flex items-center justify-center gap-2.5'>
            <span className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin' />
            処理中...
          </span>
        ) : roomId ? (
          '変更する'
        ) : (
          '作成する'
        )}
      </Button>
    </form>
  );
};
