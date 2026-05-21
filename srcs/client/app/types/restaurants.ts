import { z } from 'zod';

// Tag 스키마
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

// type RestaurantTag = {
//   id: string;
//   name: string;
//   emoji: string;
//   count: number;
// };

// type RestaurantPlace = {
//   name: string;
//   googlePlaceId: string;
//   googleMapsUrl: string;
//   avgRating: number;
//   category: string;
//   reviewCount: number;
//   tags: RestaurantTag[];
// };

// export type RestaurantApiResponse = {
//   places: RestaurantPlace[];
//   totalCount: number;
//   generatedAt: string;
// };

export type GetRestaurantOptionsResult =
  | {
      success: true;
      restaurants: RestaurantList;
    }
  | {
      success: false;
      error: string;
    };
