# 🐛 バグ修正ワークフロー（実践ガイド）

## 🚨 緊急度別の対応フロー

### 🔴 **レベル1: 緊急（サービス停止）**
**症状**: サーバーダウン、ログイン不可、全ユーザー影響

**対応時間**: 即座（5-15分以内）

```bash
# 1. 即座にロールバック（修正前）
# Railway:
railway rollback  # 前回のデプロイに戻す

# Cloudflare Pages:
# ダッシュボードで「Rollback」ボタンをクリック

# 2. 問題を特定
railway logs  # バックエンドログを確認
# Cloudflare Pagesのログも確認

# 3. このサンドボックスで緊急修正
cd /home/user/webapp/persona-ai-saas
# 修正実施...

# 4. テスト
npm run build
pm2 restart all
curl http://localhost:3001/health

# 5. 即座にデプロイ
git add .
git commit -m "hotfix: 緊急修正 - サーバークラッシュを解消"
git push origin main

# 6. デプロイ完了を確認（2-5分）
# https://your-app.com にアクセスして動作確認
```

---

### 🟠 **レベル2: 重要（一部機能停止）**
**症状**: チャット機能が動かない、決済エラー、一部ユーザー影響

**対応時間**: 1-2時間以内

```bash
# 1. エラーログを確認
railway logs --tail 100 | grep ERROR

# 2. 再現を試す
curl -X POST https://api.your-app.com/api/chat \
  -H "Authorization: Bearer xxx" \
  -d '{"message":"test"}'

# 3. このサンドボックスで修正
cd /home/user/webapp/persona-ai-saas/backend/src/routes
# Edit ツールで該当ファイルを修正

# 4. ローカルテスト
npm run build
pm2 restart persona-ai-backend
curl http://localhost:3001/api/chat  # 動作確認

# 5. GitHubにプッシュ
git add .
git commit -m "fix: チャットAPIのエラーハンドリングを改善"
git push origin main

# 6. 本番デプロイ完了を確認（5-10分）
```

---

### 🟡 **レベル3: 通常（UI不具合、軽微なバグ）**
**症状**: ボタンが表示されない、レイアウト崩れ、特定条件でのエラー

**対応時間**: 1日以内

```bash
# 1. 問題を再現
# ブラウザで該当ページを開いてF12でエラー確認

# 2. このサンドボックスで修正
cd /home/user/webapp/persona-ai-saas/frontend/src
# Edit ツールで該当コンポーネントを修正

# 3. ローカルでテスト
npm run dev
# ブラウザで動作確認

# 4. GitHubにプッシュ
git add .
git commit -m "fix: ダッシュボードのレスポンシブ対応を修正"
git push origin main

# 5. 自動デプロイ完了を確認（2-3分）
```

---

## 🔍 **バグの特定方法**

### バックエンドのバグ

```bash
# 1. Railwayのログを確認
railway logs --tail 200

# よくあるエラーパターン:
# - "Cannot read property 'userId' of undefined" → 認証ミドルウェアの問題
# - "Prisma error: Record not found" → データベースクエリの問題
# - "CORS error" → CORS設定の問題
# - "JWT malformed" → トークン生成/検証の問題

# 2. データベースの状態を確認
railway run psql
SELECT * FROM "User" WHERE email = 'test@example.com';

# 3. 環境変数を確認
railway variables
```

### フロントエンドのバグ

```bash
# 1. ブラウザのコンソールを確認
# - F12 → Console タブ
# - Network タブで失敗したAPIリクエストを確認

# よくあるエラーパターン:
# - "401 Unauthorized" → トークンが無効/期限切れ
# - "404 Not Found" → APIパスが間違っている
# - "CORS policy" → バックエンドのCORS設定不足
# - "Cannot read property 'map' of undefined" → データ構造の不一致

# 2. Cloudflare Pagesのログを確認
npx wrangler pages deployment tail --project-name persona-ai-saas
```

---

## 🛠️ **よくあるバグと修正方法**

### バグ1: 「管理者権限がありません」

**原因**: JWTトークンに `role` が含まれていない

**修正**:
```typescript
// backend/src/routes/auth.ts (行132付近)
const token = generateToken({ 
  userId: user.id, 
  email: user.email,
  role: user.role  // ← これを追加
});
```

**再デプロイ**: `git push origin main`

---

### バグ2: 「POST /api/personas 500 エラー」

**原因**: `userId` が `undefined`

**修正**:
```typescript
// backend/src/routes/personas.ts
router.post('/', authenticate, async (req, res) => {
  const userId = req.user?.userId;
  
  // ガードを追加
  if (!userId) {
    return res.status(401).json({ error: 'ユーザーIDが取得できません' });
  }
  
  // 以降の処理...
});
```

---

### バグ3: 「広告バナーが表示されない」

**原因**: UTF-8エンコードの問題

**修正**:
```typescript
// frontend/src/utils/dummyBanners.ts
const utf8ToBase64 = (str: string): string => {
  return btoa(unescape(encodeURIComponent(str)));
};

export const dummyBanners = {
  bottomBanner: 'data:image/svg+xml;base64,' + utf8ToBase64(`...`)
};
```

---

### バグ4: 「CORS エラー」

**修正**:
```typescript
// backend/src/server.ts
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://your-app.pages.dev',
    'https://persona-ai.pages.dev'
  ],
  credentials: true
}));
```

---

## 📊 **デバッグチェックリスト**

本番環境でバグが発生したら、以下を順番に確認：

### ✅ バックエンド
- [ ] Railway のログでエラーメッセージを確認
- [ ] データベース接続が正常か確認（`railway run prisma studio`）
- [ ] 環境変数が正しく設定されているか確認
- [ ] 最近のデプロイ履歴を確認（ロールバック候補）

### ✅ フロントエンド
- [ ] ブラウザコンソールでJavaScriptエラーを確認
- [ ] Network タブで失敗したAPIリクエストを確認
- [ ] LocalStorage にトークンが保存されているか確認
- [ ] Cloudflare Pages のビルドログを確認

### ✅ 共通
- [ ] Sentry でエラーレポートを確認
- [ ] UptimeRobot でダウンタイムを確認
- [ ] GitHub の最近のコミットを確認
- [ ] ユーザーからの報告内容を再現できるか確認

---

## 🔧 **このサンドボックスの使い方**

### いつでもバグ修正可能

```bash
# 1. GenSparkで「修正してほしいバグ」を説明
「ユーザー: チャット機能で500エラーが出ます」

# 2. AIが自動的に:
#    - エラーログを確認
#    - 該当ファイルを特定
#    - 修正コードを提案
#    - テストを実行
#    - GitHubにプッシュ

# 3. あなたは結果を確認するだけ
```

### サンドボックスの利点

- ✅ **本番と同じ環境**: Node.js, PostgreSQL, PM2
- ✅ **即座にテスト**: コード修正→ビルド→テスト を数秒で実行
- ✅ **安全**: 本番に影響しない独立環境
- ✅ **いつでもアクセス可能**: GenSparkから24時間対応

---

## 📞 **緊急時の連絡先**

### サービスダウン時の対応優先順位

1. **Railway でロールバック**（最優先・1分）
2. **Cloudflare Pages でロールバック**（1分）
3. **GenSparkでバグ修正を依頼**（5-15分）
4. **手動でGitをrevert**（緊急時）

### リソース

- **Railway ステータス**: https://status.railway.app
- **Cloudflare ステータス**: https://www.cloudflarestatus.com
- **GenSpark AI**: このチャット（いつでもバグ修正対応）
- **GitHub**: https://github.com/yourusername/persona-ai-saas

---

## 💡 **プロのTips**

### Tip 1: デプロイ前に必ずテスト

```bash
# ローカルで完全テスト
npm run build
pm2 restart all
npm test  # テストスイートを実行

# 問題なければデプロイ
git push origin main
```

### Tip 2: 小さい変更を頻繁にデプロイ

❌ **悪い例**: 10個の機能を一気に実装してデプロイ  
✅ **良い例**: 1機能ずつ実装→テスト→デプロイ

### Tip 3: エラーログを定期的にチェック

```bash
# 毎日1回確認する習慣を
railway logs --tail 50 | grep ERROR
```

### Tip 4: Sentry でエラーを自動監視

```bash
# 一度設定すれば、エラー発生時に自動でメール通知
npm install @sentry/node @sentry/react
```

---

## 🎓 **学習リソース**

- **Railway ドキュメント**: https://docs.railway.app
- **Cloudflare Pages ドキュメント**: https://developers.cloudflare.com/pages
- **Prisma ドキュメント**: https://www.prisma.io/docs
- **Express.js ドキュメント**: https://expressjs.com
- **React ドキュメント**: https://react.dev

---

**重要**: バグ修正で困ったら、GenSparkにいつでも相談してください！  
このサンドボックス環境で即座に修正→テスト→デプロイが可能です。
