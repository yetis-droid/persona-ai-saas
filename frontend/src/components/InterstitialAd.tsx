import React, { useState, useEffect } from 'react';

/**
 * アプリ風の全画面ポップアップ広告
 * 
 * 特徴:
 * - ページ遷移時やアクション後に表示
 * - 5秒後にスキップボタン表示
 * - 背景をオーバーレイで暗く
 */

interface InterstitialAdProps {
  isOpen: boolean;
  onClose: () => void;
  skipDelay?: number; // スキップボタン表示までの秒数（デフォルト: 5秒）
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

    // カウントダウン
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-sm animate-fadeIn">
      {/* 広告コンテンツ */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 overflow-hidden animate-scaleIn">
        {/* 閉じるボタン（5秒後に表示） */}
        {canSkip && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 px-4 py-2 bg-gray-800 bg-opacity-80 hover:bg-opacity-100 text-white rounded-lg text-sm font-semibold transition-all flex items-center space-x-2 shadow-lg"
          >
            <span>スキップ</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}

        {/* カウントダウン表示 */}
        {!canSkip && (
          <div className="absolute top-4 right-4 z-10 px-3 py-1 bg-gray-800 bg-opacity-80 text-white rounded-lg text-sm font-semibold">
            {countdown}秒
          </div>
        )}

        {/* 広告ラベル */}
        <div className="absolute top-4 left-4 z-10 px-2 py-1 bg-yellow-400 text-gray-900 rounded text-xs font-bold">
          広告
        </div>

        {/* 広告内容 */}
        <a
          href="https://example.com/ad"
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          {/* 画像エリア */}
          <div className="relative h-64 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center">
            <div className="text-center text-white p-8">
              <div className="w-20 h-20 mx-auto mb-4 bg-white rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-2">プレミアムプランで広告なし</h3>
              <p className="text-lg opacity-90">月額¥980で快適に</p>
            </div>
          </div>

          {/* テキストエリア */}
          <div className="p-6 bg-gray-50">
            <h4 className="text-lg font-bold text-gray-900 mb-2">
              広告なしで快適な体験を
            </h4>
            <p className="text-sm text-gray-600 mb-4">
              プレミアムプランにアップグレードすると、広告が完全に非表示になり、より快適にサービスをご利用いただけます。
            </p>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-purple-600">¥980/月</span>
              <span className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg transition-shadow">
                今すぐ登録
              </span>
            </div>
          </div>
        </a>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default InterstitialAd;
