import React, { useState, useEffect } from 'react';

/**
 * リワード広告（報酬付き広告）
 * 
 * 特徴:
 * - 動画を見ると報酬（チケット）がもらえる
 * - アプリゲームでよく見るタイプ
 * - プログレスバーでカウントダウン
 */

interface RewardAdProps {
  isOpen: boolean;
  onClose: () => void;
  onRewardClaimed: () => void;
  rewardAmount?: number; // 報酬チケット数
}

const RewardAd: React.FC<RewardAdProps> = ({ 
  isOpen, 
  onClose,
  onRewardClaimed,
  rewardAmount = 1
}) => {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [countdown, setCountdown] = useState(15); // 15秒の動画風

  useEffect(() => {
    if (!isOpen) {
      setProgress(0);
      setIsComplete(false);
      setCountdown(15);
      return;
    }

    // プログレスバーとカウントダウン
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + (100 / 15); // 15秒で100%
        if (newProgress >= 100) {
          setIsComplete(true);
          clearInterval(interval);
          return 100;
        }
        return newProgress;
      });

      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen]);

  const handleClaimReward = () => {
    onRewardClaimed();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 backdrop-blur-sm">
      <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
        {/* ヘッダー */}
        <div className="relative h-48 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 flex items-center justify-center">
          {/* 報酬アイコン */}
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-3 bg-white rounded-full flex items-center justify-center shadow-2xl animate-bounce">
              <span className="text-5xl">🎫</span>
            </div>
            <h3 className="text-2xl font-bold text-white drop-shadow-lg">
              +{rewardAmount}チケット獲得
            </h3>
          </div>

          {/* 広告ラベル */}
          <div className="absolute top-3 left-3 px-2 py-1 bg-black bg-opacity-60 text-white rounded text-xs font-bold">
            広告
          </div>
        </div>

        {/* コンテンツ */}
        <div className="p-6 text-white">
          {!isComplete ? (
            <>
              {/* プログレスバー */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-300">広告を視聴中...</span>
                  <span className="text-lg font-bold">{countdown}秒</span>
                </div>
                <div className="relative w-full h-3 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="absolute left-0 top-0 h-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-1000 ease-linear"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* 広告コンテンツ */}
              <a
                href="https://example.com/ad"
                target="_blank"
                rel="noopener noreferrer"
                className="block p-4 bg-gray-800 rounded-xl hover:bg-gray-750 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">プレミアムプラン</p>
                    <p className="text-sm text-gray-400 truncate">広告なし・回数無制限</p>
                  </div>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </a>

              <p className="text-xs text-gray-400 text-center mt-4">
                広告を最後まで視聴すると、{rewardAmount}チケットがもらえます
              </p>
            </>
          ) : (
            <>
              {/* 完了画面 */}
              <div className="text-center py-4">
                <div className="w-16 h-16 mx-auto mb-4 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h4 className="text-xl font-bold mb-2">視聴完了！</h4>
                <p className="text-gray-300 mb-6">
                  {rewardAmount}チケットを獲得しました
                </p>
                <button
                  onClick={handleClaimReward}
                  className="w-full px-6 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                >
                  チケットを受け取る
                </button>
              </div>
            </>
          )}
        </div>

        {/* スキップボタン（視聴後のみ） */}
        {isComplete && (
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-white rounded-full transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default RewardAd;
