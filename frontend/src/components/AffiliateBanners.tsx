import React from 'react';
import SimpleBanner from './SimpleBanner';

/**
 * アフィリエイトバナー広告コンポーネント
 * 
 * 使い方:
 * 1. A8.net や もしもアフィリエイト でバナー広告を取得
 * 2. 画像URLとリンクURLを設定
 * 3. このコンポーネントをDashboardなどで使用
 */

interface AffiliateBannersProps {
  className?: string;
}

const AffiliateBanners: React.FC<AffiliateBannersProps> = ({ className = '' }) => {
  // ここにアフィリエイト広告のURLを設定
  const banners = [
    {
      id: 1,
      imageUrl: 'https://via.placeholder.com/728x90/4F46E5/FFFFFF?text=Advertisement+1',
      linkUrl: 'https://example.com/affiliate-link-1',
      altText: '広告: サービス名1'
    },
    {
      id: 2,
      imageUrl: 'https://via.placeholder.com/300x250/7C3AED/FFFFFF?text=Advertisement+2',
      linkUrl: 'https://example.com/affiliate-link-2',
      altText: '広告: サービス名2'
    }
  ];

  return (
    <div className={`affiliate-banners space-y-6 ${className}`}>
      <p className="text-sm text-gray-500 text-center mb-4">スポンサー広告</p>
      
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
