import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

interface TicketProduct {
  id: string;
  amount: number;
  tickets: number;
  name: string;
  description: string;
  perTicketCost: number;
}

export default function Tickets() {
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<TicketProduct[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadBalance();
    loadProducts();
  }, []);

  async function loadBalance() {
    try {
      const response = await api.get('/api/tickets/balance');
      setBalance(response.data.balance);
    } catch (error) {
      console.error('Failed to load balance:', error);
    }
  }

  async function loadProducts() {
    try {
      const response = await api.get('/api/tickets/products');
      setProducts(response.data.products);
    } catch (error) {
      console.error('Failed to load products:', error);
      // フォールバック: ハードコード
      setProducts([
        { id: '10', amount: 110, tickets: 10, name: '10回チケット', description: '10回分の会話チケット（有効期限180日）', perTicketCost: 11 },
        { id: '50', amount: 440, tickets: 50, name: '50回チケット', description: '50回分の会話チケット（有効期限180日）🔥 人気No.1', perTicketCost: 8.8 },
        { id: '100', amount: 770, tickets: 100, name: '100回チケット', description: '100回分の会話チケット（有効期限180日）💎 最安値', perTicketCost: 7.7 }
      ]);
    }
  }

  async function purchaseTicket(ticketType: string) {
    setLoading(true);
    try {
      const response = await api.post('/api/tickets/purchase', { ticketType });
      window.location.href = response.data.checkoutUrl;
    } catch (error) {
      console.error('Purchase failed:', error);
      alert('購入に失敗しました');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* ヘッダー */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="mb-4 text-purple-600 hover:text-purple-700 flex items-center gap-2"
          >
            ← ダッシュボードに戻る
          </button>

          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            🎫 会話チケット
          </h1>
          <p className="text-gray-600">
            チケットを購入して、いつでも好きなだけ会話できます
          </p>
          
          {/* 現在の残高 */}
          <div className="mt-4 p-4 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl text-white">
            <div className="text-sm opacity-90">現在の残高</div>
            <div className="text-4xl font-bold mt-1">{balance}回</div>
          </div>
        </div>

        {/* チケット商品一覧 */}
        <div className="grid md:grid-cols-3 gap-6">
          {products.map((product, index) => {
            const isPopular = product.id === '50';
            const cardClass = isPopular
              ? "bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl shadow-xl p-6 relative transform scale-105"
              : "bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow";
            const textClass = isPopular ? "text-white" : "text-gray-800";
            const buttonClass = isPopular
              ? "w-full bg-white text-purple-600 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50"
              : "w-full bg-purple-600 text-white py-3 rounded-xl font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50";

            return (
              <div key={product.id} className={cardClass}>
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-yellow-400 text-yellow-900 px-4 py-1 rounded-full text-sm font-bold">
                      🔥 人気No.1
                    </span>
                  </div>
                )}
                
                <div className={`text-center ${textClass}`}>
                  <div className="text-5xl mb-4">
                    {index === 0 ? '🎫' : index === 1 ? '🎫🎫' : '🎫🎫🎫'}
                  </div>
                  <h3 className="text-2xl font-bold mb-2">
                    {product.name}
                  </h3>
                  <div className="text-4xl font-bold mb-4">
                    ¥{product.amount}
                  </div>
                  <div className={`text-sm mb-6 ${isPopular ? 'opacity-90' : 'text-gray-500'}`}>
                    1回あたり ¥{product.perTicketCost.toFixed(1)}
                    {index > 0 && (
                      <span className={isPopular ? '' : 'text-red-500 font-bold'}>
                        {index === 1 ? '（20%お得）' : '（30%お得）'}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => purchaseTicket(product.id)}
                    disabled={loading}
                    className={buttonClass}
                  >
                    購入する
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* 特徴説明 */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            ✨ チケット制の特徴
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-3">
              <div className="text-2xl">⏰</div>
              <div>
                <div className="font-semibold text-gray-800">有効期限180日</div>
                <div className="text-sm text-gray-600">半年間たっぷり使えます</div>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="text-2xl">🚫</div>
              <div>
                <div className="font-semibold text-gray-800">広告なし</div>
                <div className="text-sm text-gray-600">快適な会話体験</div>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="text-2xl">💳</div>
              <div>
                <div className="font-semibold text-gray-800">買い切り型</div>
                <div className="text-sm text-gray-600">月額費用なし</div>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="text-2xl">🎯</div>
              <div>
                <div className="font-semibold text-gray-800">好きなときに</div>
                <div className="text-sm text-gray-600">1日の制限なし</div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            ❓ よくある質問
          </h3>
          <div className="space-y-4">
            <div>
              <div className="font-semibold text-gray-800 mb-1">Q. チケットはいつまで使えますか？</div>
              <div className="text-sm text-gray-600">A. 購入から180日間有効です。期限内に自由にお使いいただけます。</div>
            </div>
            <div>
              <div className="font-semibold text-gray-800 mb-1">Q. 月額プランとどちらがお得ですか？</div>
              <div className="text-sm text-gray-600">A. 月に30回以上会話する方は月額プラン（¥980/月、100回/日）がお得です。それ以下の方はチケット制がおすすめです。</div>
            </div>
            <div>
              <div className="font-semibold text-gray-800 mb-1">Q. チケットと月額プランは併用できますか？</div>
              <div className="text-sm text-gray-600">A. はい、併用可能です。チケットを優先的に消費します。</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
