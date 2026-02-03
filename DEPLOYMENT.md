# 本番デプロイメントガイド

## 1. バックエンドをRailwayにデプロイ

### 初回デプロイ
```bash
# 1. Railway CLI をインストール（ローカルマシン）
npm install -g @railway/cli

# 2. Railwayにログイン
railway login

# 3. プロジェクトを作成
railway init

# 4. PostgreSQLを追加
railway add postgresql

# 5. 環境変数を設定
railway variables set JWT_SECRET=your-production-secret-key
railway variables set STRIPE_SECRET_KEY=sk_live_...
railway variables set GROQ_API_KEY=gsk_...

# 6. デプロイ
cd backend
railway up
```

### バグ修正後の再デプロイ
```bash
# Gitにプッシュするだけで自動デプロイ
git push origin main

# または手動デプロイ
railway up
```

---

## 2. フロントエンドをCloudflare Pagesにデプロイ

### 初回デプロイ
```bash
cd frontend

# 1. ビルド
npm run build

# 2. Cloudflare Pagesにデプロイ
npx wrangler pages deploy dist --project-name persona-ai-saas

# 3. 環境変数を設定
npx wrangler pages secret put VITE_API_URL --project-name persona-ai-saas
# 値: https://your-backend.railway.app
```

### バグ修正後の再デプロイ
```bash
# 1. ビルド
npm run build

# 2. デプロイ
npx wrangler pages deploy dist --project-name persona-ai-saas
```

---

## 3. CI/CDで自動デプロイ（GitHub Actions）

`.github/workflows/deploy.yml`:
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - name: Install Railway CLI
        run: npm install -g @railway/cli
      - name: Deploy Backend
        run: cd backend && railway up
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - name: Build Frontend
        run: cd frontend && npm install && npm run build
      - name: Deploy to Cloudflare Pages
        run: npx wrangler pages deploy frontend/dist
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
```

**これで、GitHubにプッシュするだけで自動デプロイされます！**

---

## 4. バグ修正の実例

### 例1: APIエンドポイントのバグ修正

**問題**: `/api/personas` が500エラーを返す

**修正手順**:
```bash
# 1. サンドボックス環境で修正
cd /home/user/webapp/persona-ai-saas/backend/src/routes
# Edit ツールで personas.ts を修正

# 2. ローカルテスト
npm run build
pm2 restart persona-ai-backend
curl http://localhost:3001/api/personas

# 3. GitHubにプッシュ
git add .
git commit -m "fix: personas API のuserIdバリデーションを修正"
git push origin main

# 4. 自動デプロイが開始（5-10分で完了）
```

---

### 例2: フロントエンドのUIバグ修正

**問題**: ダッシュボードのグラフが表示されない

**修正手順**:
```bash
# 1. サンドボックス環境で修正
cd /home/user/webapp/persona-ai-saas/frontend/src/components
# Edit ツールで Chart.tsx を修正

# 2. ローカルテスト
npm run dev
# ブラウザで確認

# 3. GitHubにプッシュ
git add .
git commit -m "fix: グラフコンポーネントのデータ形式を修正"
git push origin main

# 4. Cloudflare Pagesが自動ビルド＆デプロイ（2-3分）
```

---

## 5. ロールバック（修正が失敗した場合）

### Railway（バックエンド）
```bash
# 1. Railwayコンソールで「Deployments」タブを開く
# 2. 前回の成功したデプロイメントを選択
# 3. 「Redeploy」ボタンをクリック

# またはGitで戻す
git revert HEAD
git push origin main
```

### Cloudflare Pages（フロントエンド）
```bash
# 1. Cloudflare Pagesダッシュボードで「Deployments」を開く
# 2. 前回の成功したデプロイメントを選択
# 3. 「Rollback to this deployment」をクリック

# またはGitで戻す
git revert HEAD
npm run build
npx wrangler pages deploy dist
```

---

## 6. 監視とアラート

### エラー監視（推奨ツール）

**Sentry（無料プラン: 5,000 errors/month）**:
```bash
# バックエンドに追加
npm install @sentry/node

# backend/src/server.ts
import * as Sentry from "@sentry/node";
Sentry.init({ dsn: "your-sentry-dsn" });

# フロントエンドに追加
npm install @sentry/react

# frontend/src/main.tsx
import * as Sentry from "@sentry/react";
Sentry.init({ dsn: "your-sentry-dsn" });
```

**アップタイム監視**:
- **UptimeRobot**（無料・推奨）: https://uptimerobot.com
- 5分ごとにAPIをチェック、ダウン時にメール通知

---

## 7. バックアップ戦略

### データベースバックアップ（Railway）
```bash
# 毎日自動バックアップ（Railwayが自動実行）
# 手動バックアップ:
railway db backup create
```

### コードバックアップ
- GitHub（自動）
- このサンドボックス環境からProjectBackupツールで定期バックアップ

---

## 緊急連絡先・リソース

- **Railway サポート**: https://railway.app/help
- **Cloudflare サポート**: https://discord.gg/cloudflaredev
- **Prisma ドキュメント**: https://www.prisma.io/docs
- **このサンドボックス**: いつでもバグ修正可能
