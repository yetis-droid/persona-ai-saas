# Persona AI SaaS

クリエイター・アーティストの人格・世界観を構造化し、AIとして安全に自動運用するSaaS

## 目次

- [機能](#機能)
- [技術スタック](#技術スタック)
- [プロジェクト構造](#プロジェクト構造)
- [セットアップ](#セットアップ)
- [開発環境の起動](#開発環境の起動)
- [デプロイ](#デプロイ)
- [セキュリティ](#セキュリティ)
- [ライセンス](#ライセンス)

## 機能

### ✅ 完成済み機能

- **ユーザー認証**
  - メールアドレス/パスワード認証
  - Google OAuth 2.0対応
  - JWT認証（httpOnly cookie）

- **人格管理**
  - 多段階フォーム（8ステップ）での人格作成
  - 22項目の詳細設定
  - システムプロンプト自動生成
  - 人格の編集・削除

- **チャット機能**
  - Web UIでのリアルタイムチャット
  - AI応答生成（Claude Sonnet 4.5使用）
  - 固定NG話題の自動検知・拒否
  - 会話ログの自動保存

- **会話ログ管理**
  - 会話履歴の一覧表示
  - キーワード検索
  - 5段階評価機能
  - ページネーション

- **LINE連携**
  - LINE Messaging API統合
  - Webhook対応
  - 署名検証
  - 自動応答

- **ダッシュボード**
  - 統計情報表示（会話数、平均評価など）
  
- **セキュリティ（なりすまし防止システム）**
  - 5段階の多層防御システム
  - メール認証必須化
  - 公式バッジシステム（3種類: クリエイター/パートナー/認証済み）
  - 管理者専用セキュリティダッシュボード
  - 不正検知AI（1分間30回以上の操作を自動ブロック）
  - 完全な監査ログ（全操作記録）
  
- **広告システム**
  - 画面下部固定バナー（728x90px）
  - インタースティシャル広告（300x250px）
  - リワード広告（320x480px、+1チケット獲得）
  - アフィリエイトバナー2枚（Canva Pro、Adobe CC）
  - Freeプランのみ表示、Premiumは広告なし
  
- **収益化**
  - Stripe決済統合
  - サブスクリプション管理（Free / Premium）
  - チケット前払いシステム
  - 銀行口座自動振込設定
  - グラフ表示（Chart.js使用）
  - 日別会話数の推移

### 🚧 今後の実装予定

- Discord連携
- Slack連携
- 多言語対応
- プランごとの機能制限
- 決済システム統合

## 技術スタック

### フロントエンド
- **React 18+** with TypeScript
- **Vite** - ビルドツール
- **TailwindCSS** - スタイリング
- **React Router v6** - ルーティング
- **React Hook Form** - フォーム管理
- **Zustand** - 状態管理
- **Axios** - HTTP通信
- **Chart.js + react-chartjs-2** - グラフ表示

### バックエンド
- **Node.js 20+**
- **Express.js** - Webフレームワーク
- **TypeScript**
- **Prisma** - ORM
- **PostgreSQL** - データベース
- **bcryptjs** - パスワードハッシュ化
- **jsonwebtoken** - JWT認証
- **Anthropic Claude API** - AI応答生成
- **LINE Messaging API** - LINE連携

### インフラ
- **Vercel** - フロントエンドホスティング（推奨）
- **Railway** - バックエンド + PostgreSQL（推奨）
- 他のホスティングサービスも利用可能

## プロジェクト構造

```
persona-ai-saas/
├── backend/                 # バックエンド
│   ├── prisma/
│   │   └── schema.prisma   # データベーススキーマ
│   ├── src/
│   │   ├── middleware/
│   │   │   └── auth.ts     # JWT認証ミドルウェア
│   │   ├── routes/
│   │   │   ├── auth.ts     # 認証API
│   │   │   ├── personas.ts # 人格管理API
│   │   │   ├── chat.ts     # チャットAPI
│   │   │   ├── line.ts     # LINE連携API
│   │   │   └── dashboard.ts # ダッシュボードAPI
│   │   ├── utils/
│   │   │   └── claudeApi.ts # Claude API操作
│   │   └── server.ts       # サーバーエントリーポイント
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── frontend/                # フロントエンド
│   ├── src/
│   │   ├── pages/          # ページコンポーネント
│   │   │   ├── Login.tsx
│   │   │   ├── Signup.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── PersonaForm.tsx
│   │   │   ├── Chat.tsx
│   │   │   ├── Conversations.tsx
│   │   │   ├── Settings.tsx
│   │   │   └── Terms.tsx
│   │   ├── stores/         # 状態管理
│   │   │   ├── authStore.ts
│   │   │   └── personaFormStore.ts
│   │   ├── types/          # TypeScript型定義
│   │   │   └── index.ts
│   │   ├── utils/
│   │   │   └── api.ts      # Axios設定
│   │   ├── App.tsx         # ルーティング
│   │   ├── main.tsx        # エントリーポイント
│   │   └── index.css       # グローバルスタイル
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── .env.example
│
└── README.md               # このファイル
```

## セットアップ

### 前提条件

- **Node.js 20以上**
- **PostgreSQL 14以上**
- **Claude API キー** （Anthropic）
- **Google OAuth クライアントID** （オプション）

### 1. リポジトリのクローン

```bash
git clone <your-repo-url>
cd persona-ai-saas
```

### 2. バックエンドのセットアップ

```bash
cd backend

# 依存関係のインストール
npm install

# 環境変数の設定
cp .env.example .env
# .env ファイルを編集して必要な環境変数を設定
```

#### .env ファイルの設定

```env
DATABASE_URL=postgresql://user:password@localhost:5432/persona_ai_saas
JWT_SECRET=your-jwt-secret-change-in-production
JWT_REFRESH_SECRET=your-refresh-secret-change-in-production
CLAUDE_API_KEY=sk-ant-xxxxx
GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxxxx
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
PORT=3001
```

#### データベースのセットアップ

```bash
# Prisma マイグレーション実行
npx prisma migrate dev

# Prisma Client生成
npx prisma generate
```

### 3. フロントエンドのセットアップ

```bash
cd ../frontend

# 依存関係のインストール
npm install

# 環境変数の設定
cp .env.example .env
# .env ファイルを編集
```

#### .env ファイルの設定

```env
VITE_API_URL=http://localhost:3001
VITE_GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
```

## 開発環境の起動

### バックエンド

```bash
cd backend
npm run dev
```

サーバーは http://localhost:3001 で起動します。

### フロントエンド

```bash
cd frontend
npm run dev
```

フロントエンドは http://localhost:5173 で起動します。

### データベースGUI（オプション）

```bash
cd backend
npx prisma studio
```

Prisma Studioが http://localhost:5555 で起動します。

## デプロイ

### バックエンド（Railway）

1. **Railwayプロジェクト作成**
   - https://railway.app/ でアカウント作成
   - 新しいプロジェクトを作成

2. **PostgreSQLの追加**
   - Railwayダッシュボードで「New」→「Database」→「PostgreSQL」を選択

3. **GitHubリポジトリの連携**
   - 「New」→「GitHub Repo」でリポジトリを選択
   - Root Directoryを `backend` に設定

4. **環境変数の設定**
   - RailwayダッシュボードでVariablesタブを開く
   - `.env.example`の内容を参考に環境変数を設定
   - `DATABASE_URL`はPostgreSQLサービスから自動的に設定される

5. **ビルド設定**
   - Build Command: `npm install && npx prisma generate && npm run build`
   - Start Command: `npx prisma migrate deploy && node dist/server.js`

6. **デプロイ**
   - 自動デプロイが実行される
   - URLをコピーしておく（例: `https://your-app.railway.app`）

### フロントエンド（Vercel）

1. **Vercelプロジェクト作成**
   - https://vercel.com/ でアカウント作成
   - 「New Project」をクリック

2. **GitHubリポジトリの連携**
   - リポジトリを選択
   - Root Directoryを `frontend` に設定

3. **環境変数の設定**
   - `VITE_API_URL`: Railwayのバックエンドのurl
   - `VITE_GOOGLE_CLIENT_ID`: Google OAuthクライアントID

4. **デプロイ**
   - 「Deploy」をクリック
   - デプロイ完了後、URLが発行される

5. **バックエンドのCORS設定更新**
   - RailwayのバックエンドプロジェクトにVercelのURLを追加
   - `FRONTEND_URL`環境変数を更新

### LINE連携の設定

1. **LINE Developersでチャネル作成**
   - https://developers.line.biz/ にアクセス
   - プロバイダーとMessaging APIチャネルを作成

2. **認証情報の取得**
   - Channel Access Token（長期）を発行
   - Channel Secretをコピー

3. **アプリケーションに設定**
   - フロントエンドの設定画面でトークンとシークレットを入力
   - Webhook URLをコピー

4. **LINE Developersの設定**
   - Webhook URLを設定
   - Webhookを有効化
   - 応答メッセージを無効化

## セキュリティ

### 🛡️ なりすまし防止システム（5段階多層防御）

**完全なセキュリティガイド**: [SECURITY_GUIDE.md](./SECURITY_GUIDE.md)

1. **メール認証必須化**
   - 重要な操作（人格作成、課金など）はメール認証必須
   - 未認証ユーザーの操作をブロック

2. **公式バッジシステム**
   - ✨ 公式クリエイター
   - 🤝 公式パートナー
   - ✓ 認証済み
   - 管理者のみが付与・剥奪可能

3. **管理者専用セキュリティダッシュボード**
   - 公式バッジの付与・剥奪
   - なりすまし人格の停止
   - 公式アカウント一覧
   - URL: `/admin/security`

4. **不正検知AI**
   - 1分間30回以上の操作を自動ブロック
   - 異常なアクセスパターンを検知
   - IPアドレス・ユーザーエージェント記録

5. **完全な監査ログ**
   - すべての重要操作を記録
   - 誰が・いつ・何をしたかを追跡可能
   - `UsageLog` テーブルで管理

**新規エンドポイント**:
- `POST /api/admin/verify-user` - 公式バッジ付与
- `POST /api/admin/revoke-badge` - 公式バッジ剥奪
- `GET /api/admin/official-accounts` - 公式アカウント一覧
- `POST /api/admin/suspend-persona` - 人格停止

### 固定NG話題（必ず拒否）

以下の話題は自動的に検知され、拒否されます：

1. **恋愛** - 恋愛関係、デート、告白など
2. **政治** - 政治的意見、選挙、政党など
3. **宗教** - 宗教的信仰、教義など
4. **医療** - 診断、治療、薬の処方など
5. **法律** - 法律相談、訴訟など
6. **投資** - 株、FX、仮想通貨の投資助言など
7. **他者批判** - 特定の人物や団体への批判
8. **個人情報** - プライバシーに関わる情報

### システムプロンプトの必須ルール

すべての人格AIには以下のルールが組み込まれています：

1. 本人になりすます表現を絶対に使わない
2. 上記のNG話題には必ず断る
3. 医療/法律/投資の助言、診断、命令は禁止
4. 依存を誘発する表現禁止
5. グレーゾーンは安全側に倒して断る

### セキュリティベストプラクティス

- パスワードはbcryptでハッシュ化
- JWTはhttpOnly cookieで保存
- API呼び出しにはレートリミット実装
- LINE WebhookはHMAC-SHA256で署名検証
- 環境変数は.envファイルで管理（Gitにコミットしない）

## API仕様

### 認証

- `POST /api/auth/signup` - ユーザー登録
- `POST /api/auth/login` - ログイン
- `POST /api/auth/logout` - ログアウト
- `POST /api/auth/google` - Google OAuth
- `GET /api/auth/me` - 現在のユーザー情報

### 人格管理

- `GET /api/personas` - 人格一覧
- `POST /api/personas` - 人格作成
- `GET /api/personas/:id` - 人格詳細
- `PUT /api/personas/:id` - 人格更新
- `DELETE /api/personas/:id` - 人格削除

### チャット

- `POST /api/chat` - チャット送信
- `GET /api/chat/conversations` - 会話ログ取得
- `PUT /api/chat/conversations/:id/rating` - 評価更新

### LINE連携

- `POST /api/line/webhook/:personaId` - LINE Webhook

### ダッシュボード

- `GET /api/dashboard?personaId=xxx` - 統計情報

## トラブルシューティング

### データベース接続エラー

```bash
# PostgreSQLが起動しているか確認
sudo systemctl status postgresql

# データベースが存在するか確認
psql -U postgres -l
```

### Prismaエラー

```bash
# Prisma Clientを再生成
npx prisma generate

# マイグレーションをリセット
npx prisma migrate reset
```

### Claude APIエラー

- APIキーが正しく設定されているか確認
- APIクレジットが残っているか確認
- レート制限に達していないか確認

## ライセンス

MIT License

## 貢献

プルリクエストを歓迎します！大きな変更の場合は、まずissueを開いて変更内容を議論してください。

## サポート

問題が発生した場合は、GitHubのIssuesで報告してください。

---

**開発者**: [あなたの名前]  
**連絡先**: [your-email@example.com]  
**プロジェクトURL**: https://github.com/your-username/persona-ai-saas
