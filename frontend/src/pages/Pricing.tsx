import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import api from '../utils/api';

interface Plan {
  id: 'free' | 'premium';
  name: string;
  price: number;
  period: string;
  description: string;
  features: string[];
  limitations?: string[];
  badge?: string;
  badgeColor?: string;
}

const plans: Plan[] = [
  {
    id: 'free',
    name: '無料プラン',
    price: 0,
    period: '永久無料',
    description: 'まずは無料で試してみる',
    features: [
      '人格を1個作成可能',
      '1日10回まで会話可能',
      '月間300回の会話',
      'Web版チャット',
      '7日間の会話履歴',
    ],
    limitations: [
      'LINE連携不可',
      '優先サポート対象外',
    ]
  },
  {
    id: 'premium',
    name: 'プレミアムプラン',
    price: 980,
    period: '月額',
    description: 'より多くの会話と本格運用',
    badge: 'おすすめ',
    badgeColor: 'bg-gradient-to-r from-yellow-400 to-orange-500',
    features: [
      '人格を3個まで作成可能',
      '1日100回まで会話可能',
      '月間3,000回の会話',
      'Web版チャット',
      'LINE Bot連携',
      '無制限の会話履歴',
      '優先サポート',
      '高速レスポンス',
    ]
  }
];

const Pricing: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSelectPlan = async (planId: 'free' | 'premium') => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (planId === 'free') {
      // 無料プランを選択した場合はダッシュボードへ
      navigate('/dashboard');
      return;
    }

    // プレミアムプラン
    try {
      setLoading(true);
      setError('');
      
      const response = await api.post('/api/subscription/create-checkout-session');

      // Stripeのチェックアウトページへリダイレクト
      window.location.href = response.data.url;
    } catch (err: any) {
      console.error('Error creating checkout session:', err);
      setError(err.response?.data?.error || '決済ページの作成に失敗しました');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* ヘッダー */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(user ? '/dashboard' : '/')}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                料金プラン
              </h1>
            </div>
            {user && (
              <button
                onClick={() => navigate('/dashboard')}
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:shadow-lg transition-shadow"
              >
                ダッシュボードへ
              </button>
            )}
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* 見出し */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            あなたに最適なプランを選択
          </h2>
          <p className="text-xl text-gray-600">
            無料プランで始めて、必要に応じてアップグレード
          </p>
        </div>

        {/* エラーメッセージ */}
        {error && (
          <div className="max-w-2xl mx-auto mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* プラン比較カード */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all hover:scale-105 ${
                plan.badge ? 'ring-2 ring-purple-500' : ''
              }`}
            >
              {/* バッジ */}
              {plan.badge && (
                <div className="absolute top-0 right-0 m-4">
                  <span className={`px-3 py-1 text-xs font-bold text-white rounded-full ${plan.badgeColor}`}>
                    {plan.badge}
                  </span>
                </div>
              )}

              {/* カードコンテンツ */}
              <div className="p-8">
                {/* プラン名 */}
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <p className="text-gray-600 mb-6">
                  {plan.description}
                </p>

                {/* 価格 */}
                <div className="mb-6">
                  <div className="flex items-baseline">
                    <span className="text-5xl font-extrabold text-gray-900">
                      ¥{plan.price.toLocaleString()}
                    </span>
                    <span className="ml-2 text-gray-600">
                      / {plan.period}
                    </span>
                  </div>
                </div>

                {/* 機能リスト */}
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <svg
                        className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                  {plan.limitations?.map((limitation, index) => (
                    <li key={`limitation-${index}`} className="flex items-start">
                      <svg
                        className="w-5 h-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                      <span className="text-gray-500">{limitation}</span>
                    </li>
                  ))}
                </ul>

                {/* 選択ボタン */}
                <button
                  onClick={() => handleSelectPlan(plan.id)}
                  disabled={loading}
                  className={`w-full py-3 px-6 rounded-lg font-medium transition-all ${
                    plan.id === 'premium'
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {loading ? '処理中...' : plan.id === 'free' ? '無料で始める' : 'プレミアムを購入'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* 追加情報 */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            よくある質問
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto text-left">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h4 className="font-bold text-gray-900 mb-2">無料プランから始められますか？</h4>
              <p className="text-gray-600">
                はい、いつでも無料プランで始められます。プレミアムプランはいつでもアップグレード可能です。
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h4 className="font-bold text-gray-900 mb-2">解約はいつでもできますか？</h4>
              <p className="text-gray-600">
                はい、いつでも解約可能です。解約後も期間終了まで使用できます。
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h4 className="font-bold text-gray-900 mb-2">支払い方法は？</h4>
              <p className="text-gray-600">
                クレジットカード（Visa、MasterCard、American Express等）に対応しています。
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h4 className="font-bold text-gray-900 mb-2">返金はできますか？</h4>
              <p className="text-gray-600">
                プレミアムプランの初回購入から14日以内であれば、全額返金いたします。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
