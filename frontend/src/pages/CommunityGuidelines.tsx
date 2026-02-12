import React from 'react';
import { Link } from 'react-router-dom';

const CommunityGuidelines: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">🌈 Persona AI コミュニティガイドライン</h1>
          
          <div className="mb-6 flex gap-4">
            <Link to="/terms" className="text-blue-600 hover:underline">利用規約</Link>
            <Link to="/privacy" className="text-blue-600 hover:underline">プライバシーポリシー</Link>
            <Link to="/copyright" className="text-blue-600 hover:underline">著作権ポリシー</Link>
          </div>

          <p className="text-sm text-gray-500 mb-8">
            <strong>最終更新日:</strong> 2026年2月12日
          </p>

          <div className="space-y-8 text-gray-700">
            {/* はじめに */}
            <section id="intro">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. はじめに</h2>
              <p className="mb-4">
                <strong>Persona AI</strong>は、クリエイターとユーザーが安全に交流できるコミュニティを目指しています。
              </p>
              <p>
                本ガイドラインは、すべてのユーザーが快適に本サービスを利用するためのルールです。
              </p>
            </section>

            {/* 基本原則 */}
            <section id="principles">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. 基本原則</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">尊重</h3>
                  <ul className="text-sm space-y-1">
                    <li>• 他のユーザーを尊重する</li>
                    <li>• 多様な意見・価値観を認める</li>
                    <li>• 丁寧なコミュニケーション</li>
                  </ul>
                </div>

                <div className="bg-green-50 p-4 rounded">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">安全性</h3>
                  <ul className="text-sm space-y-1">
                    <li>• 自分と他者の安全を最優先</li>
                    <li>• 個人情報を守る</li>
                    <li>• 不適切なコンテンツを投稿しない</li>
                  </ul>
                </div>

                <div className="bg-purple-50 p-4 rounded">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">誠実さ</h3>
                  <ul className="text-sm space-y-1">
                    <li>• 嘘や誤情報を広めない</li>
                    <li>• なりすましをしない</li>
                    <li>• 著作権を尊重する</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* 禁止事項 */}
            <section id="prohibited">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. 禁止事項</h2>
              <p className="mb-4">
                以下の行為は禁止します。違反した場合、アカウント停止等の措置を講じます。
              </p>

              <div className="space-y-4">
                <div className="bg-red-50 p-4 rounded">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">3.1 暴力的・差別的なコンテンツ</h3>
                  <p className="font-semibold mb-2 text-sm">❌ 禁止例:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                    <li>暴力の脅迫・煽動</li>
                    <li>人種・性別・宗教等に基づく差別</li>
                    <li>ヘイトスピーチ</li>
                    <li>自傷・自殺の煽動</li>
                  </ul>
                </div>

                <div className="bg-red-50 p-4 rounded">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">3.2 わいせつ・ポルノグラフィックなコンテンツ</h3>
                  <p className="font-semibold mb-2 text-sm">❌ 禁止例:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                    <li>わいせつな画像・動画</li>
                    <li>性的な内容の人格AI</li>
                    <li>未成年を性的対象とする内容</li>
                    <li>リベンジポルノ</li>
                  </ul>
                </div>

                <div className="bg-red-50 p-4 rounded">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">3.3 ハラスメント・誹謗中傷</h3>
                  <p className="font-semibold mb-2 text-sm">❌ 禁止例:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                    <li>個人への嫌がらせ</li>
                    <li>誹謗中傷・名誉毀損</li>
                    <li>ストーキング行為</li>
                    <li>ドクシング（個人情報の暴露）</li>
                  </ul>
                </div>

                <div className="bg-red-50 p-4 rounded">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">3.4 スパム・広告</h3>
                  <p className="font-semibold mb-2 text-sm">❌ 禁止例:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                    <li>スパム投稿</li>
                    <li>商業目的の宣伝（許可なし）</li>
                    <li>フィッシング詐欺</li>
                    <li>マルウェアの配布</li>
                  </ul>
                </div>

                <div className="bg-red-50 p-4 rounded">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">3.5 知的財産権の侵害</h3>
                  <p className="font-semibold mb-2 text-sm">❌ 禁止例:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                    <li>有名キャラクターの無断使用</li>
                    <li>著名人の名前・肖像の無断使用</li>
                    <li>他者の作品の無断転載</li>
                    <li>商標・ロゴの不正利用</li>
                  </ul>
                  <p className="mt-2 text-sm">
                    詳細は、<Link to="/copyright" className="text-blue-600 hover:underline font-semibold">著作権ポリシー</Link>をご確認ください。
                  </p>
                </div>

                <div className="bg-red-50 p-4 rounded">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">3.6 不正アクセス・システム妨害</h3>
                  <p className="font-semibold mb-2 text-sm">❌ 禁止例:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                    <li>ハッキング・クラッキング</li>
                    <li>DDoS攻撃</li>
                    <li>自動化ツールの悪用</li>
                    <li>脆弱性の悪用</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* 推奨行動 */}
            <section id="recommended">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. 推奨行動</h2>
              <p className="mb-4">以下の行動を推奨します。</p>

              <div className="space-y-4">
                <div className="bg-green-50 p-4 rounded">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">4.1 クリエイティブな人格AI</h3>
                  <p className="font-semibold mb-2 text-sm">✅ 推奨例:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                    <li>オリジナルキャラクターの作成</li>
                    <li>架空の設定・世界観の構築</li>
                    <li>ユーザーに楽しんでもらえる工夫</li>
                    <li>独自の話し方・個性の設定</li>
                  </ul>
                </div>

                <div className="bg-green-50 p-4 rounded">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">4.2 建設的なフィードバック</h3>
                  <p className="font-semibold mb-2 text-sm">✅ 推奨例:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                    <li>丁寧な評価コメント</li>
                    <li>改善提案</li>
                    <li>バグ報告</li>
                    <li>他のクリエイターへの応援</li>
                  </ul>
                </div>

                <div className="bg-green-50 p-4 rounded">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">4.3 適切な通報</h3>
                  <p className="font-semibold mb-2 text-sm">✅ 推奨例:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                    <li>不適切なコンテンツを発見したら通報</li>
                    <li>具体的な理由を記載</li>
                    <li>虚偽の通報はしない</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* 違反時の対応 */}
            <section id="enforcement">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. 違反時の対応</h2>

              <h3 className="text-xl font-semibold text-gray-900 mt-4 mb-2">5.1 段階的措置</h3>
              <div className="space-y-4">
                <div className="bg-yellow-50 p-4 rounded">
                  <p className="font-semibold mb-2">【1回目】⚠️ 警告</p>
                  <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                    <li>警告メール送信</li>
                    <li>違反コンテンツの削除</li>
                  </ul>
                </div>
                <div className="bg-orange-50 p-4 rounded">
                  <p className="font-semibold mb-2">【2回目】🚫 アカウント一時停止</p>
                  <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                    <li>7日間のアカウント停止</li>
                    <li>再発防止の誓約書提出</li>
                  </ul>
                </div>
                <div className="bg-red-50 p-4 rounded">
                  <p className="font-semibold mb-2">【3回目】❌ アカウント永久停止</p>
                  <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                    <li>アカウント永久削除</li>
                    <li>IPアドレスのブロック</li>
                  </ul>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-2">5.2 即座の永久停止</h3>
              <div className="bg-red-100 p-4 rounded">
                <p className="font-semibold mb-2">以下の場合は、1回でアカウント永久停止とします：</p>
                <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                  <li>児童ポルノ</li>
                  <li>テロの煽動</li>
                  <li>重大な著作権侵害（商業目的）</li>
                  <li>重大なハラスメント</li>
                </ul>
              </div>
            </section>

            {/* 通報システム */}
            <section id="report">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. 通報システム</h2>
              <p className="mb-4">
                不適切なコンテンツを発見した場合は、通報してください。
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-4 mb-2">6.1 通報方法</h3>
              <div className="bg-blue-50 p-4 rounded">
                <p><strong>Email:</strong> report@persona-ai.com</p>
                <p><strong>件名:</strong> 「コンテンツの通報」</p>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mt-4 mb-2">6.2 必要情報</h3>
              <div className="bg-gray-100 p-4 rounded">
                <p className="font-semibold mb-2">【必須項目】</p>
                <ol className="list-decimal list-inside space-y-2 ml-4 text-sm">
                  <li>通報するコンテンツのURL</li>
                  <li>通報理由（暴力的・差別的、わいせつ、ハラスメント、スパム、著作権侵害、その他）</li>
                  <li>詳細説明（具体的に記載）</li>
                  <li>スクリーンショット（あれば）</li>
                </ol>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mt-4 mb-2">6.3 対応期限</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>通常:</strong> 72時間以内に確認・対応</li>
                <li><strong>緊急:</strong> 24時間以内に対応</li>
              </ul>
            </section>

            {/* チェックリスト */}
            <section id="checklist">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">✅ チェックリスト</h2>
              <div className="bg-green-50 p-4 rounded">
                <p className="mb-2 font-semibold">安全なコミュニティのために、以下を守りましょう：</p>
                <ul className="space-y-2">
                  <li>
                    <input type="checkbox" id="check1" className="mr-2" />
                    <label htmlFor="check1">他のユーザーを尊重する</label>
                  </li>
                  <li>
                    <input type="checkbox" id="check2" className="mr-2" />
                    <label htmlFor="check2">不適切なコンテンツを投稿しない</label>
                  </li>
                  <li>
                    <input type="checkbox" id="check3" className="mr-2" />
                    <label htmlFor="check3">著作権を侵害しない</label>
                  </li>
                  <li>
                    <input type="checkbox" id="check4" className="mr-2" />
                    <label htmlFor="check4">なりすましをしない</label>
                  </li>
                  <li>
                    <input type="checkbox" id="check5" className="mr-2" />
                    <label htmlFor="check5">不適切なコンテンツを発見したら通報する</label>
                  </li>
                </ul>
              </div>
            </section>

            {/* お問い合わせ */}
            <section id="contact">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. お問い合わせ</h2>
              <p className="mb-2">
                コミュニティに関するご質問は、以下の連絡先までお問い合わせください。
              </p>
              <div className="bg-blue-50 p-4 rounded">
                <p><strong>Email:</strong> community@persona-ai.com</p>
                <p><strong>対応時間:</strong> 平日 9:00-18:00</p>
              </div>
            </section>

            <section className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                <strong>附則</strong><br/>
                本ガイドラインは、2026年2月12日から施行します。
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
              to="/terms"
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              利用規約へ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityGuidelines;
