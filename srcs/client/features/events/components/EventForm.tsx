'use client';

import type { profiles } from '@prisma/client';
import type { GetRestaurantOptionsResult, Room } from '@type';
import {
  ArrowLeftRight,
  Calendar1,
  FileText,
  MapPin,
  Star,
  Store,
  Tag,
  UserRound,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogBody,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
} from '@/components/ui/AlertDialog';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card';
import { DateTimePicker } from '@/components/ui/DateTimePicker';
import { HoverCard } from '@/components/ui/HoverCard';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import {
  RadioCard,
  RadioCardDescription,
  RadioCardHeader,
  RadioCardTitle,
} from '@/components/ui/RadioCard';
import { RadioGroup } from '@/components/ui/RadioGroup';
import { SearchInput } from '@/components/ui/SearchInput';
import { Stepper } from '@/components/ui/Stepper';
import { getRestaurantOptions } from '@/features/restaurants/actions/restaurantActions';
import { RestaurantRadioCardSkeleton } from '@/features/restaurants/components/RestaurantRadioCardSkeleton';
import { UserAvatar } from '@/features/users/components/UserAvatar';
import { UserBadge } from '@/features/users/components/UserBadge/UserBadge';
import { getDisplayName, isNewRecruit } from '@/features/users/lib/profile';
import { createEvent, updateEventAction } from '../actions/eventActions';

type Props = {
  onSuccess: () => void;
  onCancel?: () => void;
  // 💡 initialData の型定義を完全にこちらへ差し替えてください
  initialData?: Room & {
    user_rooms: (Room['user_rooms'][number] & {
      profiles: NonNullable<Room['user_rooms'][number]['profiles']>;
    })[];
  };
  roomId?: number;
};

export const EventForm = ({
  onSuccess,
  onCancel,
  initialData,
  roomId,
}: Props) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, _setError] = useState<string | null>(null);

  const [tagInput, setTagInput] = useState('');

  const [searchQuery, setSearchQuery] = useState('');

  const currentHostId = initialData?.user_rooms?.find(
    (ur) => ur.is_owner,
  )?.user_id;

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    datetime: initialData?.event_start_at
      ? new Date(initialData.event_start_at).toISOString().slice(0, 16)
      : '',
    capacity: initialData?.capacity_limit || 4,
    tags: initialData?.room_tags?.map((rt) => rt.tags.name) || ([] as string[]),
    shop: initialData?.location_name || '',
    hostId: currentHostId || '',
  });

  // テストデータ
  const [restaurantData, setRestaurantData] =
    useState<GetRestaurantOptionsResult | null>(null);

  useEffect(() => {
    const fetchRestaurants = async () => {
      const result = await getRestaurantOptions();
      setRestaurantData(result);
    };

    fetchRestaurants();
  }, []);

  const shopList = restaurantData?.success
    ? Object.entries(restaurantData.restaurants || {}).map(
        ([placeId, data]) => ({
          placeId,
          ...data,
        }),
      )
    : [];

  const today = new Date().toISOString().split('T')[0];

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >, // 🌟 ここに HTMLSelectElement を追加！
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

    const selectedShopData = shopList.find(
      (shop) => shop.name === formData.shop,
    );

    const submitData = {
      ...formData,
      capacity: Number(formData.capacity),
      tags: formData.tags,
      locationAddress: selectedShopData?.googleMapsUrl || '',
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

  const filteredShops = shopList.filter((shop) => {
    if (!searchQuery) return true; // 何も入力されていなければ全て表示
    const lowerQuery = searchQuery.toLowerCase();
    return (
      shop.name.toLowerCase().includes(lowerQuery) ||
      shop.category?.toLowerCase().includes(lowerQuery) ||
      shop.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
    );
  });

  const [isTransferDialogOpen, setIsTransferDialogOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<
    Room['user_rooms'][number]['profiles'] | null
  >(null);
  const participants = initialData?.user_rooms || [];
  const totalParticipantsCount =
    (initialData as unknown as { count?: { user_rooms: number } })?.count
      ?.user_rooms ?? participants.length;
  const transferCandidates = participants.filter((ur) => !ur.is_owner); // 👈 自分を除外！

  // 切り分ける配列を候補者リスト（transferCandidates）に変更
  const visibleParticipants = transferCandidates.slice(0, 5);
  const overflowParticipants = transferCandidates.slice(5);
  const handleSelectParticipant = (participant: Room['user_rooms'][number]) => {
    setSelectedProfile(participant.profiles);
    setIsTransferDialogOpen(true); // バッジをクリックしたらアラートを開く
  };
  const handleConfirmTransfer = async () => {
    if (!roomId || !selectedProfile) return;

    setIsProcessing(true);

    const selectedShopData = shopList.find(
      (shop) => shop.name === formData.shop,
    );

    // 💡 確実に新しいホストのID（selectedProfile.id）だけをターゲットにして送信する
    const submitData = {
      title: formData.title,
      datetime: formData.datetime,
      capacity: Number(formData.capacity),
      tags: formData.tags,
      shop: formData.shop,
      hostId: selectedProfile.id, // ⭕ 混ざり物のない、新しいホストのUUIDをここで確定させる
      locationAddress: selectedShopData?.googleMapsUrl || '',
    };

    const result = await updateEventAction(roomId, submitData);

    if (result?.success) {
      toast.success('ホスト権限を移動しました！');
      setIsTransferDialogOpen(false);
      onSuccess(); // これでマイイベント一覧が更新され、主催タブから消えます
    } else {
      toast.error(result?.error || 'ホスト移動に失敗しました');
    }

    setIsProcessing(false);
  };

  const getUserBadgeUser = (profile: profiles | null) => ({
    name: getDisplayName(profile),
    avatarUrl: profile?.avatar_url,
    isNewRecruit: isNewRecruit(profile),
  });

  const isRestaurantLoading = restaurantData === null;
  const restaurantError =
    restaurantData?.success === false ? restaurantData.error : null;

  const renderParticipantBadge = (
    participant: Room['user_rooms'][number],
    variant: 'default' | 'secondary' = 'default',
  ) => {
    const profile = participant.profiles;

    return (
      <UserBadge
        key={`${participant.room_id}-${participant.user_id}`}
        leadingVisual='dot'
        variant={formData.hostId === participant.user_id ? 'accept' : variant}
        className='hover:bg-accent hover:text-accent-foreground'
        user={getUserBadgeUser(profile)}
        onClick={() => handleSelectParticipant(participant)}
      />
    );
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
          <div className='flex flex-col gap-3 w-full'>
            <Label htmlFor='shop'>
              <Store className='w-4 h-4' />
              お店を選ぶ (任意)
            </Label>

            {/* 🌟 1. 検索バーの追加 */}
            <div className='flex items-center gap-3'>
              <SearchInput
                type='text'
                placeholder='店名、カテゴリ、タグで検索...'
                className='w-full rounded-full'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* 2. スクロールエリア */}
            <div className='max-h-[280px] pt-2 overflow-y-auto pr-1 pb-1 space-y-2 scrollbar-thin w-full'>
              {isRestaurantLoading ? (
                <RestaurantRadioCardSkeleton />
              ) : restaurantError ? (
                <div className='py-8 text-center w-full'>
                  <p className='text-sm text-zinc-500'>{restaurantError}</p>
                </div>
              ) : filteredShops.length > 0 ? (
                /* 🌟 RadioGroup 自体も横幅いっぱいに広げる */
                <RadioGroup
                  value={formData.shop}
                  onValueChange={handleShopChange}
                  className='w-full grid gap-2'
                >
                  {filteredShops.map((shop) => (
                    <RadioCard
                      key={shop.placeId}
                      value={shop.name}
                      className='w-full min-w-0 max-w-full hover:scale-100'
                    >
                      <RadioCardHeader className='w-full min-w-0 p-0'>
                        <RadioCardTitle className='text-foreground flex items-center justify-between gap-2 max-w-[250px] min-w-0'>
                          {shop.googleMapsUrl && (
                            <a
                              href={shop.googleMapsUrl}
                              target='_blank'
                              rel='noopener noreferrer'
                              className='group/pin relative flex items-center border-b border-transparent hover:border-accent hover:text-accent/70 z-10 shrink-0'
                              onClick={(e) => e.stopPropagation()}
                            >
                              {/* <GoogleMapPin className='size-5 ' /> */}
                              <MapPin className='size-4 text-accent hover:text-accent/80' />

                              {/* <span className='absolute bottom-full left-1/2 -translate-x-1/2 mb-0 hidden group-hover/pin:block w-max bg-white/70 rounded px-2 py-0 text-[10px] text-accent'>
                                マップで見る
                              </span> */}
                            </a>
                          )}
                          <span className='truncate shrink w-full'>
                            {shop.name}
                          </span>
                        </RadioCardTitle>
                      </RadioCardHeader>
                      <RadioCardDescription className='w-full min-w-0'>
                        <div className='flex flex-col gap-1.5 mt-1 w-full min-w-0'>
                          <div className='flex items-center gap-2 text-xs text-zinc-600 w-full'>
                            <span className='font-medium shrink-0'>
                              {shop.category}
                            </span>
                            <span className='shrink-0'>•</span>
                            <span className='flex flex-row items-center gap-1 text-yellow-500 font-medium shrink-0'>
                              <Star className='size-3' fill='currentColor' />
                              {shop.avgRating.toFixed(1)}
                            </span>
                            <span className='text-muted-foreground shrink-0'>
                              ({shop.reviewCount}件)
                            </span>
                          </div>

                          {shop.tags && shop.tags.length > 0 && (
                            <div className='flex flex-wrap gap-1 w-full min-w-0 '>
                              {shop.tags.slice(0, 3).map((tag) => (
                                <Badge key={tag} size='xs' variant='secondary'>
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </RadioCardDescription>
                    </RadioCard>
                  ))}
                </RadioGroup>
              ) : (
                <div className='py-8 text-center w-full'>
                  <p className='text-sm text-zinc-500'>
                    該当するお店が見つかりません
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {roomId && totalParticipantsCount > 1 && (
        <>
          <Card
            variant='secondary shadow-none'
            className='h-auto w-full min-h-0!'
          >
            <CardContent>
              <Label>
                <ArrowLeftRight className='w-4 h-4' />
                ホスト権限を移動
              </Label>
              <span className='py-1 text-[12px] text-muted-foreground block'>
                選ぶと自分は普通の参加者になり、その人がホストになります。
              </span>

              <div className='py-2 flex flex-wrap gap-2'>
                {visibleParticipants.map((participant) =>
                  renderParticipantBadge(participant),
                )}

                {/* overflowParticipants の HoverCard 処理もここにそのまま移植 */}
                {overflowParticipants.length > 0 ? (
                  <HoverCard openDelay={120} closeDelay={120}>
                    {/* ...提示された HoverCard の中身をそのまま配置... */}
                  </HoverCard>
                ) : null}
              </div>
            </CardContent>
          </Card>

          {/* 💡 【新規追加】ホスト移動確認のAlertDialogもここに移植 */}
          <AlertDialog
            open={isTransferDialogOpen}
            onOpenChange={setIsTransferDialogOpen}
          >
            <AlertDialogContent>
              <AlertDialogTitle className='text-xl'>
                ホストを移動しますか？
              </AlertDialogTitle>
              <AlertDialogDescription>
                この人にホスト権限を渡します。あなたは普通の参加者になり、このルームは「参加予定」に移ります。
              </AlertDialogDescription>
              <AlertDialogBody>
                {/* アバターカード部分 */}
                <Card
                  variant='secondary shadow-none'
                  className='min-h-0! py-4!'
                >
                  <CardHeader className='flex flex-row items-center gap-3 px-4'>
                    <UserAvatar
                      name={selectedProfile?.username}
                      imageSrc={selectedProfile?.avatar_url}
                      fallbackClassName={
                        isNewRecruit(selectedProfile)
                          ? 'bg-accent text-accent-foreground'
                          : undefined
                      }
                    />
                    <div>
                      <CardTitle>{getDisplayName(selectedProfile)}</CardTitle>
                      <CardDescription>
                        さんを新しいホストにします
                      </CardDescription>
                    </div>
                    {isNewRecruit(selectedProfile) ? (
                      <CardAction className='self-center'>
                        <Badge variant='accent' size='xs'>
                          新
                        </Badge>
                      </CardAction>
                    ) : null}
                  </CardHeader>
                </Card>
              </AlertDialogBody>
              <AlertDialogFooter>
                <AlertDialogCancel variant='outline'>
                  キャンセル
                </AlertDialogCancel>
                <AlertDialogAction
                  variant='accent'
                  onClick={handleConfirmTransfer}
                >
                  ホストを移動
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}

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

      {roomId && (
        <Button
          type='button'
          className='w-full'
          variant='outline'
          disabled={isProcessing}
          onClick={onCancel}
        >
          キャンセル
        </Button>
      )}
    </form>
  );
};
