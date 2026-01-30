import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';
import api from '../utils/api';

const Debug: React.FC = () => {
  const { user, token, isAuthenticated } = useAuthStore();
  const [apiTest, setApiTest] = useState<any>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    testAPI();
  }, []);

  const testAPI = async () => {
    try {
      const response = await api.get('/api/personas');
      setApiTest({ success: true, data: response.data });
    } catch (err: any) {
      setApiTest({ success: false, error: err.response?.data || err.message });
      setError(err.response?.data?.error || err.message);
    }
  };

  const checkLocalStorage = () => {
    return {
      token: localStorage.getItem('token'),
      user: localStorage.getItem('user')
    };
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">デバッグ情報</h1>

        {/* 認証状態 */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">認証状態</h2>
          <div className="space-y-2">
            <div>
              <span className="font-semibold">isAuthenticated:</span>{' '}
              <span className={isAuthenticated ? 'text-green-600' : 'text-red-600'}>
                {isAuthenticated ? '✓ 認証済み' : '✗ 未認証'}
              </span>
            </div>
            <div>
              <span className="font-semibold">User:</span>{' '}
              <pre className="bg-gray-100 p-2 rounded mt-2">{JSON.stringify(user, null, 2)}</pre>
            </div>
            <div>
              <span className="font-semibold">Token (最初の50文字):</span>{' '}
              <pre className="bg-gray-100 p-2 rounded mt-2 text-xs">
                {token ? token.substring(0, 50) + '...' : 'null'}
              </pre>
            </div>
          </div>
        </div>

        {/* LocalStorage */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">LocalStorage</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
            {JSON.stringify(checkLocalStorage(), null, 2)}
          </pre>
        </div>

        {/* API テスト */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">API テスト (/api/personas)</h2>
          <button
            onClick={testAPI}
            className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            再テスト
          </button>
          {apiTest && (
            <div>
              <div className={`font-semibold mb-2 ${apiTest.success ? 'text-green-600' : 'text-red-600'}`}>
                {apiTest.success ? '✓ 成功' : '✗ 失敗'}
              </div>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
                {JSON.stringify(apiTest, null, 2)}
              </pre>
            </div>
          )}
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded">
              <strong>エラー:</strong> {error}
            </div>
          )}
        </div>

        {/* 環境情報 */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">環境情報</h2>
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-semibold">API URL:</span> {window.location.origin}
            </div>
            <div>
              <span className="font-semibold">Current Path:</span> {window.location.pathname}
            </div>
            <div>
              <span className="font-semibold">User Agent:</span> {navigator.userAgent}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Debug;
