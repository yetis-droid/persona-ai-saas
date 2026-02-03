import React, { useState } from 'react';

/**
 * アプリ風の画面下部固定バナー広告
 * 
 * 特徴:
 * - 画面下部に固定表示
 * - 閉じるボタン付き
 * - スマホアプリと同じUX
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
        <div className="flex items-center justify-center p-3 bg-gradient-to-r from-blue-50 to-purple-50">
          <a
            href="https://example.com/ad"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-3 w-full max-w-4xl"
          >
            {/* 広告画像 */}
            <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>

            {/* 広告テキスト */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-900 truncate">
                プレミアムプランで広告なし！
              </p>
              <p className="text-xs text-gray-600 truncate">
                月額¥980で快適にご利用いただけます
              </p>
            </div>

            {/* CTAボタン */}
            <div className="flex-shrink-0">
              <span className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold rounded-lg hover:shadow-lg transition-shadow">
                詳しく見る
              </span>
            </div>
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
