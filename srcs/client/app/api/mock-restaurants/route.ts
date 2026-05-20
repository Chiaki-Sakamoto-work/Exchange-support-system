// app/api/mock-restaurants/route.ts

import { NextResponse } from 'next/server';
import type { RestaurantApiResponse } from '@/app/types/restaurants';

export async function GET() {
  const mockJson = {
    places: [
      {
        name: 'ブルーボトルコーヒー 渋谷カフェ',
        googlePlaceId: 'ChIJb_f1R46MGGARW-wKjU_wXFk',
        googleMapsUrl: 'https://maps.google.com/?cid=1000000001',
        avgRating: 4.3,
        category: 'カフェ',
        reviewCount: 1250,
        tags: [
          { id: 'tag_01', name: 'おしゃれ', emoji: '✨', count: 120 },
          { id: 'tag_02', name: '落ち着く', emoji: '☕', count: 85 },
        ],
      },
      {
        name: '渋谷 焼肉 ざぶとん',
        googlePlaceId: 'ChIJr_x2S5-MGGARV_yLjV_zYGl',
        googleMapsUrl: 'https://maps.google.com/?cid=1000000002',
        avgRating: 4.8,
        category: '焼肉',
        reviewCount: 340,
        tags: [
          { id: 'tag_03', name: 'コスパ最高', emoji: '🍖', count: 50 },
          { id: 'tag_04', name: '個室あり', emoji: '🚪', count: 20 },
        ],
      },
      {
        name: 'すしざんまい 渋谷東口店',
        googlePlaceId: 'ChIJQx_A_N-MGGART_xLjV_zYG3',
        googleMapsUrl: 'https://maps.google.com/?cid=1000000003',
        avgRating: 4.1,
        category: '寿司',
        reviewCount: 2100,
        tags: [
          { id: 'tag_05', name: '新鮮', emoji: '🍣', count: 300 },
          { id: 'tag_06', name: '24時間営業', emoji: '⏰', count: 150 },
        ],
      },
      {
        name: 'らーめん 渋谷家',
        googlePlaceId: 'ChIJXy_B_N-MGGARU_xLjV_zYG4',
        googleMapsUrl: 'https://maps.google.com/?cid=1000000004',
        avgRating: 4.5,
        category: 'ラーメン',
        reviewCount: 890,
        tags: [
          { id: 'tag_07', name: '濃厚スープ', emoji: '🍜', count: 210 },
          { id: 'tag_08', name: '行列店', emoji: '🚶', count: 95 },
        ],
      },
      {
        name: '大衆酒場 渋谷どん',
        googlePlaceId: 'ChIJYy_C_N-MGGARV_xLjV_zYG5',
        googleMapsUrl: 'https://maps.google.com/?cid=1000000005',
        avgRating: 4.0,
        category: '居酒屋',
        reviewCount: 450,
        tags: [
          { id: 'tag_09', name: 'ワイワイ', emoji: '🍻', count: 180 },
          { id: 'tag_10', name: '安い', emoji: '💴', count: 130 },
        ],
      },
      {
        name: 'トラットリア シブヤ',
        googlePlaceId: 'ChIJZy_D_N-MGGARW_xLjV_zYG6',
        googleMapsUrl: 'https://maps.google.com/?cid=1000000006',
        avgRating: 4.6,
        category: 'イタリアン',
        reviewCount: 320,
        tags: [
          { id: 'tag_11', name: 'デート向け', emoji: '🍷', count: 140 },
          { id: 'tag_12', name: 'パスタが絶品', emoji: '🍝', count: 90 },
        ],
      },
      {
        name: 'シブヤ クラフトバーガー',
        googlePlaceId: 'ChIJay_E_N-MGGARX_xLjV_zYG7',
        googleMapsUrl: 'https://maps.google.com/?cid=1000000007',
        avgRating: 4.4,
        category: 'ハンバーガー',
        reviewCount: 560,
        tags: [
          { id: 'tag_13', name: 'ボリューミー', emoji: '🍔', count: 200 },
          { id: 'tag_14', name: 'テイクアウト可', emoji: '🥡', count: 80 },
        ],
      },
      {
        name: 'スパイスカレー 渋谷',
        googlePlaceId: 'ChIJby_F_N-MGGARY_xLjV_zYG8',
        googleMapsUrl: 'https://maps.google.com/?cid=1000000008',
        avgRating: 4.7,
        category: 'カレー',
        reviewCount: 670,
        tags: [
          { id: 'tag_15', name: '本格スパイス', emoji: '🍛', count: 250 },
          { id: 'tag_16', name: '辛さ調節可', emoji: '🌶️', count: 110 },
        ],
      },
      {
        name: '渋谷 ベーカリー工房',
        googlePlaceId: 'ChIJcy_G_N-MGGARZ_xLjV_zYG9',
        googleMapsUrl: 'https://maps.google.com/?cid=1000000009',
        avgRating: 4.2,
        category: 'パン屋',
        reviewCount: 150,
        tags: [
          { id: 'tag_17', name: '焼きたて', emoji: '🥐', count: 60 },
          { id: 'tag_18', name: '朝食にぴったり', emoji: '🍞', count: 45 },
        ],
      },
      {
        name: 'Bar Shibuya Nights',
        googlePlaceId: 'ChIJdy_H_N-MGGARa_xLjV_zY10',
        googleMapsUrl: 'https://maps.google.com/?cid=1000000010',
        avgRating: 4.9,
        category: 'バー',
        reviewCount: 120,
        tags: [
          { id: 'tag_19', name: 'カクテルが豊富', emoji: '🍸', count: 80 },
          { id: 'tag_20', name: '雰囲気が良い', emoji: '🌃', count: 55 },
        ],
      },
    ],
    totalCount: 10,
    generatedAt: '2026-05-20T13:00:00.000Z',
  } as RestaurantApiResponse;

  return NextResponse.json(mockJson);
}
