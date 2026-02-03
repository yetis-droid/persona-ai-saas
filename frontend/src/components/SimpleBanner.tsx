import React from 'react';

interface SimpleBannerProps {
  imageUrl: string;      // バナー画像のURL
  linkUrl: string;       // クリック時の遷移先URL
  altText: string;       // 画像の代替テキスト
  className?: string;    // カスタムクラス
}

const SimpleBanner: React.FC<SimpleBannerProps> = ({
  imageUrl,
  linkUrl,
  altText,
  className = ''
}) => {
  return (
    <div className={`simple-banner ${className}`}>
      <a 
        href={linkUrl} 
        target="_blank" 
        rel="noopener noreferrer"
        className="block hover:opacity-80 transition-opacity"
      >
        <img 
          src={imageUrl} 
          alt={altText}
          className="w-full h-auto rounded-lg shadow-md"
        />
      </a>
    </div>
  );
};

export default SimpleBanner;
