import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Persona } from '../types';
import api from '../utils/api';

interface SettingsFormData {
  lineChannelAccessToken: string;
  lineChannelSecret: string;
  isActive: boolean;
}

const Settings: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [persona, setPersona] = useState<Persona | null>(null);
  const { register, handleSubmit, setValue } = useForm<SettingsFormData>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadPersona();
  }, [id]);

  const loadPersona = async () => {
    try {
      const response = await api.get(`/api/personas/${id}`);
      const personaData = response.data.persona;
      setPersona(personaData);
      
      // フォームに既存値を設定
      setValue('lineChannelAccessToken', personaData.lineChannelAccessToken || '');
      setValue('lineChannelSecret', personaData.lineChannelSecret || '');
      setValue('isActive', personaData.isActive);
    } catch (err: any) {
      setError(err.response?.data?.error || '人格の取得に失敗しました');
    }
  };

  const onSubmit = async (data: SettingsFormData) => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await api.put(`/api/personas/${id}`, {
        ...persona,
        lineChannelAccessToken: data.lineChannelAccessToken || null,
        lineChannelSecret: data.lineChannelSecret || null,
        isActive: data.isActive
      });

      setSuccess('設定を保存しました');
      await loadPersona();
    } catch (err: any) {
      setError(err.response?.data?.error || '設定の保存に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  if (!persona) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  const webhookUrl = `${window.location.origin}/api/line/webhook/${id}`;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* ヘッダー */}
        <div className="mb-6">
          <Link to="/dashboard" className="text-blue-600 hover:text-blue-800 flex items-center mb-4">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            ダッシュボードに戻る
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">設定</h1>
          <p className="text-gray-600 mt-1">{persona.creatorCallname}の設定</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
              {success}
            </div>
          )}

          {/* 人格のアクティブ状態 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">人格の状態</h2>
            
            <label className="flex items-center">
              <input
                {...register('isActive')}
                type="checkbox"
                className="mr-3 h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="text-gray-700">人格をアクティブにする</span>
            </label>
            <p className="mt-2 text-sm text-gray-500">
              非アクティブにすると、この人格への新規メッセージは受け付けられなくなります。
            </p>
          </div>

          {/* LINE連携設定 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">LINE連携設定</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  LINE Channel Access Token
                </label>
                <input
                  {...register('lineChannelAccessToken')}
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="長期チャネルアクセストークン"
                />
                <p className="mt-1 text-sm text-gray-500">
                  LINE Developersコンソールから取得できます
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  LINE Channel Secret
                </label>
                <input
                  {...register('lineChannelSecret')}
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="チャネルシークレット"
                />
                <p className="mt-1 text-sm text-gray-500">
                  LINE Developersコンソールから取得できます
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Webhook URL</h3>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={webhookUrl}
                    readOnly
                    className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(webhookUrl);
                      alert('コピーしました');
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    コピー
                  </button>
                </div>
                <p className="mt-2 text-sm text-gray-600">
                  このURLをLINE Developersコンソールの「Webhook URL」に設定してください
                </p>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">LINE連携の手順</h3>
                <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
                  <li>LINE Developersでプロバイダーとチャネルを作成</li>
                  <li>チャネルアクセストークンとチャネルシークレットを取得</li>
                  <li>上記のフォームに入力して保存</li>
                  <li>LINE DevelopersのWebhook URLに上記のURLを設定</li>
                  <li>Webhookを有効化</li>
                  <li>応答メッセージを無効化（重複応答を防ぐため）</li>
                </ol>
              </div>
            </div>
          </div>

          {/* システムプロンプト確認 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">システムプロンプト</h2>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 max-h-96 overflow-y-auto">
              <pre className="text-xs text-gray-700 whitespace-pre-wrap font-mono">
                {persona.systemPrompt}
              </pre>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              このプロンプトは人格作成時に自動生成されています。変更する場合は人格を再作成してください。
            </p>
          </div>

          {/* 保存ボタン */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? '保存中...' : '設定を保存'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;
