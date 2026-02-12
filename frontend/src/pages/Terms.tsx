import React from 'react';
import { Link } from 'react-router-dom';

const Terms: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">📋 Persona AI 利用規約</h1>
          
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
            {/* はじめに */}
            <section id="intro">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. はじめに</h2>
              <p className="mb-4">
                <strong>Persona AI</strong>（以下「本サービス」）をご利用いただきありがとうございます。
              </p>
              <p className="mb-4">
                本利用規約（以下「本規約」）は、本サービスの利用条件を定めるものです。
                本サービスを利用することにより、お客様は本規約に同意したものとみなされます。
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-4 mb-2">1.1 本規約への同意</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>本サービスにアカウントを作成すること、または本サービスを利用することにより、お客様は本規約に同意したものとみなされます</li>
                <li>本規約に同意いただけない場合は、本サービスをご利用いただけません</li>
                <li>未成年者の方は、保護者の同意を得た上でご利用ください</li>
              </ul>
            </section>

            {/* 定義 */}
            <section id="definitions">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. 定義</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-4 py-2 text-left">用語</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">定義</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-semibold">本サービス</td>
                      <td className="border border-gray-300 px-4 py-2">Persona AIが提供する人格AI作成・運用プラットフォーム</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-semibold">ユーザー</td>
                      <td className="border border-gray-300 px-4 py-2">本サービスを利用するすべての個人または法人</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-semibold">人格AI</td>
                      <td className="border border-gray-300 px-4 py-2">ユーザーが本サービスを通じて作成したAIキャラクター</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-semibold">コンテンツ</td>
                      <td className="border border-gray-300 px-4 py-2">テキスト、画像、人格設定など、ユーザーが投稿・作成した情報</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-semibold">公式アカウント</td>
                      <td className="border border-gray-300 px-4 py-2">本サービスが認証した正規のアカウント（公式バッジ付き）</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* サービスの利用 */}
            <section id="service">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. サービスの利用</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mt-4 mb-2">3.1 サービス提供の範囲</h3>
              <ul className="list-none space-y-2 ml-4">
                <li>✅ 人格AIの作成・編集・管理</li>
                <li>✅ AIチャット機能（Groq、Gemini 2.0）</li>
                <li>✅ LINE連携機能</li>
                <li>✅ 会話履歴の管理</li>
                <li>✅ 管理者ダッシュボード（管理者のみ）</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mt-4 mb-2">3.2 利用料金</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Freeプラン:</strong> 無料（広告表示あり）</li>
                <li><strong>Premiumプラン:</strong> ¥945/月（広告なし、チケット無制限）</li>
              </ul>
            </section>

            {/* 禁止行為 */}
            <section id="prohibited">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. 禁止行為</h2>
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                <p className="font-semibold text-red-800">
                  以下の行為を禁止します。違反した場合、即座にアカウント停止および法的措置を講じます。
                </p>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mt-4 mb-2">5.1 知的財産権の侵害</h3>
              <div className="bg-gray-100 p-4 rounded mb-4">
                <p className="font-semibold mb-2">❌ 禁止例:</p>
                <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                  <li>有名キャラクター名の無断使用（例: ドラえもん、ポケモン、ミッキーマウス）</li>
                  <li>著名人の名前・肖像の無断使用</li>
                  <li>他者の作品・画像の無断転載</li>
                  <li>商標・ロゴの不正利用</li>
                </ul>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mt-4 mb-2">5.2 なりすまし</h3>
              <div className="bg-gray-100 p-4 rounded mb-4">
                <p className="font-semibold mb-2">❌ 禁止例:</p>
                <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                  <li>「【公式】」「本物」等の虚偽表示</li>
                  <li>著名人・企業を装う行為</li>
                  <li>他者の信用を不当に利用する行為</li>
                  <li>公式アカウントを偽装する行為</li>
                </ul>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mt-4 mb-2">5.3 不適切なコンテンツ</h3>
              <div className="bg-gray-100 p-4 rounded mb-4">
                <p className="font-semibold mb-2">❌ 禁止例:</p>
                <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                  <li>暴力的・差別的な内容</li>
                  <li>わいせつ・ポルノグラフィックな内容</li>
                  <li>他者を誹謗中傷する内容</li>
                  <li>スパム・広告目的の投稿</li>
                </ul>
              </div>
            </section>

            {/* 著作権侵害への対応 */}
            <section id="copyright">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. 著作権侵害への対応</h2>
              <p className="mb-4">
                詳細は、<Link to="/copyright" className="text-blue-600 hover:underline font-semibold">著作権ポリシー</Link>をご確認ください。
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-4 mb-2">7.1 削除要請の連絡先</h3>
              <div className="bg-blue-50 p-4 rounded mb-4">
                <p className="font-semibold mb-2">📧 著作権侵害専用窓口</p>
                <p><strong>Email:</strong> copyright@persona-ai.com</p>
                <p><strong>対応時間:</strong> 24時間以内に対応</p>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mt-4 mb-2">7.2 対応期限</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-4 py-2">緊急度</th>
                      <th className="border border-gray-300 px-4 py-2">対応期限</th>
                      <th className="border border-gray-300 px-4 py-2">対応内容</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-semibold">緊急</td>
                      <td className="border border-gray-300 px-4 py-2">24時間以内</td>
                      <td className="border border-gray-300 px-4 py-2">即座に削除・アカウント停止</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-semibold">通常</td>
                      <td className="border border-gray-300 px-4 py-2">72時間以内</td>
                      <td className="border border-gray-300 px-4 py-2">確認後、削除措置</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-semibold">軽微</td>
                      <td className="border border-gray-300 px-4 py-2">7営業日以内</td>
                      <td className="border border-gray-300 px-4 py-2">警告・改善要求</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* 免責事項 */}
            <section id="disclaimer">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. 免責事項と責任制限</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mt-4 mb-2">9.1 プラットフォーム提供者の免責</h3>
              <p className="mb-2">
                当社は「プラットフォーム提供者」であり、ユーザーが投稿したコンテンツについて、以下の範囲で免責されます：
              </p>
              <ul className="list-none space-y-2 ml-4">
                <li>✅ 侵害を知らなかった場合</li>
                <li>✅ 通知受領後、速やかに削除した場合</li>
                <li>✅ 技術的に可能な範囲で侵害防止措置を講じていた場合</li>
              </ul>
              <p className="mt-2 text-sm text-gray-600">
                <strong>法的根拠:</strong> プロバイダ責任制限法（平成13年法律第137号）第3条
              </p>
            </section>

            {/* 準拠法 */}
            <section id="law">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. 準拠法と管轄裁判所</h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>準拠法:</strong> 日本法</li>
                <li><strong>管轄裁判所:</strong> 東京地方裁判所を第一審の専属的合意管轄裁判所とします</li>
              </ul>
            </section>

            {/* お問い合わせ */}
            <section id="contact">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">12. お問い合わせ</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900">一般的なお問い合わせ</h3>
                  <p><strong>Email:</strong> support@persona-ai.com</p>
                  <p><strong>対応時間:</strong> 平日 9:00-18:00</p>
                </div>
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
              </div>
            </section>

            {/* チェックリスト */}
            <section id="checklist">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">✅ チェックリスト（ユーザー向け）</h2>
              <div className="bg-green-50 p-4 rounded">
                <p className="mb-2 font-semibold">本サービスを安全にご利用いただくため、以下をご確認ください：</p>
                <ul className="space-y-2">
                  <li>
                    <input type="checkbox" id="check1" className="mr-2" />
                    <label htmlFor="check1">著作権で保護されているキャラクター名を使用していない</label>
                  </li>
                  <li>
                    <input type="checkbox" id="check2" className="mr-2" />
                    <label htmlFor="check2">他者の作品を無断で転載していない</label>
                  </li>
                  <li>
                    <input type="checkbox" id="check3" className="mr-2" />
                    <label htmlFor="check3">「【公式】」等の虚偽表示をしていない</label>
                  </li>
                  <li>
                    <input type="checkbox" id="check4" className="mr-2" />
                    <label htmlFor="check4">不適切なコンテンツを投稿していない</label>
                  </li>
                  <li>
                    <input type="checkbox" id="check5" className="mr-2" />
                    <label htmlFor="check5">本規約の内容を理解している</label>
                  </li>
                </ul>
              </div>
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
