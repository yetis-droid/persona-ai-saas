import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuthStore } from '../stores/authStore';

const QuickLogin: React.FC = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [status, setStatus] = useState('');

  const handleQuickLogin = async () => {
    try {
      setStatus('🔐 ログイン中...');
      
      // ログインリクエスト
      const response = await api.post('/api/auth/login', {
        email: 'newuser@example.com',
        password: 'password123'
      });
      
      const { user, token } = response.data;
      
      setStatus('✅ ログイン成功！トークンを保存中...');
      
      // トークンを保存
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      setStatus('✅ localStorage保存完了！');
      
      // Zustandストアを更新
      setAuth(user, token);
      
      setStatus('✅ 認証完了！3秒後にダッシュボードへ移動します...');
      
      // 3秒後にダッシュボードへ
      setTimeout(() => {
        navigate('/dashboard');
      }, 3000);
      
    } catch (error: any) {
      setStatus('❌ エラー: ' + (error.response?.data?.error || error.message));
    }
  };

  const checkAuth = () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    setStatus(`
トークン: ${token ? token.substring(0, 50) + '...' : 'なし'}
ユーザー: ${user ? user.substring(0, 100) + '...' : 'なし'}
    `);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          🚀 クイックログイン
        </h1>

        <div className="space-y-4">
          <button
            onClick={handleQuickLogin}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl transition-colors text-lg"
          >
            ワンクリックログイン
          </button>

          <button
            onClick={checkAuth}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-4 px-6 rounded-xl transition-colors text-lg"
          >
            認証状態を確認
          </button>

          <button
            onClick={() => navigate('/dashboard')}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-xl transition-colors text-lg"
          >
            ダッシュボードへ
          </button>
        </div>

        {status && (
          <div className="mt-6 p-4 bg-gray-100 rounded-xl">
            <pre className="text-sm whitespace-pre-wrap">{status}</pre>
          </div>
        )}

        <div className="mt-8 text-center text-sm text-gray-600">
          <p>テスト用アカウント</p>
          <p>メール: newuser@example.com</p>
          <p>パスワード: password123</p>
        </div>
      </div>
    </div>
  );
};

export default QuickLogin;
