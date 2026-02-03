import React, { useState, useEffect } from 'react';
import { dummyBanners } from '../utils/dummyBanners';

interface InterstitialAdProps {
  isOpen: boolean;
  onClose: () => void;
  skipDelay?: number;
}

const InterstitialAd: React.FC<InterstitialAdProps> = ({ 
  isOpen, 
  onClose,
  skipDelay = 5 
}) => {
  const [countdown, setCountdown] = useState(skipDelay);
  const [canSkip, setCanSkip] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setCountdown(skipDelay);
      setCanSkip(false);
      return;
    }

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setCanSkip(true);
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, skipDelay]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-sm">
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 p-6">
        {/* スキップボタン */}
        {canSkip && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-lg text-sm font-semibold"
          >
            スキップ ✕
          </button>
        )}

        {/* カウントダウン */}
        {!canSkip && (
          <div className="absolute top-4 right-4 px-3 py-1 bg-gray-800 text-white rounded-lg text-sm font-semibold">
            {countdown}秒
          </div>
        )}

        {/* 広告ラベル */}
        <div className="absolute top-4 left-4 px-2 py-1 bg-yellow-400 text-gray-900 rounded text-xs font-bold">
          広告
        </div>

        {/* 広告画像 */}
        <a
          href="https://example.com/ad"
          target="_blank"
          rel="noopener noreferrer"
          className="block mt-8"
        >
          <img 
            src={dummyBanners.interstitialAd} 
            alt="インタースティシャル広告" 
            className="mx-auto rounded-lg"
          />
        </a>
      </div>
    </div>
  );
};

export default InterstitialAd;
