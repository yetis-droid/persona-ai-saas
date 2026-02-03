import React from 'react';
import { Link } from 'react-router-dom';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* ヘッダー */}
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 font-medium transition-colors">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            トップに戻る
          </Link>
        </div>

        {/* メインコンテンツ */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-8 md:p-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
            プライバシーポリシー
          </h1>
          <p className="text-gray-600 mb-8">最終更新日: 2026年2月3日</p>

          <div className="prose prose-lg max-w-none">
            {/* 1. はじめに */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. はじめに</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Persona AI SaaS（以下「当サービス」）は、ユーザーの皆様のプライバシーを尊重し、個人情報の保護に努めています。
                本プライバシーポリシーは、当サービスがどのように個人情報を収集、使用、保護するかを説明します。
              </p>
            </section>

            {/* 2. 収集する情報 */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. 収集する情報</h2>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">2.1 ユーザー登録情報</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                <li>メールアドレス</li>
                <li>パスワード（暗号化して保存）</li>
                <li>ユーザー名</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">2.2 サービス利用情報</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                <li>作成した人格AI（キャラクター設定、会話履歴）</li>
                <li>チケット購入履歴</li>
                <li>サブスクリプション情報</li>
                <li>サービス利用状況（日次会話回数など）</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">2.3 自動収集情報</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                <li>IPアドレス</li>
                <li>ブラウザ情報</li>
                <li>アクセス日時</li>
                <li>Cookie情報</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">2.4 決済情報</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                決済情報（クレジットカード番号など）は、当サービスでは保存せず、決済代行サービス（Stripe）によって安全に処理されます。
              </p>
            </section>

            {/* 3. 情報の使用目的 */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. 情報の使用目的</h2>
              <p className="text-gray-700 leading-relaxed mb-4">収集した情報は、以下の目的で使用します：</p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>サービスの提供・運営</li>
                <li>ユーザー認証・アカウント管理</li>
                <li>AI会話の生成・保存</li>
                <li>決済処理・請求管理</li>
                <li>カスタマーサポート</li>
                <li>サービスの改善・分析</li>
                <li>不正利用の防止</li>
                <li>重要なお知らせの送信</li>
              </ul>
            </section>

            {/* 4. 情報の共有 */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. 情報の共有</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                当サービスは、以下の場合を除き、ユーザーの個人情報を第三者に提供しません：
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>ユーザーの同意がある場合</li>
                <li>法令に基づく場合</li>
                <li>サービス提供に必要な業務委託先（Stripe、Groq、Geminiなど）</li>
                <li>生命、身体または財産の保護のために必要な場合</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">4.1 第三者サービス</h3>
              <p className="text-gray-700 leading-relaxed mb-2">当サービスは、以下の第三者サービスを使用しています：</p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li><strong>Stripe</strong>: 決済処理</li>
                <li><strong>Groq API</strong>: AI会話生成（完全無料）</li>
                <li><strong>Google Gemini</strong>: AI会話生成（バックアップ）</li>
                <li><strong>Cloudflare Pages</strong>: ホスティング</li>
                <li><strong>Google AdSense</strong>: 広告配信（無料プランのみ）</li>
              </ul>
            </section>

            {/* 5. Cookie */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Cookie（クッキー）について</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                当サービスは、ユーザー体験の向上のためにCookieを使用します。Cookieは、ブラウザの設定で無効化できますが、
                一部の機能が正常に動作しなくなる可能性があります。
              </p>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">使用するCookie</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li><strong>認証Cookie</strong>: ログイン状態の維持</li>
                <li><strong>セッションCookie</strong>: サービスの機能提供</li>
                <li><strong>分析Cookie</strong>: サービス改善のためのアクセス解析</li>
                <li><strong>広告Cookie</strong>: Google AdSenseによる広告配信の最適化</li>
              </ul>
            </section>

            {/* 6. Google AdSense */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Google AdSenseについて</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                当サービスは、無料プランユーザーに対してGoogle AdSenseによる広告を表示します。
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Google AdSenseは、Cookieを使用してユーザーの興味に基づいた広告を配信します</li>
                <li>広告配信のためのCookieは、Google広告設定ページで管理できます</li>
                <li>Googleのプライバシーポリシー: <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">https://policies.google.com/privacy</a></li>
              </ul>
            </section>

            {/* 7. データの保管 */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. データの保管・セキュリティ</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                当サービスは、ユーザーの個人情報を保護するために、以下のセキュリティ対策を実施しています：
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>SSL/TLS暗号化通信</li>
                <li>パスワードのハッシュ化（bcrypt）</li>
                <li>JWT認証によるセキュアなアクセス制御</li>
                <li>定期的なセキュリティアップデート</li>
                <li>アクセス制限・ファイアウォール</li>
              </ul>
            </section>

            {/* 8. ユーザーの権利 */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. ユーザーの権利</h2>
              <p className="text-gray-700 leading-relaxed mb-4">ユーザーは、以下の権利を有します：</p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li><strong>アクセス権</strong>: 自分の個人情報の開示を請求できます</li>
                <li><strong>訂正権</strong>: 不正確な個人情報の訂正を請求できます</li>
                <li><strong>削除権</strong>: アカウント削除により個人情報の削除を請求できます</li>
                <li><strong>異議申立権</strong>: 個人情報の処理に異議を申し立てることができます</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-4">
                これらの権利を行使したい場合は、ダッシュボードのアカウント設定、または下記の連絡先までお問い合わせください。
              </p>
            </section>

            {/* 9. 子供のプライバシー */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. 子供のプライバシー</h2>
              <p className="text-gray-700 leading-relaxed">
                当サービスは、13歳未満の子供を対象としていません。13歳未満の子供の個人情報を故意に収集することはありません。
                もし13歳未満の子供の情報が収集されたことが判明した場合、速やかに削除します。
              </p>
            </section>

            {/* 10. プライバシーポリシーの変更 */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. プライバシーポリシーの変更</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                当サービスは、必要に応じて本プライバシーポリシーを変更することがあります。
                重要な変更がある場合は、サービス内で通知します。
              </p>
              <p className="text-gray-700 leading-relaxed">
                最終更新日をページ上部に記載していますので、定期的にご確認ください。
              </p>
            </section>

            {/* 11. お問い合わせ */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. お問い合わせ</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                本プライバシーポリシーに関するご質問やご不明点がある場合は、以下までお問い合わせください：
              </p>
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                <p className="text-gray-700"><strong>サービス名:</strong> Persona AI SaaS</p>
                <p className="text-gray-700"><strong>運営者:</strong> （あなたの名前または会社名）</p>
                <p className="text-gray-700"><strong>メールアドレス:</strong> support@persona-ai.example.com</p>
                <p className="text-gray-700"><strong>ウェブサイト:</strong> https://persona-ai.example.com</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
