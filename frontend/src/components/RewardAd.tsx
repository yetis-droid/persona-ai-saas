import React, { useState, useEffect } from 'react';
import { dummyBanners } from '../utils/dummyBanners';

interface RewardAdProps {
  isOpen: boolean;
  onClose: () => void;
  onRewardClaimed: () => void;
  rewardDuration?: number;
}

const RewardAd: React.FC<RewardAdProps> = ({
  isOpen,
  onClose,
  onRewardClaimed,
  rewardDuration = 15
}) => {
  const [timeLeft, setTimeLeft] = useState(rewardDuration);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setTimeLeft(rewardDuration);
      setIsCompleted(false);
      return;
    }

    if (timeLeft <= 0) {
      setIsCompleted(true);
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [isOpen, timeLeft, rewardDuration]);

  const handleClaimReward = () => {
    onRewardClaimed();
    onClose();
  };

  if (!isOpen) return null;

  const progress = ((rewardDuration - timeLeft) / rewardDuration) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 backdrop-blur-sm">
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6">
        {/* 閉じるボタン（視聴完了後のみ） */}
        {isCompleted && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        )}

        {/* 広告ラベル */}
        <div className="absolute top-4 left-4 px-2 py-1 bg-green-500 text-white rounded text-xs font-bold">
          リワード広告
        </div>

        {/* 広告画像 */}
        <div className="mt-8 mb-4">
          <img 
            src={dummyBanners.rewardAd} 
            alt="リワード広告" 
            className="mx-auto rounded-lg shadow-lg"
          />
        </div>

        {/* プログレスバー */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>視聴時間</span>
            <span>{timeLeft}秒</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 transition-all duration-1000 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* 報酬ボタン */}
        {isCompleted ? (
          <button
            onClick={handleClaimReward}
            className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold rounded-lg shadow-lg transition-all text-lg"
          >
            🎁 チケットを受け取る (+1チケット)
          </button>
        ) : (
          <div className="w-full py-4 bg-gray-200 text-gray-500 font-bold rounded-lg text-center text-lg">
            視聴を継続してください...
          </div>
        )}

        <p className="text-xs text-gray-500 text-center mt-3">
          {rewardDuration}秒間視聴すると+1チケットが付与されます
        </p>
      </div>
    </div>
  );
};

export default RewardAd;
