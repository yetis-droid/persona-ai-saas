import React, { useState } from 'react';
import { dummyBanners } from '../utils/dummyBanners';

/**
 * アプリ風の画面下部固定バナー広告
 * 
 * 特徴:
 * - 画面下部に固定表示
 * - 閉じるボタン付き
 * - スマホアプリと同じUX
 * - 仮のバナー画像を表示
 */

interface BottomBannerAdProps {
  onClose?: () => void;
}

const BottomBannerAd: React.FC<BottomBannerAdProps> = ({ onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) onClose();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t-2 border-gray-200 shadow-2xl">
      <div className="relative">
        {/* 閉じるボタン */}
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 z-10 w-6 h-6 flex items-center justify-center bg-gray-800 bg-opacity-60 hover:bg-opacity-80 text-white rounded-full transition-all"
          aria-label="広告を閉じる"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* 広告コンテンツ */}
        <div className="flex items-center justify-center p-2 bg-white">
          <a
            href="https://example.com/ad"
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <img 
              src={dummyBanners.bottomBanner} 
              alt="広告バナー" 
              className="w-full max-w-4xl mx-auto"
            />
          </a>
        </div>

        {/* 広告ラベル */}
        <div className="absolute top-1 left-2 text-xs text-gray-400">
          広告
        </div>
      </div>
    </div>
  );
};

export default BottomBannerAd;
