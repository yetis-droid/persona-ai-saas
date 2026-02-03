import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

interface Stats {
  users: { total: number; free: number; premium: number };
  conversations: { total: number; today: number };
  personas: { total: number; active: number };
  revenue: {
    totalTickets: number;
    totalSubscription: number;
    estimatedAds: number;
    total: number;
  };
  tickets: { sold: number; revenue: number };
}

interface User {
  id: string;
  email: string;
  name: string | null;
  role: string;
  subscriptionTier: string;
  subscriptionStatus: string;
  dailyConversationCount: number;
  ticketBalance: number;
  createdAt: string;
  _count: { personas: number; usageLogs: number };
}

interface Persona {
  id: string;
  genre: string;
  oneLiner: string;
  creatorCallname: string;
  isActive: boolean;
  createdAt: string;
  user: { id: string; email: string; name: string | null };
  _count: { conversations: number };
}

const Admin: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'personas'>('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      setLoading(true);
      const [statsRes, usersRes, personasRes] = await Promise.all([
        api.get('/api/admin/stats'),
        api.get('/api/admin/users'),
        api.get('/api/admin/personas')
      ]);
      
      setStats(statsRes.data);
      setUsers(usersRes.data.users);
      setPersonas(personasRes.data.personas);
    } catch (error: any) {
      console.error('管理者データ取得エラー:', error);
      if (error.response?.status === 403) {
        alert('管理者権限がありません');
        navigate('/dashboard');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChangePlan = async (userId: string, tier: 'free' | 'premium') => {
    if (!confirm(`プランを ${tier === 'premium' ? 'プレミアム' : '無料'} に変更しますか？`)) return;
    
    try {
      await api.patch(`/api/admin/users/${userId}/plan`, { tier });
      alert('プランを変更しました');
      loadAdminData();
    } catch (error) {
      console.error('プラン変更エラー:', error);
      alert('プラン変更に失敗しました');
    }
  };

  const handleGiveTickets = async (userId: string) => {
    const amount = prompt('付与するチケット数を入力してください:');
    if (!amount || isNaN(Number(amount))) return;
    
    try {
      await api.post(`/api/admin/users/${userId}/tickets`, { amount: Number(amount) });
      alert(`${amount}チケットを付与しました`);
      loadAdminData();
    } catch (error) {
      console.error('チケット付与エラー:', error);
      alert('チケット付与に失敗しました');
    }
  };

  const handleDeleteUser = async (userId: string, email: string) => {
    if (!confirm(`ユーザー ${email} を削除しますか？この操作は取り消せません。`)) return;
    
    try {
      await api.delete(`/api/admin/users/${userId}`);
      alert('ユーザーを削除しました');
      loadAdminData();
    } catch (error) {
      console.error('ユーザー削除エラー:', error);
      alert('ユーザー削除に失敗しました');
    }
  };

  const handleTogglePersona = async (personaId: string) => {
    try {
      await api.patch(`/api/admin/personas/${personaId}/toggle`);
      loadAdminData();
    } catch (error) {
      console.error('人格切り替えエラー:', error);
      alert('人格の切り替えに失敗しました');
    }
  };

  const handleDeletePersona = async (personaId: string, name: string) => {
    if (!confirm(`人格 ${name} を削除しますか？この操作は取り消せません。`)) return;
    
    try {
      await api.delete(`/api/admin/personas/${personaId}`);
      alert('人格を削除しました');
      loadAdminData();
    } catch (error) {
      console.error('人格削除エラー:', error);
      alert('人格削除に失敗しました');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">
              🔐 管理者ダッシュボード
            </h1>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
            >
              ← ダッシュボードに戻る
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* タブナビゲーション */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-lg font-medium ${
              activeTab === 'overview'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            📊 統計概要
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-lg font-medium ${
              activeTab === 'users'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            👥 ユーザー管理
          </button>
          <button
            onClick={() => setActiveTab('personas')}
            className={`px-4 py-2 rounded-lg font-medium ${
              activeTab === 'personas'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            🤖 人格管理
          </button>
        </div>

        {/* 統計概要タブ */}
        {activeTab === 'overview' && stats && (
          <div className="space-y-6">
            {/* 統計カード */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-sm font-medium text-gray-600 mb-2">総ユーザー数</h3>
                <p className="text-3xl font-bold text-gray-900">{stats.users.total}</p>
                <p className="text-xs text-gray-500 mt-2">
                  Free: {stats.users.free} / Premium: {stats.users.premium}
                </p>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-sm font-medium text-gray-600 mb-2">総会話数</h3>
                <p className="text-3xl font-bold text-gray-900">{stats.conversations.total}</p>
                <p className="text-xs text-gray-500 mt-2">
                  今日: {stats.conversations.today}
                </p>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-sm font-medium text-gray-600 mb-2">総人格数</h3>
                <p className="text-3xl font-bold text-gray-900">{stats.personas.total}</p>
                <p className="text-xs text-gray-500 mt-2">
                  有効: {stats.personas.active}
                </p>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-sm font-medium text-gray-600 mb-2">総収益</h3>
                <p className="text-3xl font-bold text-green-600">¥{stats.revenue.total.toLocaleString()}</p>
                <p className="text-xs text-gray-500 mt-2">
                  チケット: ¥{stats.revenue.totalTickets.toLocaleString()}
                </p>
              </div>
            </div>

            {/* 収益詳細 */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">💰 収益内訳</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-gray-700">チケット収益</span>
                  <span className="font-bold text-green-600">¥{stats.revenue.totalTickets.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-gray-700">サブスク収益</span>
                  <span className="font-bold text-green-600">¥{stats.revenue.totalSubscription.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-gray-700">広告収益（推定）</span>
                  <span className="font-bold text-green-600">¥{stats.revenue.estimatedAds.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-lg font-bold text-gray-900">合計</span>
                  <span className="text-2xl font-bold text-green-600">¥{stats.revenue.total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ユーザー管理タブ */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ユーザー
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      プラン
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      チケット
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      人格数
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      登録日
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{user.email}</div>
                        {user.role === 'admin' && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                            管理者
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.subscriptionTier === 'premium'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {user.subscriptionTier === 'premium' ? 'プレミアム' : '無料'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.ticketBalance}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user._count.personas}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString('ja-JP')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                        <button
                          onClick={() => handleChangePlan(user.id, user.subscriptionTier === 'free' ? 'premium' : 'free')}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          プラン変更
                        </button>
                        <button
                          onClick={() => handleGiveTickets(user.id)}
                          className="text-green-600 hover:text-green-900"
                        >
                          チケット付与
                        </button>
                        {user.role !== 'admin' && (
                          <button
                            onClick={() => handleDeleteUser(user.id, user.email)}
                            className="text-red-600 hover:text-red-900"
                          >
                            削除
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 人格管理タブ */}
        {activeTab === 'personas' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      人格
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      作成者
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      会話数
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      状態
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      作成日
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {personas.map((persona) => (
                    <tr key={persona.id}>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{persona.creatorCallname}</div>
                        <div className="text-sm text-gray-500">{persona.oneLiner}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {persona.user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {persona._count.conversations}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          persona.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {persona.isActive ? '有効' : '無効'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(persona.createdAt).toLocaleDateString('ja-JP')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                        <button
                          onClick={() => handleTogglePersona(persona.id)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          {persona.isActive ? '無効化' : '有効化'}
                        </button>
                        <button
                          onClick={() => handleDeletePersona(persona.id, persona.creatorCallname)}
                          className="text-red-600 hover:text-red-900"
                        >
                          削除
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
