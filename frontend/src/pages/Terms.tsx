import React from 'react';
import { Link } from 'react-router-dom';

const Terms: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* 警告バナー */}
          <div className="bg-red-50 border-l-4 border-red-500 p-6 mb-8">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-bold text-red-800">⚠️ 重要な注意事項</h3>
                <p className="mt-2 text-sm text-red-700">
                  <strong>本規約は、ユーザーが本サービスを利用することにより生じるすべての責任をユーザーに帰属させ、
                  運営者の責任を最小限に制限するものです。本規約に同意できない場合は、本サービスを利用しないでください。</strong>
                </p>
              </div>
            </div>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-6">📋 Persona AI 利用規約（完全版）</h1>
          
          <div className="mb-6 flex gap-4">
            <Link to="/privacy" className="text-blue-600 hover:underline">プライバシーポリシー</Link>
            <Link to="/copyright" className="text-blue-600 hover:underline">著作権ポリシー</Link>
            <Link to="/community" className="text-blue-600 hover:underline">コミュニティガイドライン</Link>
          </div>

          <p className="text-sm text-gray-500 mb-8">
            <strong>最終更新日:</strong> 2026年2月12日<br/>
            <strong>施行日:</strong> 2026年2月12日
          </p>

          <div className="space-y-8 text-gray-700">
            {/* ユーザーの責任と補償義務 */}
            <section id="user-responsibility" className="bg-yellow-50 p-6 rounded-lg border-2 border-yellow-400">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">⚠️ 7. ユーザーの責任と補償義務</h2>
              
              <div className="space-y-4">
                <div className="bg-white p-4 rounded">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">7.1 完全な責任の帰属</h3>
                  <p className="font-bold text-red-700">
                    ユーザーは、本サービスの利用により生じたすべての結果について、単独で責任を負うものとします。
                  </p>
                </div>

                <div className="bg-white p-4 rounded">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">7.2 補償義務（Indemnification）</h3>
                  <p className="font-bold text-red-700 mb-2">
                    ユーザーは、以下の場合において、当社が被ったすべての損害を補償するものとします：
                  </p>
                  <ol className="list-decimal list-inside space-y-2 ml-4">
                    <li>
                      <strong>ユーザーの行為により、第三者から当社が訴えられた場合</strong>
                      <ul className="list-disc list-inside ml-6 mt-1 text-sm">
                        <li>例: ユーザーが著作権侵害 → 権利者が当社を訴える → ユーザーが全責任を負う</li>
                        <li>補償範囲: 弁護士費用、裁判費用、和解金、損害賠償金、その他一切の費用</li>
                      </ul>
                    </li>
                    <li>
                      <strong>ユーザーの行為により、当社の信用が毀損された場合</strong>
                      <ul className="list-disc list-inside ml-6 mt-1 text-sm">
                        <li>例: なりすまし、詐欺行為、違法コンテンツの投稿</li>
                        <li>補償範囲: ブランド毀損、評判被害、逸失利益</li>
                      </ul>
                    </li>
                    <li>
                      <strong>ユーザーが本規約に違反した場合</strong>
                      <ul className="list-disc list-inside ml-6 mt-1 text-sm">
                        <li>補償範囲: 違反の調査・対応にかかったすべての費用</li>
                      </ul>
                    </li>
                  </ol>
                </div>

                <div className="bg-red-100 p-4 rounded">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">7.4 防御義務</h3>
                  <p className="font-bold text-red-800">
                    第三者から当社が訴えられた場合、ユーザーは当社を防御する義務を負います：
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4 mt-2 text-sm">
                    <li>ユーザーは、当社の指示に従い、訴訟対応に協力するものとします</li>
                    <li>ユーザーは、当社の承諾なしに和解してはなりません</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* AI応答に関する免責 */}
            <section id="ai-disclaimer" className="bg-orange-50 p-6 rounded-lg border-2 border-orange-400">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">🤖 9. AI応答に関する免責</h2>
              
              <div className="space-y-4">
                <div className="bg-white p-4 rounded">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">9.1 AI応答の性質</h3>
                  <p className="font-bold mb-2">本サービスのAI応答は、以下の性質を有します：</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li><strong>参考情報であり、正確性・完全性を保証しません</strong></li>
                    <li><strong>専門的な助言ではありません</strong>（医療、法律、投資等）</li>
                    <li><strong>当社の見解ではありません</strong></li>
                  </ul>
                </div>

                <div className="bg-red-100 p-4 rounded">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">9.3 完全な免責</h3>
                  <p className="font-bold text-red-800 mb-2">
                    AI応答により損害が生じた場合でも、当社は一切の責任を負いません：
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                    <li>例: AI応答で「この株を買え」→ 損失 → 当社は免責</li>
                    <li>例: AI応答で「この薬を飲め」→ 健康被害 → 当社は免責</li>
                    <li>例: AI応答で「これは合法」→ 逮捕 → 当社は免責</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* 料金と返金 */}
            <section id="payment">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. 料金と返金</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mt-4 mb-2">11.2 返金不可</h3>
              <div className="bg-red-50 p-4 rounded">
                <p className="font-bold text-red-700">
                  当社は、理由の如何を問わず、既払金の返金を一切行いません：
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4 mt-2 text-sm">
                  <li>サービス停止・終了</li>
                  <li>アカウント停止・削除</li>
                  <li>サービス品質への不満</li>
                  <li>その他いかなる理由</li>
                </ul>
              </div>
            </section>

            {/* 損害賠償の上限 */}
            <section id="liability-cap">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">14. 損害賠償の上限</h2>
              
              <div className="bg-blue-50 p-4 rounded">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">14.1 損害賠償額の上限</h3>
                <p className="font-bold mb-2">
                  当社に故意・重過失がある場合でも、損害賠償額は以下を上限とします：
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>直近1ヶ月間にユーザーが当社に支払った金額</strong></li>
                  <li><strong className="text-red-700">Freeプランユーザーの場合: ¥0（ゼロ円）</strong></li>
                </ul>
              </div>
            </section>

            {/* 仲裁条項 */}
            <section id="arbitration" className="bg-purple-50 p-6 rounded-lg border-2 border-purple-400">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">⚖️ 15. 紛争解決（仲裁条項）</h2>
              
              <div className="space-y-4">
                <div className="bg-white p-4 rounded">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">15.1 仲裁による解決</h3>
                  <p className="font-bold text-purple-700">
                    本規約に関するすべての紛争は、裁判所ではなく、仲裁により解決するものとします。
                  </p>
                </div>

                <div className="bg-white p-4 rounded">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">15.3 仲裁判断の最終性</h3>
                  <p className="font-bold">
                    仲裁判断は最終的なものとし、ユーザーはこれに対して異議を述べないものとします。
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4 mt-2 text-sm">
                    <li>仲裁判断に対する上訴は不可</li>
                    <li>仲裁判断は、裁判所の判決と同一の効力を有します</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* 集団訴訟の放棄 */}
            <section id="class-action">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">16. 集団訴訟の放棄</h2>
              
              <div className="bg-red-50 p-4 rounded">
                <p className="font-bold text-red-700">
                  ユーザーは、本サービスに関する集団訴訟（クラスアクション）に参加する権利を放棄するものとします。
                </p>
                <p className="mt-2 text-sm">
                  ユーザーは、個別の仲裁のみを提起できるものとします。
                </p>
              </div>
            </section>

            {/* 時効の短縮 */}
            <section id="statute-limitations">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">17. 時効の短縮</h2>
              
              <div className="bg-orange-50 p-4 rounded">
                <p className="font-bold text-orange-700">
                  本サービスに関するすべての請求権は、原因発生から3ヶ月以内に行使しなければ消滅するものとします。
                </p>
                <p className="mt-2 text-sm">
                  法定時効期間に関わらず、3ヶ月で時効消滅します。3ヶ月経過後の請求は、一切受け付けません。
                </p>
              </div>
            </section>

            {/* 同意確認チェックリスト */}
            <section id="consent-checklist" className="bg-green-50 p-6 rounded-lg border-2 border-green-500">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">✅ 同意確認チェックリスト</h2>
              <p className="mb-4 font-semibold">本サービスを利用する前に、以下を確認してください：</p>
              <ul className="space-y-2">
                <li>
                  <input type="checkbox" id="check1" className="mr-2" />
                  <label htmlFor="check1">本規約を最後まで読み、理解しました</label>
                </li>
                <li>
                  <input type="checkbox" id="check2" className="mr-2" />
                  <label htmlFor="check2" className="font-bold text-red-700">ユーザーがすべての責任を負うことに同意します</label>
                </li>
                <li>
                  <input type="checkbox" id="check3" className="mr-2" />
                  <label htmlFor="check3" className="font-bold text-red-700">当社が一切の責任を負わないことに同意します</label>
                </li>
                <li>
                  <input type="checkbox" id="check4" className="mr-2" />
                  <label htmlFor="check4">損害賠償請求権を放棄することに同意します</label>
                </li>
                <li>
                  <input type="checkbox" id="check5" className="mr-2" />
                  <label htmlFor="check5">仲裁により紛争を解決することに同意します</label>
                </li>
                <li>
                  <input type="checkbox" id="check6" className="mr-2" />
                  <label htmlFor="check6">集団訴訟に参加しないことに同意します</label>
                </li>
                <li>
                  <input type="checkbox" id="check7" className="mr-2" />
                  <label htmlFor="check7">3ヶ月の時効に同意します</label>
                </li>
                <li>
                  <input type="checkbox" id="check8" className="mr-2" />
                  <label htmlFor="check8">AI応答の利用は自己責任であることを理解しました</label>
                </li>
                <li>
                  <input type="checkbox" id="check9" className="mr-2" />
                  <label htmlFor="check9">返金は一切行われないことに同意します</label>
                </li>
                <li>
                  <input type="checkbox" id="check10" className="mr-2" />
                  <label htmlFor="check10">当社がいつでもサービスを停止できることに同意します</label>
                </li>
              </ul>
              <p className="mt-4 font-bold text-green-800">
                すべてにチェックを入れた上で、本サービスを利用してください。
              </p>
            </section>

            {/* 完全版へのリンク */}
            <section className="bg-gray-100 p-6 rounded-lg">
              <h2 className="text-xl font-bold text-gray-900 mb-4">📄 完全版の利用規約</h2>
              <p className="mb-4">
                本ページは、主要な条項を抜粋したものです。完全版の利用規約には、以下の条項も含まれます：
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                <li>定義</li>
                <li>規約への同意</li>
                <li>サービスの利用</li>
                <li>アカウント</li>
                <li>禁止行為</li>
                <li>知的財産権</li>
                <li>データとプライバシー</li>
                <li>サービスの変更・停止</li>
                <li>免責事項と責任制限</li>
                <li>規約の変更</li>
                <li>準拠法と管轄</li>
                <li>分離可能性</li>
                <li>完全合意</li>
              </ul>
              <p className="mt-4 text-sm text-gray-600">
                完全版は、<a href="https://github.com/your-repo/persona-ai-saas/blob/main/TERMS_OF_SERVICE.md" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">GitHubリポジトリ</a>でご確認いただけます。
              </p>
            </section>

            <section className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                <strong>附則</strong><br/>
                本規約は、2026年2月12日から施行します。
              </p>
              <p className="mt-2 text-sm text-gray-500">
                <strong>Persona AI 運営事務局</strong><br/>
                最終更新: 2026年2月12日
              </p>
            </section>
          </div>

          <div className="mt-8 flex justify-center gap-4">
            <Link
              to="/"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              ホームへ戻る
            </Link>
            <Link
              to="/login"
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              ログインページへ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;
