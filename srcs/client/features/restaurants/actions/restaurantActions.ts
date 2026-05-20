'use server';

import type {
  GetRestaurantOptionsResult,
  RestaurantList,
} from '@/app/types/restaurants';
import { getRestaurantOptionsResult } from '../libs/restaurantApi';

export async function getRestaurantOptions(): Promise<GetRestaurantOptionsResult> {
  try {
    const restaurantApiResponse = await getRestaurantOptionsResult();

    const restaurants: RestaurantList = restaurantApiResponse.places.reduce(
      (acc, place) => {
        acc[place.googlePlaceId] = {
          name: place.name,
          googleMapsUrl: place.googleMapsUrl,
          avgRating: place.avgRating,
          category: place.category,
          reviewCount: place.reviewCount,
          tags: place.tags.map((tag) => tag.name),
        };

        return acc;
      },
      {} as RestaurantList,
    );

    return {
      success: true,
      restaurants,
    };
  } catch (error) {
    console.error('Restaurant options action error: ', error);

    return {
      success: false,
      error: 'お店情報の取得に失敗しました',
    };
  }
}
