import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import api from '../utils/api';
import { Persona, DashboardStats } from '../types';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

// Chart.js登録
ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, clearAuth } = useAuthStore();
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [selectedPersonaId, setSelectedPersonaId] = useState<string | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadPersonas();
  }, []);

  useEffect(() => {
    if (selectedPersonaId) {
      loadStats(selectedPersonaId);
    }
  }, [selectedPersonaId]);

  const loadPersonas = async () => {
    try {
      const response = await api.get('/api/personas');
      const personaList = response.data.personas;
      setPersonas(personaList);
      
      // 最初の人格を自動選択
      if (personaList.length > 0) {
        setSelectedPersonaId(personaList[0].id);
      }
      
      setLoading(false);
    } catch (err: any) {
      setError(err.response?.data?.error || '人格一覧の取得に失敗しました');
      setLoading(false);
    }
  };

  const loadStats = async (personaId: string) => {
    try {
      const response = await api.get('/api/dashboard', {
        params: { personaId }
      });
      setStats(response.data);
    } catch (err: any) {
      console.error('Stats load error:', err);
    }
  };

  const handleLogout = async () => {
    try {
      await api.post('/api/auth/logout');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      clearAuth();
      navigate('/login');
    }
  };

  const handleDeletePersona = async (personaId: string) => {
    if (!confirm('本当にこの人格を削除しますか？この操作は取り消せません。')) {
      return;
    }

    try {
      await api.delete(`/api/personas/${personaId}`);
      await loadPersonas();
      
      if (selectedPersonaId === personaId) {
        setSelectedPersonaId(personas[0]?.id || null);
      }
    } catch (err: any) {
      alert(err.response?.data?.error || '削除に失敗しました');
    }
  };

  const selectedPersona = personas.find(p => p.id === selectedPersonaId);

  // チャートデータ
  const ratingChartData = stats ? {
    labels: ['1', '2', '3', '4', '5'],
    datasets: [{
      label: '評価数',
      data: stats.ratingDistribution.map(r => r.count),
      backgroundColor: [
        'rgba(239, 68, 68, 0.6)',
        'rgba(251, 146, 60, 0.6)',
        'rgba(234, 179, 8, 0.6)',
        'rgba(34, 197, 94, 0.6)',
        'rgba(59, 130, 246, 0.6)',
      ],
    }]
  } : null;

  const sourceChartData = stats ? {
    labels: ['Web', 'LINE'],
    datasets: [{
      data: [stats.webConversations, stats.lineConversations],
      backgroundColor: ['rgba(59, 130, 246, 0.6)', 'rgba(34, 197, 94, 0.6)'],
    }]
  } : null;

  const dailyChartData = stats ? {
    labels: stats.dailyConversations.slice(0, 14).reverse().map(d => d.date.substring(5)),
    datasets: [{
      label: '会話数',
      data: stats.dailyConversations.slice(0, 14).reverse().map(d => d.count),
      backgroundColor: 'rgba(59, 130, 246, 0.6)',
    }]
  } : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* サイドバー */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">Persona AI SaaS</h1>
          <p className="text-sm text-gray-600 mt-1">{user?.email}</p>
        </div>

        <div className="p-4 border-b border-gray-200">
          <Link
            to="/personas/new"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            新しい人格を作成
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto p-4">
          <h2 className="text-xs font-semibold text-gray-500 uppercase mb-2">人格一覧</h2>
          {personas.length === 0 ? (
            <p className="text-sm text-gray-500 py-4">まだ人格がありません</p>
          ) : (
            <ul className="space-y-2">
              {personas.map((persona) => (
                <li key={persona.id}>
                  <button
                    onClick={() => setSelectedPersonaId(persona.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      selectedPersonaId === persona.id
                        ? 'bg-blue-50 text-blue-700'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <div className="font-medium text-sm">{persona.creatorCallname}</div>
                    <div className="text-xs text-gray-500 mt-1">{persona.genre}</div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full text-gray-700 hover:text-gray-900 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            ログアウト
          </button>
        </div>
      </aside>

      {/* メインコンテンツ */}
      <main className="flex-1 overflow-y-auto">
        {selectedPersona ? (
          <div className="p-8">
            {/* ヘッダー */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedPersona.creatorCallname}</h2>
                  <p className="text-gray-600 mt-1">{selectedPersona.oneLiner}</p>
                  <div className="flex gap-2 mt-3">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                      {selectedPersona.genre}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      selectedPersona.isActive
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {selectedPersona.isActive ? 'アクティブ' : '非アクティブ'}
                    </span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Link
                    to={`/personas/${selectedPersona.id}/chat`}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    チャット
                  </Link>
                  <Link
                    to={`/personas/${selectedPersona.id}/conversations`}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    会話ログ
                  </Link>
                  <Link
                    to={`/personas/${selectedPersona.id}/settings`}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    設定
                  </Link>
                  <button
                    onClick={() => handleDeletePersona(selectedPersona.id)}
                    className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                  >
                    削除
                  </button>
                </div>
              </div>
            </div>

            {/* 統計情報 */}
            {stats && (
              <>
                {/* サマリーカード */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="text-sm text-gray-600 mb-1">総会話数</div>
                    <div className="text-3xl font-bold text-gray-900">{stats.totalConversations}</div>
                  </div>
                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="text-sm text-gray-600 mb-1">平均評価</div>
                    <div className="text-3xl font-bold text-gray-900">
                      {stats.averageRating > 0 ? stats.averageRating.toFixed(1) : 'N/A'}
                    </div>
                  </div>
                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="text-sm text-gray-600 mb-1">Web会話</div>
                    <div className="text-3xl font-bold text-gray-900">{stats.webConversations}</div>
                  </div>
                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="text-sm text-gray-600 mb-1">LINE会話</div>
                    <div className="text-3xl font-bold text-gray-900">{stats.lineConversations}</div>
                  </div>
                </div>

                {/* チャート */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {ratingChartData && (
                    <div className="bg-white rounded-lg shadow p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">評価分布</h3>
                      <Doughnut data={ratingChartData} />
                    </div>
                  )}
                  
                  {sourceChartData && (
                    <div className="bg-white rounded-lg shadow p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">ソース別会話数</h3>
                      <Doughnut data={sourceChartData} />
                    </div>
                  )}
                </div>

                {dailyChartData && (
                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">日別会話数（過去14日）</h3>
                    <Bar data={dailyChartData} options={{ responsive: true, maintainAspectRatio: true }} />
                  </div>
                )}
              </>
            )}
          </div>
        ) : (
          <div className="p-8">
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">まだ人格がありません</h3>
              <p className="text-gray-600 mb-6">最初の人格を作成して、AI運用を開始しましょう</p>
              <Link
                to="/personas/new"
                className="inline-block bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors"
              >
                人格を作成
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
