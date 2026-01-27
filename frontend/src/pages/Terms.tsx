import React from 'react';
import { Link } from 'react-router-dom';

const Terms: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">利用規約</h1>
          
          <div className="space-y-6 text-gray-700">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">1. サービス概要</h2>
              <p>
                Persona AI SaaS（以下「本サービス」）は、クリエイター・アーティストの人格や世界観を
                構造化し、AIとして安全に自動運用するためのプラットフォームです。
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">2. 禁止事項</h2>
              <p className="mb-2">以下の話題・内容は、本サービス上で取り扱うことを禁止します：</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>恋愛に関する内容</li>
                <li>政治に関する内容</li>
                <li>宗教に関する内容</li>
                <li>医療・診断・治療に関する助言</li>
                <li>法律に関する助言</li>
                <li>投資に関する助言</li>
                <li>他者への批判や誹謗中傷</li>
                <li>個人情報の収集や公開</li>
                <li>依存を誘発する表現</li>
                <li>本人へのなりすまし</li>
                <li>その他、法令に違反する行為</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">3. 免責事項</h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  本サービスを通じて生成されるAI応答は、あくまで窓口AIとしての応答であり、
                  クリエイター本人の発言ではありません。
                </li>
                <li>
                  AI応答の内容について、運営者は一切の責任を負いません。
                </li>
                <li>
                  利用者は、自己の責任において本サービスを利用するものとします。
                </li>
                <li>
                  本サービスの利用により発生した損害について、運営者は一切の責任を負いません。
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">4. データの取り扱い</h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  会話ログは、サービス改善および安全性確保のために保存されます。
                </li>
                <li>
                  個人情報は、プライバシーポリシーに基づき適切に管理されます。
                </li>
                <li>
                  ユーザーが作成した人格データは、ユーザー自身が管理・削除できます。
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">5. 準拠法・管轄裁判所</h2>
              <p>
                本規約は日本法に準拠し、本サービスに関する紛争については、
                東京地方裁判所を第一審の専属的合意管轄裁判所とします。
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">6. 規約の変更</h2>
              <p>
                運営者は、必要に応じて本規約を変更することができます。
                変更後の規約は、本サービス上に掲載した時点で効力を生じるものとします。
              </p>
            </section>

            <section className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500">最終更新日: 2024年1月</p>
            </section>
          </div>

          <div className="mt-8 flex justify-center">
            <Link
              to="/login"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              ログインページへ戻る
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;
