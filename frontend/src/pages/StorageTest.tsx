import React, { useState, useEffect } from 'react';

const StorageTest: React.FC = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const [testValue, setTestValue] = useState('');

  const addLog = (msg: string) => {
    const log = `[${new Date().toLocaleTimeString()}] ${msg}`;
    console.log(log);
    setLogs(prev => [...prev, log]);
  };

  useEffect(() => {
    addLog('📱 ページ読み込み完了');
    testLocalStorage();
  }, []);

  const testLocalStorage = () => {
    try {
      addLog('🔍 localStorage テスト開始');
      
      // 書き込みテスト
      const testKey = 'test_' + Date.now();
      const testVal = 'test_value_' + Math.random();
      
      addLog(`📝 書き込みテスト: ${testKey} = ${testVal}`);
      localStorage.setItem(testKey, testVal);
      addLog('✅ 書き込み成功');
      
      // 読み込みテスト
      const readVal = localStorage.getItem(testKey);
      addLog(`📖 読み込みテスト: ${readVal}`);
      
      if (readVal === testVal) {
        addLog('✅ 読み込み成功 - 値が一致');
      } else {
        addLog(`❌ 読み込み失敗 - 値が不一致: ${readVal} !== ${testVal}`);
      }
      
      // 削除テスト
      localStorage.removeItem(testKey);
      const afterRemove = localStorage.getItem(testKey);
      if (afterRemove === null) {
        addLog('✅ 削除成功');
      } else {
        addLog(`❌ 削除失敗 - まだ存在: ${afterRemove}`);
      }
      
      // 既存のキーを確認
      addLog('🔍 既存のlocalStorageキー:');
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          const val = localStorage.getItem(key);
          addLog(`  - ${key}: ${val?.substring(0, 50)}...`);
        }
      }
      
      // ストレージが利用可能か
      if (typeof Storage !== 'undefined') {
        addLog('✅ localStorage は利用可能です');
      } else {
        addLog('❌ localStorage は利用できません');
      }
      
    } catch (error: any) {
      addLog(`❌ エラー: ${error.message}`);
    }
  };

  const saveTestValue = () => {
    try {
      addLog(`💾 保存: test_token = ${testValue}`);
      localStorage.setItem('test_token', testValue);
      addLog('✅ 保存完了');
      
      const saved = localStorage.getItem('test_token');
      addLog(`🔍 確認: ${saved}`);
    } catch (error: any) {
      addLog(`❌ エラー: ${error.message}`);
    }
  };

  const loadTestValue = () => {
    try {
      const val = localStorage.getItem('test_token');
      addLog(`📖 読み込み: ${val}`);
      if (val) {
        setTestValue(val);
      } else {
        addLog('⚠️ test_token が見つかりません');
      }
    } catch (error: any) {
      addLog(`❌ エラー: ${error.message}`);
    }
  };

  const clearAll = () => {
    localStorage.clear();
    addLog('🗑️ localStorage をクリアしました');
    testLocalStorage();
  };

  const reloadPage = () => {
    addLog('🔄 ページをリロードします...');
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-green-400 mb-6 text-center">
          💾 localStorage テスト
        </h1>

        {/* テスト入力 */}
        <div className="bg-gray-800 rounded-lg p-6 mb-4">
          <h2 className="text-xl font-bold text-green-400 mb-4">手動テスト</h2>
          <div className="space-y-3">
            <input
              type="text"
              value={testValue}
              onChange={(e) => setTestValue(e.target.value)}
              placeholder="テスト値を入力"
              className="w-full p-3 bg-gray-700 text-white rounded"
            />
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={saveTestValue}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded"
              >
                保存
              </button>
              <button
                onClick={loadTestValue}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded"
              >
                読み込み
              </button>
              <button
                onClick={clearAll}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded"
              >
                クリア
              </button>
            </div>
          </div>
        </div>

        {/* 自動テスト */}
        <div className="bg-gray-800 rounded-lg p-6 mb-4">
          <h2 className="text-xl font-bold text-green-400 mb-4">自動テスト</h2>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={testLocalStorage}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 rounded"
            >
              再テスト
            </button>
            <button
              onClick={reloadPage}
              className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 rounded"
            >
              リロード
            </button>
          </div>
        </div>

        {/* ログ表示 */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-bold text-green-400 mb-4">📋 ログ</h2>
          <div className="bg-black rounded p-4 h-96 overflow-y-auto font-mono text-sm">
            {logs.map((log, i) => (
              <div key={i} className="text-green-400 mb-1">{log}</div>
            ))}
          </div>
        </div>

        <div className="mt-4 bg-yellow-900 border-l-4 border-yellow-400 p-4 rounded">
          <p className="text-yellow-200">
            <strong>⚠️ 注意:</strong> Safari のプライベートブラウズモードでは localStorage が正常に動作しません。
            通常のブラウジングモードで開いてください。
          </p>
        </div>
      </div>
    </div>
  );
};

export default StorageTest;
