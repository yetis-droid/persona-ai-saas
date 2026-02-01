import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

const LoginDebug: React.FC = () => {
  const navigate = useNavigate();
  const { setAuth, isAuthenticated, user } = useAuthStore();
  const [logs, setLogs] = useState<string[]>([]);
  const [email, setEmail] = useState('newuser@example.com');
  const [password, setPassword] = useState('password123');

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    const logMessage = `[${timestamp}] ${message}`;
    console.log(logMessage);
    setLogs(prev => [...prev, logMessage]);
  };

  useEffect(() => {
    addLog('🔄 ページ読み込み完了');
    addLog(`📊 isAuthenticated: ${isAuthenticated}`);
    addLog(`👤 user: ${JSON.stringify(user)}`);
    addLog(`🔑 localStorage token: ${localStorage.getItem('token')?.substring(0, 30) || 'なし'}`);
    addLog(`👥 localStorage user: ${localStorage.getItem('user') || 'なし'}`);
  }, []);

  const handleLogin = async () => {
    try {
      addLog('🔐 ログイン開始...');
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      addLog(`📡 レスポンス status: ${response.status}`);

      const data = await response.json();
      addLog(`📦 レスポンスデータ: ${JSON.stringify(data).substring(0, 100)}...`);

      if (response.ok) {
        const { user, token } = data;
        
        addLog('✅ ログイン成功');
        addLog(`🔑 トークン取得: ${token.substring(0, 30)}...`);
        addLog(`👤 ユーザー取得: ${JSON.stringify(user)}`);

        // LocalStorageに保存
        addLog('💾 localStorage に保存中...');
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        addLog('✅ localStorage 保存完了');

        // 確認
        const savedToken = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');
        addLog(`🔍 保存確認 token: ${savedToken?.substring(0, 30)}...`);
        addLog(`🔍 保存確認 user: ${savedUser}`);

        // Zustand storeを更新
        addLog('📝 Zustand store を更新中...');
        setAuth(user, token);
        addLog('✅ Zustand store 更新完了');

        addLog(`📊 更新後 isAuthenticated: ${isAuthenticated}`);
        
      } else {
        addLog(`❌ ログイン失敗: ${data.error || 'Unknown error'}`);
      }
    } catch (error: any) {
      addLog(`❌ エラー: ${error.message}`);
    }
  };

  const checkAuth = () => {
    addLog('🔍 認証状態チェック中...');
    addLog(`📊 isAuthenticated: ${isAuthenticated}`);
    addLog(`👤 user: ${JSON.stringify(user)}`);
    addLog(`🔑 localStorage token: ${localStorage.getItem('token')?.substring(0, 30) || 'なし'}`);
    addLog(`👥 localStorage user: ${localStorage.getItem('user') || 'なし'}`);
  };

  const goToChat = () => {
    addLog('🚀 チャット画面へ移動を試みます...');
    // 実際のpersonaIdが必要なので、まず取得
    fetch('/api/personas', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => res.json())
      .then(data => {
        addLog(`📦 人格リスト取得: ${JSON.stringify(data)}`);
        if (data.personas && data.personas.length > 0) {
          const personaId = data.personas[0].id;
          addLog(`✅ 人格ID: ${personaId}`);
          addLog(`🚀 /personas/${personaId}/chat へ移動します`);
          navigate(`/personas/${personaId}/chat`);
        } else {
          addLog('⚠️ 人格が存在しません。まず人格を作成してください。');
        }
      })
      .catch(err => {
        addLog(`❌ 人格取得エラー: ${err.message}`);
      });
  };

  const clearAll = () => {
    localStorage.clear();
    setLogs([]);
    addLog('🗑️ すべてクリアしました');
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-green-400 mb-6 text-center">
          🔍 ログインデバッグコンソール
        </h1>

        {/* ログイン */}
        <div className="bg-gray-800 rounded-lg p-6 mb-4">
          <h2 className="text-xl font-bold text-green-400 mb-4">1. ログイン</h2>
          <div className="space-y-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="メールアドレス"
              className="w-full p-3 bg-gray-700 text-white rounded border border-gray-600"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="パスワード"
              className="w-full p-3 bg-gray-700 text-white rounded border border-gray-600"
            />
            <button
              onClick={handleLogin}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded"
            >
              ログイン実行
            </button>
          </div>
        </div>

        {/* アクション */}
        <div className="bg-gray-800 rounded-lg p-6 mb-4">
          <h2 className="text-xl font-bold text-green-400 mb-4">2. アクション</h2>
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={checkAuth}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded"
            >
              認証確認
            </button>
            <button
              onClick={goToChat}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded"
            >
              チャットへ
            </button>
            <button
              onClick={clearAll}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded"
            >
              クリア
            </button>
          </div>
        </div>

        {/* ログ表示 */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-bold text-green-400 mb-4">📋 ログ</h2>
          <div className="bg-black rounded p-4 h-96 overflow-y-auto font-mono text-sm">
            {logs.map((log, index) => (
              <div key={index} className="text-green-400 mb-1">
                {log}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginDebug;
