import { z } from 'zod';

export const TagSchema = z.object({
  id: z.string(),
  name: z.string(),
  emoji: z.string().nullable(),
  count: z.number(),
});

export const PlaceSchema = z.object({
  name: z.string(),
  category: z.string().nullable(),
  googlePlaceId: z.string(),
  googleMapsUrl: z.string(),
  avgRating: z.number(),
  reviewCount: z.number(),
  tags: z.array(TagSchema),
});

export const RestaurantApiResponseSchema = z.object({
  places: z.array(PlaceSchema),
  totalCount: z.number(),
  generatedAt: z.string(),
});

export type RestaurantApiResponse = z.infer<typeof RestaurantApiResponseSchema>;

export type RestaurantInfo = {
  name: string;
  googleMapsUrl: string;
  avgRating: number;
  category: string | null;
  reviewCount: number;
  tags: string[];
};

export type RestaurantList = Record<string, RestaurantInfo>;

export type GetRestaurantOptionsResult =
  | {
      success: true;
      restaurants: RestaurantList;
    }
  | {
      success: false;
      error: string;
    };
