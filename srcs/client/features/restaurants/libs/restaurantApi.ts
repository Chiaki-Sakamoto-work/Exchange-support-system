import { type RestaurantApiResponse, RestaurantApiResponseSchema } from '@type';

export async function getRestaurantOptionsResult(): Promise<RestaurantApiResponse> {
  const endpoint = process.env.RESTAURANT_API_URL;
  const apiKey = process.env.RESTAURANT_API_KEY;

  if (!endpoint) {
    throw new Error('RESTAURANT_API_URLが未設定です');
  }

  if (!apiKey) {
    throw new Error('RESTAURANT_API_KEYが未設定です');
  }

  const response = await fetch(endpoint, {
    cache: 'no-store',
    headers: {
      // biome-ignore lint/style/useNamingConvention: <this is external API Rule>
      Authorization: `Bearer ${apiKey}`,
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error(
        'API認証エラー: APIキーが正しくありません (401 Unauthorized)',
      );
    }
    throw new Error('お店情報取得に失敗しました');
  }

  //　todo: 今後zod使用に行くのが良さそうsafeparseを使って
  const json = await response.json();
  const parsedData = RestaurantApiResponseSchema.safeParse(json);

  if (!parsedData.success) {
    console.error('APIレスポンスの型が一致しません:', parsedData.error);
    throw new Error('APIレスポンスのデータ形式が不正です');
  }

  return parsedData.data;
}
