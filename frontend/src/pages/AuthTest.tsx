import React, { useState } from 'react';
import axios from 'axios';

const AuthTest: React.FC = () => {
  const [email, setEmail] = useState('newuser@example.com');
  const [password, setPassword] = useState('password123');
  const [result, setResult] = useState<any>(null);
  const [testResult, setTestResult] = useState<any>(null);

  const handleLogin = async () => {
    try {
      console.log('🔐 Sending login request...');
      const response = await axios.post('http://localhost:3000/api/auth/login', {
        email,
        password
      });
      
      console.log('✅ Login response:', response.data);
      const { user, token } = response.data;
      
      // LocalStorageに保存
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      setResult({
        success: true,
        user,
        token: token.substring(0, 50) + '...',
        fullToken: token,
        localStorage: {
          token: localStorage.getItem('token')?.substring(0, 50) + '...',
          user: localStorage.getItem('user')
        }
      });
    } catch (error: any) {
      console.error('❌ Login error:', error);
      setResult({
        success: false,
        error: error.message,
        response: error.response?.data
      });
    }
  };

  const testApiWithToken = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('🔍 Testing API with token:', token?.substring(0, 50));
      
      const response = await axios.get('http://localhost:3000/api/personas', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('✅ API test success:', response.data);
      setTestResult({
        success: true,
        data: response.data
      });
    } catch (error: any) {
      console.error('❌ API test error:', error);
      setTestResult({
        success: false,
        error: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
    }
  };

  const clearStorage = () => {
    localStorage.clear();
    setResult(null);
    setTestResult(null);
    console.log('🗑️ LocalStorage cleared');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-green-400 p-8 font-mono">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">🔐 認証テスト</h1>

        {/* ログインフォーム */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6 border border-green-600">
          <h2 className="text-xl font-bold mb-4">1. ログインテスト</h2>
          <div className="space-y-4">
            <div>
              <label className="block mb-2">メールアドレス:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-green-400"
              />
            </div>
            <div>
              <label className="block mb-2">パスワード:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-green-400"
              />
            </div>
            <button
              onClick={handleLogin}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              ログイン実行
            </button>
          </div>

          {result && (
            <div className="mt-4 p-4 bg-gray-700 rounded">
              <h3 className="font-bold mb-2">
                {result.success ? '✅ ログイン成功' : '❌ ログイン失敗'}
              </h3>
              <pre className="text-xs overflow-x-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* API テスト */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6 border border-green-600">
          <h2 className="text-xl font-bold mb-4">2. API認証テスト</h2>
          <button
            onClick={testApiWithToken}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            /api/personas をテスト
          </button>

          {testResult && (
            <div className="mt-4 p-4 bg-gray-700 rounded">
              <h3 className="font-bold mb-2">
                {testResult.success ? '✅ API成功' : '❌ API失敗'}
              </h3>
              <pre className="text-xs overflow-x-auto">
                {JSON.stringify(testResult, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* LocalStorage確認 */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6 border border-green-600">
          <h2 className="text-xl font-bold mb-4">3. LocalStorage確認</h2>
          <pre className="text-xs overflow-x-auto bg-gray-700 p-4 rounded">
            {JSON.stringify({
              token: localStorage.getItem('token')?.substring(0, 50) + '...',
              user: localStorage.getItem('user')
            }, null, 2)}
          </pre>
          <button
            onClick={clearStorage}
            className="mt-4 w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            LocalStorage をクリア
          </button>
        </div>

        {/* 説明 */}
        <div className="bg-gray-800 rounded-lg p-6 border border-yellow-600">
          <h2 className="text-xl font-bold mb-4 text-yellow-400">📝 使い方</h2>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>「ログイン実行」ボタンをクリック</li>
            <li>ログイン成功を確認（token が表示される）</li>
            <li>「/api/personas をテスト」ボタンをクリック</li>
            <li>API認証が成功するか確認</li>
            <li>もし失敗したら、エラー内容をコピーして教えてください</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default AuthTest;
