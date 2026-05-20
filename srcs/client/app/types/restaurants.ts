export type RestaurantInfo = {
  name: string;
  googleMapsUrl: string;
  avgRating: number;
  category: string;
  reviewCount: number;
  tags: string[];
};

export type RestaurantList = Record<string, RestaurantInfo>;

type RestaurantTag = {
  id: string;
  name: string;
  emoji: string;
  count: number;
};

type RestaurantPlace = {
  name: string;
  googlePlaceId: string;
  googleMapsUrl: string;
  avgRating: number;
  category: string;
  reviewCount: number;
  tags: RestaurantTag[];
};

export type RestaurantApiResponse = {
  places: RestaurantPlace[];
  totalCount: number;
  generatedAt: string;
};

export type GetRestaurantOptionsResult =
  | {
      success: true;
      restaurants: RestaurantList;
    }
  | {
      success: false;
      error: string;
    };
