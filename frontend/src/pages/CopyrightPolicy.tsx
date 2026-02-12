import React from 'react';
import { Link } from 'react-router-dom';

const CopyrightPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">📝 Persona AI 著作権ポリシー</h1>
          
          <div className="mb-6 flex gap-4">
            <Link to="/terms" className="text-blue-600 hover:underline">利用規約</Link>
            <Link to="/privacy" className="text-blue-600 hover:underline">プライバシーポリシー</Link>
            <Link to="/community" className="text-blue-600 hover:underline">コミュニティガイドライン</Link>
          </div>

          <p className="text-sm text-gray-500 mb-8">
            <strong>最終更新日:</strong> 2026年2月12日
          </p>

          <div className="space-y-8 text-gray-700">
            {/* 基本方針 */}
            <section id="policy">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. 当社の基本方針</h2>
              <p className="mb-4">
                <strong>Persona AI</strong>は、知的財産権を尊重し、著作権侵害に対して迅速かつ適切に対応します。
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-4 mb-2">1.1 法的根拠</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>🇯🇵 <strong>日本:</strong> 著作権法（昭和45年法律第48号）、プロバイダ責任制限法（平成13年法律第137号）</li>
                <li>🇺🇸 <strong>米国:</strong> デジタルミレニアム著作権法（DMCA, 17 U.S.C. § 512）</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mt-4 mb-2">1.2 当社の立場</h3>
              <p className="mb-2">当社は<strong>プラットフォーム提供者</strong>であり、以下の条件下で免責されます：</p>
              <ul className="list-none space-y-2 ml-4">
                <li>✅ 侵害を知らなかった（事前認識がない）</li>
                <li>✅ 通知受領後、速やかに削除した</li>
                <li>✅ 技術的に可能な範囲で侵害防止措置を講じていた</li>
              </ul>
            </section>

            {/* 著作権侵害の定義 */}
            <section id="infringement">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. 著作権侵害の定義</h2>

              <h3 className="text-xl font-semibold text-gray-900 mt-4 mb-2">2.1 禁止される行為</h3>
              
              <div className="space-y-4">
                <div className="bg-red-50 p-4 rounded">
                  <p className="font-semibold mb-2">❌ キャラクター名の無断使用</p>
                  <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                    <li>ドラえもん</li>
                    <li>ミッキーマウス</li>
                    <li>ポケモン（ピカチュウ等）</li>
                    <li>呪術廻戦のキャラクター</li>
                    <li>推しの子のキャラクター</li>
                  </ul>
                </div>

                <div className="bg-red-50 p-4 rounded">
                  <p className="font-semibold mb-2">❌ 著名人の名前・肖像の無断使用</p>
                  <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                    <li>芸能人の名前を使った人格AI</li>
                    <li>声優・VTuberの名前を使った人格AI</li>
                    <li>スポーツ選手の名前を使った人格AI</li>
                  </ul>
                </div>

                <div className="bg-red-50 p-4 rounded">
                  <p className="font-semibold mb-2">❌ 他者の作品の無断転載</p>
                  <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                    <li>小説・漫画の文章をそのまま使用</li>
                    <li>イラスト・画像の無断転載</li>
                    <li>楽曲の歌詞を無断で使用</li>
                  </ul>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-2">2.2 許可される行為</h3>
              <div className="bg-green-50 p-4 rounded">
                <p className="font-semibold mb-2">✅ 以下の場合は、著作権侵害にあたらない可能性があります：</p>
                <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                  <li>パロディ・風刺（日本法では限定的）</li>
                  <li>引用（出典を明記し、必要最小限の範囲）</li>
                  <li>権利者の明示的な許諾を得た場合</li>
                  <li>著作権保護期間が切れた作品（パブリックドメイン）</li>
                  <li>クリエイティブ・コモンズ（CC）ライセンスに準拠した使用</li>
                </ul>
              </div>
              <p className="mt-2 text-sm text-gray-600">
                ⚠️ <strong>注意:</strong> 日本では「パロディ」が米国ほど広く認められていないため、慎重に判断してください。
              </p>
            </section>

            {/* 削除要請の方法 */}
            <section id="takedown">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. 削除要請の方法</h2>

              <h3 className="text-xl font-semibold text-gray-900 mt-4 mb-2">3.1 連絡先</h3>
              <div className="bg-blue-50 p-4 rounded">
                <p className="font-semibold mb-2">📧 著作権侵害専用窓口</p>
                <p><strong>Email:</strong> copyright@persona-ai.com</p>
                <p><strong>件名:</strong> 「著作権侵害の申し立て」</p>
                <p><strong>対応時間:</strong> 24時間以内に対応（土日祝日含む）</p>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-2">3.2 必要情報</h3>
              <div className="bg-gray-100 p-4 rounded">
                <p className="font-semibold mb-2">【必須項目】</p>
                <ol className="list-decimal list-inside space-y-2 ml-4 text-sm">
                  <li>著作権者の氏名・連絡先（氏名/企業名、住所、電話番号、Email）</li>
                  <li>侵害されている著作物の詳細（作品名、作品URL、著作権登録番号）</li>
                  <li>侵害コンテンツの特定（URL、ユーザーID、スクリーンショット）</li>
                  <li>著作権者であることの証明（登記簿謄本、著作権登録証明書等）</li>
                  <li>宣誓文（情報が正確であることの宣誓）</li>
                </ol>
              </div>
            </section>

            {/* 削除プロセス */}
            <section id="process">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. 削除プロセス</h2>

              <h3 className="text-xl font-semibold text-gray-900 mt-4 mb-2">4.1 対応フロー</h3>
              <div className="bg-gray-100 p-4 rounded">
                <ol className="list-decimal list-inside space-y-2 ml-4">
                  <li>削除要請受領 （1時間以内）</li>
                  <li>初期確認（要件充足チェック） （6時間以内）</li>
                  <li>侵害内容の審査 （24時間以内）</li>
                  <li>削除実施 or 却下</li>
                  <li>両者への通知 （14日間）</li>
                  <li>異議申し立て期間</li>
                  <li>最終判断</li>
                </ol>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-2">4.2 対応期限</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-4 py-2">緊急度</th>
                      <th className="border border-gray-300 px-4 py-2">判断基準</th>
                      <th className="border border-gray-300 px-4 py-2">対応期限</th>
                      <th className="border border-gray-300 px-4 py-2">対応内容</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-semibold">緊急</td>
                      <td className="border border-gray-300 px-4 py-2">大企業・公的機関からの申立</td>
                      <td className="border border-gray-300 px-4 py-2">24時間以内</td>
                      <td className="border border-gray-300 px-4 py-2">即座に削除・アカウント停止</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-semibold">通常</td>
                      <td className="border border-gray-300 px-4 py-2">一般的な著作権侵害</td>
                      <td className="border border-gray-300 px-4 py-2">72時間以内</td>
                      <td className="border border-gray-300 px-4 py-2">確認後、削除措置</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-semibold">軽微</td>
                      <td className="border border-gray-300 px-4 py-2">軽微な侵害の疑い</td>
                      <td className="border border-gray-300 px-4 py-2">7営業日以内</td>
                      <td className="border border-gray-300 px-4 py-2">警告・改善要求</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* 反復侵害者への対応 */}
            <section id="repeat">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. 反復侵害者への対応</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mt-4 mb-2">6.1 3ストライクポリシー</h3>
              <div className="space-y-4">
                <div className="bg-yellow-50 p-4 rounded">
                  <p className="font-semibold mb-2">【1回目】⚠️ 警告</p>
                  <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                    <li>警告メール送信</li>
                    <li>人格AIの削除</li>
                    <li>監視対象に追加</li>
                  </ul>
                </div>
                <div className="bg-orange-50 p-4 rounded">
                  <p className="font-semibold mb-2">【2回目】🚫 アカウント一時停止</p>
                  <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                    <li>アカウント停止（7日間）</li>
                    <li>全人格AIの非公開化</li>
                    <li>最終警告メール送信</li>
                  </ul>
                </div>
                <div className="bg-red-50 p-4 rounded">
                  <p className="font-semibold mb-2">【3回目】❌ アカウント永久停止</p>
                  <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                    <li>アカウント永久削除</li>
                    <li>全データの削除</li>
                    <li>IPアドレスのブロック</li>
                    <li>再登録の禁止</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* よくある質問 */}
            <section id="faq">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">✅ よくある質問（FAQ）</h2>
              
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-semibold text-gray-900">Q1: パロディは許可されますか？</h3>
                  <p className="text-sm mt-2">
                    <strong>A:</strong> 日本では、パロディが著作権侵害にあたる可能性があります。
                    米国と異なり、日本ではパロディの保護が限定的です。著作権者の許諾を得ることを強く推奨します。
                  </p>
                </div>

                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-semibold text-gray-900">Q2: 削除要請はどのくらいで対応されますか？</h3>
                  <p className="text-sm mt-2">
                    <strong>A:</strong> 通常72時間以内に対応します。緊急の場合は24時間以内に対応します。
                  </p>
                </div>

                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-semibold text-gray-900">Q3: 異議申し立てはできますか？</h3>
                  <p className="text-sm mt-2">
                    <strong>A:</strong> はい。削除通知受領後14日以内に、証拠書類を添えて異議申し立てができます。
                  </p>
                </div>

                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-semibold text-gray-900">Q4: 公式バッジはどうすれば取得できますか？</h3>
                  <p className="text-sm mt-2">
                    <strong>A:</strong> 管理者に申請してください。著作権者であることの証明が必要です。
                  </p>
                </div>
              </div>
            </section>

            {/* お問い合わせ */}
            <section id="contact">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. お問い合わせ</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900">著作権侵害の申し立て</h3>
                  <p><strong>Email:</strong> copyright@persona-ai.com</p>
                  <p><strong>対応時間:</strong> 24時間以内に対応</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">異議申し立て</h3>
                  <p><strong>Email:</strong> appeals@persona-ai.com</p>
                  <p><strong>対応時間:</strong> 14日以内に回答</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">公式パートナー申請</h3>
                  <p><strong>Email:</strong> partners@persona-ai.com</p>
                  <p><strong>対応時間:</strong> 7営業日以内に回答</p>
                </div>
              </div>
            </section>

            <section className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                <strong>附則</strong><br/>
                本ポリシーは、2026年2月12日から施行します。
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

export default CopyrightPolicy;
