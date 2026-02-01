import React from 'react';
import { useNavigate } from 'react-router-dom';

interface UsageLimitModalProps {
  isOpen: boolean;
  onClose: () => void;
  todayCount: number;
  dailyLimit: number;
  plan: string; // 'free' | 'premium' から string に変更
}

const UsageLimitModal: React.FC<UsageLimitModalProps> = ({
  isOpen,
  onClose,
  todayCount,
  dailyLimit,
  plan
}) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleUpgrade = () => {
    navigate('/pricing');
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative animate-fade-in">
        {/* 閉じるボタン */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* アイコン */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        </div>

        {/* メッセージ */}
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-3">
          今日の会話制限に達しました
        </h2>
        <p className="text-center text-gray-600 mb-6">
          {plan === 'free' ? '無料プラン' : 'プレミアムプラン'}の1日の上限（{dailyLimit}回）に達しました。
        </p>

        {/* 使用状況 */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 mb-6">
          <div className="flex justify-between items-center mb-3">
            <span className="text-gray-700 font-medium">今日の会話数</span>
            <span className="text-2xl font-bold text-gray-900">
              {todayCount} / {dailyLimit}
            </span>
          </div>
          <div className="relative w-full h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="absolute left-0 top-0 h-full bg-gradient-to-r from-red-500 to-red-600"
              style={{ width: '100%' }}
            />
          </div>
          <p className="text-sm text-gray-600 mt-3 text-center">
            明日の0時にリセットされます
          </p>
        </div>

        {/* アクション */}
        {plan === 'free' && (
          <>
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 mb-6 border border-purple-200">
              <div className="flex items-start space-x-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">プレミアムプランで解決</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    月額980円で1日100回まで会話可能になります
                  </p>
                </div>
              </div>
              <ul className="space-y-2 mb-4">
                <li className="flex items-center text-sm text-gray-700">
                  <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  1日100回の会話（月間3,000回）
                </li>
                <li className="flex items-center text-sm text-gray-700">
                  <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  LINE Bot連携が可能
                </li>
                <li className="flex items-center text-sm text-gray-700">
                  <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  人格を3個まで作成可能
                </li>
                <li className="flex items-center text-sm text-gray-700">
                  <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  無制限の会話履歴
                </li>
              </ul>
            </div>

            <button
              onClick={handleUpgrade}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 font-bold text-lg"
            >
              プレミアムにアップグレード
            </button>
            <button
              onClick={onClose}
              className="w-full mt-3 py-3 text-gray-600 hover:text-gray-800 transition-colors font-medium"
            >
              後で
            </button>
          </>
        )}

        {plan === 'premium' && (
          <button
            onClick={onClose}
            className="w-full py-4 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl hover:shadow-lg transition-all duration-200 font-bold"
          >
            閉じる
          </button>
        )}
      </div>
    </div>
  );
};

export default UsageLimitModal;
