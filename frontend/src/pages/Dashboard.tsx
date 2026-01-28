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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex">
      {/* サイドバー */}
      <aside className="w-72 bg-white/80 backdrop-blur-sm border-r border-gray-200/50 flex flex-col shadow-xl">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Persona AI</h1>
              <p className="text-xs text-gray-500">SaaS Platform</p>
            </div>
          </div>
          <p className="text-sm text-gray-600 px-2 py-1.5 bg-gray-100 rounded-lg">{user?.email}</p>
        </div>

        <div className="p-4 border-b border-gray-200">
          <Link
            to="/personas/new"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 font-medium"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            新しい人格を作成
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto p-4">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">人格一覧</h2>
          {personas.length === 0 ? (
            <div className="text-center py-8">
              <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p className="text-sm text-gray-500">まだ人格がありません</p>
            </div>
          ) : (
            <ul className="space-y-2">
              {personas.map((persona) => (
                <li key={persona.id}>
                  <button
                    onClick={() => setSelectedPersonaId(persona.id)}
                    className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 ${
                      selectedPersonaId === persona.id
                        ? 'bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 shadow-md'
                        : 'hover:bg-gray-50 text-gray-700 border-2 border-transparent'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold ${
                        selectedPersonaId === persona.id
                          ? 'bg-gradient-to-br from-blue-500 to-purple-600'
                          : 'bg-gray-400'
                      }`}>
                        {persona.creatorCallname.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className={`font-semibold text-sm ${
                          selectedPersonaId === persona.id ? 'text-blue-700' : 'text-gray-900'
                        }`}>{persona.creatorCallname}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{persona.genre}</div>
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full text-gray-700 hover:text-red-600 py-2.5 px-4 rounded-xl hover:bg-red-50 transition-all duration-200 flex items-center justify-center font-medium"
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
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-8 mb-6">
              <div className="flex justify-between items-start">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                    {selectedPersona.creatorCallname.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">{selectedPersona.creatorCallname}</h2>
                    <p className="text-gray-600 mt-2 text-lg">{selectedPersona.oneLiner}</p>
                    <div className="flex gap-2 mt-4">
                      <span className="px-4 py-1.5 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 rounded-full text-sm font-medium">
                        {selectedPersona.genre}
                      </span>
                      <span className={`px-4 py-1.5 rounded-full text-sm font-medium ${
                        selectedPersona.isActive
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {selectedPersona.isActive ? '✓ アクティブ' : '✗ 非アクティブ'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <Link
                    to={`/personas/${selectedPersona.id}/chat`}
                    className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 font-medium flex items-center space-x-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span>チャット</span>
                  </Link>
                  <Link
                    to={`/personas/${selectedPersona.id}/conversations`}
                    className="px-5 py-2.5 bg-white border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium"
                  >
                    会話ログ
                  </Link>
                  <Link
                    to={`/personas/${selectedPersona.id}/settings`}
                    className="px-5 py-2.5 bg-white border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium"
                  >
                    設定
                  </Link>
                  <button
                    onClick={() => handleDeletePersona(selectedPersona.id)}
                    className="px-5 py-2.5 bg-red-50 border-2 border-red-200 text-red-700 rounded-xl hover:bg-red-100 hover:border-red-300 transition-all duration-200 font-medium"
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
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl shadow-lg p-6 border border-blue-200/50">
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-sm font-semibold text-blue-700">総会話数</div>
                      <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <div className="text-4xl font-bold text-blue-900">{stats.totalConversations}</div>
                    <div className="text-xs text-blue-600 mt-2">全ての会話</div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl shadow-lg p-6 border border-purple-200/50">
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-sm font-semibold text-purple-700">平均評価</div>
                      <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                    </div>
                    <div className="text-4xl font-bold text-purple-900">
                      {stats.averageRating > 0 ? stats.averageRating.toFixed(1) : 'N/A'}
                    </div>
                    <div className="text-xs text-purple-600 mt-2">5段階評価</div>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl shadow-lg p-6 border border-green-200/50">
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-sm font-semibold text-green-700">Web会話</div>
                      <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="text-4xl font-bold text-green-900">{stats.webConversations}</div>
                    <div className="text-xs text-green-600 mt-2">ブラウザから</div>
                  </div>
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl shadow-lg p-6 border border-orange-200/50">
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-sm font-semibold text-orange-700">LINE会話</div>
                      <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="text-4xl font-bold text-orange-900">{stats.lineConversations}</div>
                    <div className="text-xs text-orange-600 mt-2">LINEから</div>
                  </div>
                </div>

                {/* チャート */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {ratingChartData && (
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-8">
                      <div className="flex items-center space-x-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                          </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">評価分布</h3>
                      </div>
                      <Doughnut data={ratingChartData} />
                    </div>
                  )}
                  
                  {sourceChartData && (
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-8">
                      <div className="flex items-center space-x-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-green-500 flex items-center justify-center">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">ソース別会話数</h3>
                      </div>
                      <Doughnut data={sourceChartData} />
                    </div>
                  )}
                </div>

                {dailyChartData && (
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-8">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">日別会話数（過去14日）</h3>
                    </div>
                    <Bar data={dailyChartData} options={{ responsive: true, maintainAspectRatio: true }} />
                  </div>
                )}
              </>
            )}
          </div>
        ) : (
          <div className="p-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-16 text-center">
              <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-2xl">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">まだ人格がありません</h3>
              <p className="text-gray-600 mb-8 text-lg">最初の人格を作成して、AI運用を開始しましょう</p>
              <Link
                to="/personas/new"
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-8 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 font-medium text-lg"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>人格を作成</span>
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
