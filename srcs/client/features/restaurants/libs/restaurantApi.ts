import type { RestaurantApiResponse } from '@/app/types/restaurants';

export async function getRestaurantOptionsResult(): Promise<RestaurantApiResponse> {
  const endpoint = process.env.RESTAURANT_API_URL;

  if (!endpoint) {
    throw new Error('RESTAURANT_API_URLが未設定です');
  }

  const response = await fetch(endpoint, { cache: 'no-store' });

  if (!response.ok) {
    throw new Error('お店情報取得に失敗しました');
  }

  //　todo: 今後zod使用に行くのが良さそうsafeparseを使って
  const json = await response.json();
  const data = json as RestaurantApiResponse;

  return data;
}
