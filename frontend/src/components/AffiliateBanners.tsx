import React from 'react';
import SimpleBanner from './SimpleBanner';
import { dummyBanners } from '../utils/dummyBanners';

/**
 * アフィリエイトバナー広告コンポーネント
 * 
 * 複数のバナー広告を表示
 * 無料プランのユーザーのみ表示
 */

const AffiliateBanners: React.FC = () => {
  const banners = [
    {
      id: 1,
      imageUrl: dummyBanners.affiliateBanner1,
      linkUrl: 'https://example.com/canva',
      altText: '広告: Canva Pro'
    },
    {
      id: 2,
      imageUrl: dummyBanners.affiliateBanner2,
      linkUrl: 'https://example.com/adobe',
      altText: '広告: Adobe Creative Cloud'
    }
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-gray-600 flex items-center">
        <span className="mr-2">📢</span>
        スポンサー広告
      </h3>
      {banners.map((banner) => (
        <SimpleBanner
          key={banner.id}
          imageUrl={banner.imageUrl}
          linkUrl={banner.linkUrl}
          altText={banner.altText}
        />
      ))}
    </div>
  );
};

export default AffiliateBanners;
