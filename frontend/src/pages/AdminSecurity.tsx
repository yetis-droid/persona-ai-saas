// 管理者セキュリティダッシュボード
import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import OfficialBadge from '../components/OfficialBadge';

interface OfficialAccount {
  id: string;
  email: string;
  name: string | null;
  officialBadge: string | null;
  verificationLevel: number;
  createdAt: string;
  emailVerifiedAt: string | null;
  _count: {
    personas: number;
    usageLogs: number;
  };
}

const AdminSecurity: React.FC = () => {
  const [officialAccounts, setOfficialAccounts] = useState<OfficialAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [badgeType, setBadgeType] = useState<'creator' | 'partner' | 'verified'>('creator');
  const [revokeReason, setRevokeReason] = useState('');

  // 公式アカウント一覧を取得
  const loadOfficialAccounts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/admin/official-accounts');
      setOfficialAccounts(response.data.accounts);
    } catch (error) {
      console.error('❌ 公式アカウント読み込みエラー:', error);
      alert('公式アカウント一覧の取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOfficialAccounts();
  }, []);

  // 公式バッジを付与
  const grantBadge = async (userId: string) => {
    if (!confirm(`このユーザーに「${badgeType}」バッジを付与しますか？\n\n⚠️ この操作は慎重に行ってください。`)) {
      return;
    }

    try {
      const response = await api.post('/api/admin/verify-user', {
        userId,
        badgeType
      });

      alert(`✅ ${response.data.message}`);
      loadOfficialAccounts();
    } catch (error: any) {
      console.error('❌ バッジ付与エラー:', error);
      alert(error.response?.data?.error || 'バッジの付与に失敗しました');
    }
  };

  // 公式バッジを剥奪
  const revokeBadge = async (userId: string) => {
    if (!revokeReason.trim()) {
      alert('剥奪理由を入力してください');
      return;
    }

    if (!confirm(`このユーザーの公式バッジを剥奪しますか？\n\n理由: ${revokeReason}\n\n⚠️ この操作は取り消せません。`)) {
      return;
    }

    try {
      const response = await api.post('/api/admin/revoke-badge', {
        userId,
        reason: revokeReason
      });

      alert(`✅ ${response.data.message}`);
      setRevokeReason('');
      loadOfficialAccounts();
    } catch (error: any) {
      console.error('❌ バッジ剥奪エラー:', error);
      alert(error.response?.data?.error || 'バッジの剥奪に失敗しました');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          🔐 セキュリティ管理
        </h1>
        <p className="text-gray-600">
          公式バッジの付与・剥奪、なりすまし防止
        </p>
      </div>

      {/* 統計サマリー */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-gray-500 text-sm mb-1">公式アカウント数</div>
          <div className="text-3xl font-bold text-purple-600">
            {officialAccounts.length}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-gray-500 text-sm mb-1">公式クリエイター</div>
          <div className="text-3xl font-bold text-blue-600">
            {officialAccounts.filter(a => a.officialBadge === 'creator').length}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-gray-500 text-sm mb-1">認証済みユーザー</div>
          <div className="text-3xl font-bold text-green-600">
            {officialAccounts.filter(a => a.officialBadge === 'verified').length}
          </div>
        </div>
      </div>

      {/* バッジ付与フォーム */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          ✨ 公式バッジを付与
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ユーザーID
            </label>
            <input
              type="text"
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              placeholder="ユーザーIDを入力"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              バッジタイプ
            </label>
            <select
              value={badgeType}
              onChange={(e) => setBadgeType(e.target.value as any)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
            >
              <option value="creator">✨ 公式クリエイター</option>
              <option value="partner">🤝 公式パートナー</option>
              <option value="verified">✓ 認証済み</option>
            </select>
          </div>
          <button
            onClick={() => grantBadge(selectedUser)}
            disabled={!selectedUser}
            className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            公式バッジを付与
          </button>
        </div>
      </div>

      {/* 公式アカウント一覧 */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">
            📋 公式アカウント一覧
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  ユーザー
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  バッジ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  認証レベル
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  人格数
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  登録日
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {officialAccounts.map((account) => (
                <tr key={account.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900">
                        {account.name || '名前なし'}
                      </div>
                      <div className="text-sm text-gray-500">{account.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <OfficialBadge badgeType={account.officialBadge} size="sm" />
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600">
                      Level {account.verificationLevel}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600">
                      {account._count.personas} 個
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600">
                      {new Date(account.createdAt).toLocaleDateString('ja-JP')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="剥奪理由"
                        value={revokeReason}
                        onChange={(e) => setRevokeReason(e.target.value)}
                        className="px-2 py-1 border rounded text-sm"
                      />
                      <button
                        onClick={() => revokeBadge(account.id)}
                        className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                      >
                        剥奪
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {officialAccounts.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          公式アカウントはまだありません
        </div>
      )}
    </div>
  );
};

export default AdminSecurity;
